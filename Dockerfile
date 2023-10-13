FROM node:16-bullseye AS base

WORKDIR /app

COPY ./package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

ENV test="test"

ENTRYPOINT [ "/bin/sh" ]