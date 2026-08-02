const API_URL = "http://localhost:3000/api/tasks";

const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");

const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");
const taskCount = document.getElementById("task-count");

// Store tasks in memory
let tasks = [];

// ========================================
// GET TASKS
// ========================================

async function getTasks() {
  try {
    showLoading();

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    tasks = await response.json();

    renderTasks(tasks);
    updateStats(tasks);
  } catch (error) {
    showError(error.message);
    console.error("Error:", error);
  } finally {
    hideLoading();
  }
}

// ========================================
// RENDER TASKS
// ========================================

function renderTasks(tasksToRender) {
  taskList.innerHTML = "";

  taskCount.textContent = `(${tasksToRender.length})`;

  if (tasksToRender.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  tasksToRender.forEach((task) => {
    const taskElement = document.createElement("div");

    taskElement.className = `task-item ${task.completed ? "completed" : ""}`;

    taskElement.innerHTML = `
      <!-- Task title -->
      <div class="task-title">
        <h3 title="${escapeHTML(task.title)}">
          ${escapeHTML(task.title)}
        </h3>
      </div>

      <!-- Priority -->
      <div class="task-priority">
        <span class="priority priority-${task.priority}">
          ${task.priority}
        </span>
      </div>

      <!-- Status -->
      <div class="task-status">
        <span class="status-badge ${
          task.completed ? "status-completed" : "status-active"
        }">
          ${task.completed ? "Completed" : "Active"}
        </span>
      </div>

      <!-- Actions -->
      <div class="task-actions">

        <button
          class="task-action-btn complete-btn"
          data-id="${task.id}"
          title="${task.completed ? "Mark as active" : "Mark as completed"}"
        >
          ${task.completed ? "↩" : "✓"}
        </button>

        <button
          class="task-action-btn edit-btn"
          data-id="${task.id}"
          title="Edit task"
        >
          ✎
        </button>

        <button
          class="task-action-btn delete-btn"
          data-id="${task.id}"
          title="Delete task"
        >
          🗑
        </button>

      </div>
    `;

    taskList.appendChild(taskElement);
  });
}

// ========================================
// CREATE TASK
// ========================================

async function createTask(taskData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    await getTasks();
  } catch (error) {
    showError(error.message);
    console.error("Create task error:", error);
  }
}

// ========================================
// EDIT TASK
// ========================================

async function editTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  const newTitle = prompt("Edit task title:", task.title);

  if (newTitle === null) {
    return;
  }

  const trimmedTitle = newTitle.trim();

  if (!trimmedTitle) {
    alert("Task title cannot be empty.");
    return;
  }

  const newPriority = prompt(
    "Enter priority: low, medium, or high",
    task.priority,
  );

  if (newPriority === null) {
    return;
  }

  const priority = newPriority.trim().toLowerCase();

  if (!["low", "medium", "high"].includes(priority)) {
    alert("Priority must be low, medium, or high.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: trimmedTitle,
        priority: priority,
        completed: task.completed,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    await getTasks();
  } catch (error) {
    showError(error.message);
    console.error("Edit task error:", error);
  }
}

// ========================================
// DELETE TASK
// ========================================

async function deleteTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  const confirmed = confirm(`Are you sure you want to delete "${task.title}"?`);

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    await getTasks();
  } catch (error) {
    showError(error.message);
    console.error("Delete task error:", error);
  }
}

// ========================================
// TOGGLE TASK STATUS
// ========================================

async function toggleTask(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: task.title,
        priority: task.priority,
        completed: !task.completed,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task status");
    }

    await getTasks();
  } catch (error) {
    showError(error.message);
    console.error("Toggle task error:", error);
  }
}

// ========================================
// TASK ACTION EVENTS
// ========================================

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const taskId = Number(button.dataset.id);

  if (button.classList.contains("edit-btn")) {
    editTask(taskId);
  }

  if (button.classList.contains("delete-btn")) {
    deleteTask(taskId);
  }

  if (button.classList.contains("complete-btn")) {
    toggleTask(taskId);
  }
});

// ========================================
// UPDATE STATISTICS
// ========================================

function updateStats(tasks) {
  const total = tasks.length;

  const completed = tasks.filter((task) => task.completed === true).length;

  const pending = total - completed;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
}

// ========================================
// LOADING STATE
// ========================================

function showLoading() {
  loadingState.classList.remove("hidden");
}

function hideLoading() {
  loadingState.classList.add("hidden");
}

// ========================================
// ERROR STATE
// ========================================

function showError(message) {
  errorMessage.textContent = message;
  errorState.classList.remove("hidden");
}

// ========================================
// ESCAPE HTML
// Prevent HTML injection in task titles
// ========================================

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}

// ========================================
// START APPLICATION
// ========================================

getTasks();
