# ChartBrew Docs

## Tech stack

**Backend**

* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](https://expressjs.com/)
* [Sequelize ORM](https://sequelize.org/)
* [Nodemailer](https://nodemailer.com/about/)
* [Mongoose](https://mongoosejs.com/) for mongoDB data sources

**Frontend**

* [ReactJS](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Semantic UI](https://fomantic-ui.com/) (Fomantic UI at the moment)
* [ChartJs](https://www.chartjs.org/)

## Prerequisites

**NodeJS** v10.16.0+

**NPM**

**MySQL** v5+ Server running

## Getting Started

### Installation & Setup

```sh
git clone https://github.com/razvanilin/chartbrew.git
cd chartbrew
npm run setup
```

### Set up environmental variables

`touch server/.env`

Inspect `server/settings-dev.js` and `server/settings.js` to see what variables need to be set. You can place all these in the `.env` file or somewhere else to your liking.

Example of `settings-dev.js`:

```javascript
module.exports = {
  port: 3210,
  secret: process.env.CB_SECRET_DEV,
  client: "http://localhost:3000",
  api: "http://localhost:3210",
  adminMail: process.env.CB_ADMIN_MAIL,
  db: {
    dbName: process.env.CB_DB_NAME_DEV,
    dbUsername: process.env.CB_DB_USERNAME_DEV,
    dbPassword: process.env.CB_DB_PASSWORD_DEV,
    dbHost: process.env.CB_DB_HOST_DEV,
  },
  mailSettings: {
    host: process.env.CB_MAIL_HOST_DEV,
    port: 465,
    secure: true,
    auth: {
      user: process.env.CB_MAIL_USER_DEV,
      pass: process.env.CB_MAIL_PASS_DEV,
    },
  },
};
```

### Run the project in Development

Open two terminals, one for front-end and the other for back-end.

```sh
# frontend
cd client/
npm run start

# backend
cd server/
npm run start-dev
```

### Changing the docs

ChartBrew uses [Vuepress](https://vuepress.vuejs.org/) and you can check their documentation to see how it works. You can start the documentation development using the command below:

```sh
cd chartbrew
npm run docs:dev
```