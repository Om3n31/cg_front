FROM node:16-bullseye AS base

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

ENTRYPOINT [ "/bin/sh" ]