# syntax=docker/dockerfile:1
FROM node:19-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
EXPOSE 5000
CMD [ "node", "server.js" ]