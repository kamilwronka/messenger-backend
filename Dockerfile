FROM node:8.11.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

ENV MONGODB_URI=localhost:27017/messenger

EXPOSE 4000

ENTRYPOINT ["yarn", "start"]