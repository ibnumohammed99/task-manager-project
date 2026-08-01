const taskService = require("../services/taskService");

const getAllTasks = (req, res) => {
  const tasks = taskService.getAllTasks();

  res.json(tasks);
};

module.exports = {
  getAllTasks,
};
