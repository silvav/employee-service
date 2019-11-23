FROM node:12.8.1-alpine

WORKDIR /usr/src/app

USER node

COPY . .
