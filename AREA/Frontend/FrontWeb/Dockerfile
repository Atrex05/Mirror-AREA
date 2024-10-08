FROM node:lts-alpine AS build-stage
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.* ./

RUN npm ci

COPY . .

RUN npm run build

RUN ls -la /app/dist

FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html

# Configuration de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]