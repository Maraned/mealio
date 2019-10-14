const fs = require("fs"); // Or `import fs from "fs";` with ESM
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

const frontendRepo = 'git@github.com:Maraned/cibus.git';
const backendRepo = 'git@github.com:Maraned/cibus-backend.git';
const frontendPath = path.join(__dirname, '..', 'frontend');
const backendPath = path.join(__dirname, '..', 'backend');

console.log('frontendPath', frontendPath)
console.log('backendPath', backendPath)

async function createFolder(folderName) {
  const { stdout, stderr } = await exec(`mkdir ${folderName}`, {
    cwd: path.join(__dirname, '..')
  });
  console.log(stdout);
  console.log(stderr);
}

async function cloneRepo(folderName, repo, path) {
  await createFolder(folderName)
  const cloneCommand = `git clone ${repo}`;
  console.log('path', path)
  const { stdout, stderr } = await exec(cloneCommand, {
    cwd: path
  });
  console.log(stdout);
  console.log(stderr);
}

if (!fs.existsSync(frontendPath)) {
  cloneRepo('frontend', frontendRepo, frontendPath);
}

if (!fs.existsSync(backendPath)) {
  cloneRepo('backend', backendRepo, backendPath);
}
