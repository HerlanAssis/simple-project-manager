# BUILD PHASE
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# PRODUCTION PHASE
FROM nginx:1.15
COPY default.conf /etc/nginx/conf.d/
COPY --from=builder /app/build /usr/share/nginx/html
