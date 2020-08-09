FROM node:10
WORKDIR /usr/src/app

COPY config config
COPY lib lib
COPY routes routes
COPY utils utils
COPY images images
COPY parsers parsers
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY server.js server.js
COPY wsServer.js wsServer.js

RUN ls -la /usr/src/app

RUN npm install -g nodemon

RUN npm install

CMD ["npm", "run", "start"]