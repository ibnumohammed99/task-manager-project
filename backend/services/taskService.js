const tasks = require("../data/taskData");

const getAllTasks = () => {
  return tasks;
};

const getTaskById = (id) => {
  return tasks.find((task) => task.id === Number(id));
};

const createTask = (data) => {
  const { title, completed = false, priority } = data;

  // Validate title
  if (!title || title.trim() === "") {
    throw new Error("Title is required");
  }

  // Validate priority
  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(priority)) {
    throw new Error("Priority must be low, medium, or high");
  }

  // Validate completed
  if (typeof completed !== "boolean") {
    throw new Error("Completed must be a boolean");
  }

  // Generate a new ID
  const newId =
    tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

  // Create the new task
  const newTask = {
    id: newId,
    title: title.trim(),
    completed,
    priority,
    createdAt: new Date().toISOString(),
  };

  // Add the task to our data
  tasks.push(newTask);

  // Return the new task
  return newTask;
};
const updateTask = (id, data) => {
  const task = tasks.find((task) => task.id === Number(id));
  if (!task) {
    return undefined;
  }

  if (data.title !== undefined) {
    if (!data.title || data.title.trim() === "") {
      throw new Error("Title is required");
    }

    task.title = data.title.trim();
  }
  if (data.completed !== undefined) {
    if (typeof data.completed !== "boolean") {
      throw new Error("Completed must be a boolean");
    }
    task.completed = data.completed;
  }
  if (data.priority !== undefined) {
    const validPriorities = ["low", "medium", "high"];
    if (!validPriorities.includes(data.priority)) {
      throw new Error("Priority must be low, medium, or high");
    }
    task.priority = data.priority;
  }
  return task;
};
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
};
