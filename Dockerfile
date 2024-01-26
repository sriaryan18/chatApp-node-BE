FROM node:alpine

WORKDIR /chatAppBE

COPY package.json .

COPY . .

EXPOSE 3000

RUN npm i

CMD ["npm" , "start"]

