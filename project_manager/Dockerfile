# BUILD PHASE
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN yarn
COPY . .
RUN yarn cache clean
RUN yarn run build

# PRODUCTION PHASE
FROM nginx:1.15
COPY default.conf /etc/nginx/conf.d/
COPY --from=builder /app/build /usr/share/nginx/html
