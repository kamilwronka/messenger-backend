FROM node:10.15.3-alpine

ARG AWS_ACCESS
ARG AWS_SECRET
ARG MONGODB_URI

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 4000

ENTRYPOINT ["yarn", "start"]
