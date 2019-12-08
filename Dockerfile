FROM node:10
WORKDIR /usr/src/app

COPY config config 
COPY lib lib
COPY routes routes
COPY setup setup
COPY utils utils
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY server.js server.js

RUN npm install -g nodemon

RUN npm install

CMD ["npm", "run", "start"]