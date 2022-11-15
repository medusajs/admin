FROM node:18-slim

RUN apt-get update && apt-get install python3 make g++ -y

RUN npm install -g gatsby-cli

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

RUN yarn build

COPY . /app/

EXPOSE 7000

CMD ["gatsby", "develop", "-H", "0.0.0.0", "-p", "7000"]
