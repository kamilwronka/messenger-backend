FROM node:10.15.3-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

ENV MONGODB_URI=mongodb://localhost:27017/messenger

EXPOSE 4000

ENTRYPOINT ["yarn", "start"]
