const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const socketIO = require("socket.io");
const http = require("http");

const users = require("./routes/api/users");
const jobs = require("./routes/api/jobs");
const Job = require("./models/Job");
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use("/api/", (req, res, next) => {
  next();
});
const connectionString = "" + process.env.CONNECTION_STRING;
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

const server = http.createServer(app);
const io = socketIO(server, {
  path: "/socket/",
});

let sockets = [];
let python_socket;

io.on("connection", (socket) => {
  if (socket.handshake.headers.name === "python") {
    python_socket = socket;
  }

  // if(socket.handshake.headers.name === 'user')
  //     python_socket = socket;

  socket.on("getJobsByUser", (user) => {
    let { userId } = user;
    sockets[userId] = socket;

    Job.find({ userId }).then((jobs) => {
      if (!jobs) {
        return res.status(400).json({ error: "No jobs found" });
      } else {
        socket.emit("jobsByUser", jobs);
      }
    });
  });

  if (python_socket) {
    socket.on("newJob", (job) => {
      let { id, link } = job;

      python_socket.emit("new_job", { id, link });
    });

    socket.on("getJobs", (user) => {
      python_socket.emit("get_jobs", user);
    });

    socket.on("deleteJob", (job) => {
      python_socket.emit("remove_job", job);
    });

    socket.on("resumeJob", (job) => {
      python_socket.emit("resume_job", job);
    });

    socket.on("pauseJob", (job) => {
      python_socket.emit("pause_job", job);
    });

    socket.on("downloadJob", (job) => {
      python_socket.emit("download_job", job);
    });

    python_socket.on("error", (error) => {
      socket.emit("err", error);
    });

    python_socket.on("job_add_success", () => {
      socket.emit("job_add_success");
    });

    python_socket.on("get_jobs_res", (res) => {
      socket.emit("get_jobs_res", res);
    });

    python_socket.on("download_ready", (res) => {
      socket.emit("download_ready", res);
    });
  }
});

app.use(passport.initialize());

require("./utils/passport")(passport);

const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({register});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.use("/api/users", users);
app.use("/api/jobs", jobs);

app.get("/", (req, res) => {
  res.send("server up and running.");
});

app.get("/health", (req, res) => {
  res.send("server is running.");
});

app.get("/ready", (req, res) => {
  res.send("server is ready.");
});

const port = process.env.PORT || 5000;

server.listen(port, () =>
  console.log(`Server v8 up and running on port ${port} !`)
);