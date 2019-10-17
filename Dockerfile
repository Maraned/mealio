# # Stage 1 - the build process
# FROM node:10
# WORKDIR /usr/src/app
# COPY package.json package.json
# COPY package-lock.json package-lock.json
# COPY src src

# RUN npm install

# RUN npm run build

# # Stage 2 - the production environment
# FROM nginx:1.12-alpine
# COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


FROM node:8 as web-build

#Setting the working directory as /app
WORKDIR /app

#Copying package.json to Docker Image
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY public public
COPY src src

#Installing all dependencies.
RUN npm install

# Running the dev server.
CMD ["npm", "build"]