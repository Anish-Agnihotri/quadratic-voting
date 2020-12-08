<p align="center"><img src="https://github.com/gitcoinco/gitcoinco/raw/master/img/helmet.png" /></p>
<h1 align="center" style="border-bottom: none;">Quadratic Voting (<a href="https://quadraticvote.co">live</a>)</h1>
<h3 align="center">Open-source, real-time QV dashboard.</h3>
<p align="center">Quadratic Voting is the mathematically optimal way to vote in a democratic community, where votes express the <i>degree</i> of your preferences, not just <i>direction</i>. This calculator is an open-source voting application, with development supported by <a href="https://github.com/gitcoinco/skunkworks/issues/185">Gitcoin</a>, and is a counterpart to the <a href="https://qf.gitcoin.co/">Quadratic Funding Calculator</a>.

## Architecture

This application is built atop

1. Front-end: [NextJS](https://nextjs.org/) (React)
2. Back-end: [NodeJS](https://nodejs.org/en/) + [Express](https://expressjs.com/) serverless functions deployed on [Vercel](https://vercel.com/)
3. Database: [PostgreSQL](https://www.postgresql.org/) + the [Prisma](https://www.prisma.io/) DB toolkit

At a fundamental level, the way in which voting links are generated and sessions are handled is kept simple:

1. An `events` table keeps track of open voting events. Each event has a `secret_key (uuid)` to manage the event.
2. A `voters` table keeps track of all voters and their preferences. Each voter has a `id (uuid)` that together with the `event_uuid (uuid)` represents their unique voting URL.

Important files:

1. [prisma/schema.sql](https://github.com/Anish-Agnihotri/quadratic-voting/blob/master/prisma/schema.sql) contains the SQL schema for the application.
2. [pages/api/events/details.js](https://github.com/Anish-Agnihotri/quadratic-voting/blob/master/pages/api/events/details.js) contains the QV calculation logic.

## Run locally / redeploy

1. Setup your PostgreSQL database

```
# Import schema
pg:psql -f prisma/schema.sql
```

2. Setup environment variables. Copy [prisma/.env.sample](https://github.com/Anish-Agnihotri/quadratic-voting/blob/master/prisma/.env.sample) to `prisma/.env` and replace `DATABASE_URL` with your PostgreSQL DB url.

3. Run application

```
# Install dependencies
yarn

# Run application
yarn dev
```

## Future development

This project is **actively maintained**.

There are currently plans to update this calculator based on community feedback. A few demanded items include better mechanisms of Sybil resistance (social OAuth logins), easy one-click self-deploys, and markdown support across voteable option fields.

A sprint is planned within the next few weeks to address these pieces of feedback. I [encourage creating new issues](https://github.com/Anish-Agnihotri/Gitcoin-Exemplars/issues/new) to provide feedback, and I will try my best to incorporate it in the next sprint.

## License

[GNU Affero General Public License v3.0](https://github.com/Anish-Agnihotri/quadratic-voting/blob/master/LICENSE)
