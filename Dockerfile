FROM node:18-slim

RUN apt update -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev openssl -y

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . /app

RUN yarn build

CMD [ "yarn", "start" ]