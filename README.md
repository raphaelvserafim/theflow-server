
# Base Server TS

### An awesome project based on the Ts.ED framework, providing a strong foundation to kickstart your Node.js API development with TypeScript.

# Getting Started

### Follow these steps to set up and run the project locally:

# Prerequisites

## Ensure you have the following installed:

- Node.js (version 14.x or higher)
- Yarn package manager

# Installation

1. Clone the repository:

   git clone git@github.com:raphaelvserafim/base-server-ts.git
   cd base-server-ts

2. Install dependencies:

   yarn install

# Running the Server

## Development

To start the server in development mode with live reload:

   yarn start

## Production

To build the project for production and run it:

   yarn build
   yarn start:prod

# Project Structure

A brief overview of the project structure:

- src/: Contains all source code files.
- config/: Configuration files for the project.
- controllers/: API and page controllers.
- views/: EJS templates for server-side rendering.
- dist/: Compiled code after running the build.

# Scripts

- build: Compiles the TypeScript code.
- start: Runs the server in development mode.
- start:prod: Runs the server in production mode.
- test: Runs linting and unit tests.
- barrels: Organizes module exports using Barrelsby.

# PM2 Configuration

To manage the application with PM2:

   pm2 startup
   pm2 start npm --name server-base-ts-dev -- run "start"
   pm2 start npm --name server-base-ts-prod -- run "start:prod"
   pm2 save

# Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

# License

This project is licensed under the MIT License - see the LICENSE file for details.
