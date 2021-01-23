# Project Tracker
Web application that helps track your progress on tasks.

## USAGE

1. create a oracle sql database using docker *https://ocw.cs.pub.ro/courses/bd2/resurse/docker*
1. create tables and procedures using /backend/sql/all.sql
1. setup environment variables, create a .env file using backend/.env-example as template. (debug backend port must have the value 8080 -> see /frontend/package.json proxy)
1. run `npm run build` to install all dependencies and compile the code
1. run `npm start start_backend` and `npm start start_frontend` to deploy debug version
1. access localhost:8000