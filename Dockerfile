FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . .

RUN yarn
RUN yarn build

EXPOSE 8080
CMD ["yarn", "start:prod"]
