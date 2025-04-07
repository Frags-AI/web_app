# syntax=docker/dockerfile:1

FROM node:latest AS builder

WORKDIR /usr/src/app
COPY package*.json ./

ENV VITE_CLERK_PUBLISHABLE_KEY="pk_test_c29saWQtZHVja2xpbmctMzQuY2xlcmsuYWNjb3VudHMuZGV2JA"
ENV VITE_CLERK_SIGN_IN_URL="/login"
ENV VITE_CLERK_SIGN_UP_URL="/signup"
ENV VITE_STRIPE_PUBLISHABLE_KEY="pk_test_51QkXckCMcuLX2RyDQCzRYxFRLZ7S8K0pDpN0Bn2fp1TnONPNKAr4NTntXdS1QWdAgMg8vgyp1IEH9l0KwkPwGQHL00BeyET3XM"
ENV VITE_BASE_URL="http://localhost:5173"
ENV VITE_API_URL="http://localhost:3000"

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

