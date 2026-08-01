const taskService = require("../services/taskService");

const getAllTasks = (req, res) => {
  const tasks = taskService.getAllTasks();

  res.json(tasks);
};

const getTaskById = (req, res) => {
  const task = taskService.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
};

const createTask = (req, res) => {
  try {
    const newTask = taskService.createTask(req.body);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
const updateTask = (req, res) => {
  try {
    const updatedTask = taskService.updateTask(req.params.id, req.body);

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
};
