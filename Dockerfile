FROM node:10
WORKDIR /usr/src/app

COPY config config 
COPY lib lib
COPY routes routes
COPY utils utils
COPY package.json package.json
COPY server.js server.js
COPY wsServer.js wsServer.js
RUN mkdir -p ~/usr/src/app/images
RUN ls -la /usr/src/app

RUN npm install -g nodemon

RUN npm install
RUN npm install bcrypt
# RUN apt-get install make gcc g++ python && \
#   npm install && \
#   npm rebuild bcrypt --build-from-source && \
#   apt-get remove -y make gcc g++ python
# RUN npm uninstall sharp bcrypt
# RUN npm install sharp bcrypt

CMD ["npm", "run", "start"]