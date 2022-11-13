#phase 1
FROM node:16-alpine as builder
WORKDIR /app
COPY ["package.json","package-lock.json","./"]
RUN npm install
COPY . .
RUN npm run build

#phase 2
FROM nginx:1.23.2-alpine as production
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
COPY  ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80