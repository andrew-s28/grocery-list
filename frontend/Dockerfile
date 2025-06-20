# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-alpine AS builder
USER node
WORKDIR /app
COPY --chown=node . .
RUN npm ci
RUN npm run build

FROM nginx:alpine AS serve
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]