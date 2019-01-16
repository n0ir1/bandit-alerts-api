FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . .

RUN yarn

EXPOSE 8080
CMD ["yarn", "start:prod"]
