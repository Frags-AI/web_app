# syntax=docker/dockerfile:1

FROM node:latest AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

