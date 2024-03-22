# GitHub App
An app to track specific user stats on GitHub

## Getting started
### Pre-requisites
- Node.js installed on your system

### Installation
1. Clone the repository
2. Add an `.env` file to the root of the backend project
3. Add `GITHUB_ACCESS_TOKEN` to the `.env` file with your GitHub personal access token
4. Add `PORT` to the `.env` file with the port you want the server to run on
4. Run `npm run install:all` to install dependencies
5. Run `npm run start` to start the server
6. Run `npm run test` to run tests

## Features
### Frontend
- Responsible for displaying the UI and handling user input
- Read the frontend [README.md](./frontend/README.md) for more detail
### Backend
- Responsible for handling requests and interacting with the database and MusixMatch API
- Read the backend [README.md](./backend/README.md) for more detail
### Shared
- Shared resources (types, interfaces, etc) are stored in the `shared` directory