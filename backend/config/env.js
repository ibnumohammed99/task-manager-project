const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME;

module.exports = {
  PORT,
  APP_NAME,
};
