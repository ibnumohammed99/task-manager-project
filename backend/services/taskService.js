const tasks = require("../data/taskData");

const getAllTasks = () => {
  return tasks;
};

const getTaskById = (id) => {
  return tasks.find((task) => task.id === Number(id));
};

module.exports = {
  getAllTasks,
  getTaskById,
};
