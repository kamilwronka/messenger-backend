FROM node:8.11.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 4000

ENTRYPOINT ["yarn", "start"]
