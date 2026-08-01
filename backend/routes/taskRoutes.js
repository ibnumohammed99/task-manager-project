const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);

module.exports = router;
