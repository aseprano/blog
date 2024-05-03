## Web blog project
The aim of this project is to make it even easier to fill internet with garbage. Are you tired of Facebook, Twitter (now X), Instagram? Do you feel like you miss the old days when Blogspot or MSN ruled the world?

Don't worry. This blog will make you like you are in the 90s!

### How to start it
You need [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine.
After installing them, just CD into this project folder and then run:

```shell
$ docker-compose up -d
```

### How to run tests in your local environment
This project is based on TypeScript and Node.js (20+).
You can either install it in your local environment, or just use docker. The easiest way is to use Docker and mount this folder in it:

```shell
docker run --rm -it -v.:/home/node node:20-alpine sh
```
After mounting this folder into a node 20 docker container, just run the following command to move to the folder where the code has been mounted and install the project's dependencies:

```shell
cd /home/node
npm i
```

Then, you can run the unit tests with the following:
```shell
npm run test:unit 
```

Alternatively, in order to see the coverage of the project, you can run the following:

```shell
npm run test:cov
```

### How to use the web blog
The blog listens on the port 8090 (you can change it by means of the PORT environment variable in the docker-compose.yml file).

You can open the browser to the following address to see the swagger API documentation:

```text
http://localhost:8090/api
```
## Missing parts
As of now, it just uses a bare mysql database, not really thought to be used at scale. It's just a demo, I wanted to show the use of DDD in the project, and how I'd organize the codebase.

In a real project, with some real deadline and requirements, I'd rather design it in a better way with the following in mind:

- Possibility to use different models for commands and queries
- An ad-hoc model for full-text search or tags search (surely, I'd invest more time to think about a set of models for queries)
- A real event distribution mechanism (like Kafka, or RabbitMQ or the like)
- Some architectural components to project events to different models (based on the queries that we'd like to offer, see previous point)
- Some ORM or the like (in order to make SQL queries easier to write)
- A way to perform migrations
- Some CDK/Terraform/WhateverYouLike mechanism to make it deployable
- A sample CI/CD pipeline to build/test/run coverage/push results (i.e.: to kondukto or other security code analyzers)
- Some integration with DataDog/Loggly to better monitor the app
- A database connection pool (the library I use already provides a pool, but generally I like to hide its implementation) (nothing fancy, just a decorator that implements the Queryable abstraction or something similar)
- Last but not least, a better swagger documentation

I know that it looks like a very long list of ifs and buts, but I had a few hard days and little-to-no time to work on this project (aside from night).
