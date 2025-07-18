require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: '+09:00',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: '+09:00',
    logging: false
  }
}
