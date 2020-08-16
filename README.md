# Setup
1. Install Docker and Docker-compose
2. Install rethink-db
3. Create self-signed certs and place them in a folder in the main repo called "certs".
    1. Name the files "mealio.crt" and "Mealio.key"
4. Run "docker-compose up -d --build" to start everything

# Build for production
## Backend
1. Run "npm run build"
2. Run "npm run push"

## Frontend
1. Run "npm run prodBuild"
2. Run "npm run push"

# Known issues
## Backend
* The first time starting up the development backend, it can complain about missing tables.
The workaround is to save a file in the backend folder a couple of times, until the errors stop displaying in the docker logs for backend.

Create self-signed certs
https://devcenter.heroku.com/articles/ssl-certificate-self