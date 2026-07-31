const express = require("express");
const cors = require("cors");

const { PORT, APP_NAME } = require("./config/env");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is working!",
  });
});

app.listen(PORT, () => {
  console.log(`${APP_NAME} is running on port ${PORT}`);
});
