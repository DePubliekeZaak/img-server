FROM node:18-alpine

WORKDIR /usr/src/app
RUN apk update 
RUN apk add postgresql-client
RUN npm install -g nodemon
COPY ../node/.env .
COPY ../node/package.json .
RUN npm install
COPY ../node/dist .

EXPOSE 3009
CMD [ "nodemon", "app.js" ]

