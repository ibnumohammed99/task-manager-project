const API_URL = "https://task-manager-project-4440.onrender.com/api/tasks";

// ========================================
// DOM ELEMENTS
// ========================================

const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");

const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");
const taskCount = document.getElementById("task-count");

const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskPriorityInput = document.getElementById("task-priority");

const refreshButton = document.getElementById("refresh-btn");

const searchInput = document.getElementById("search-input");
const priorityFilter = document.getElementById("priority-filter");
const statusFilter = document.getElementById("status-filter");
const clearFiltersButton = document.getElementById("clear-filters-btn");

const sortSelect = document.getElementById("sort-select");

const navItems = document.querySelectorAll(".nav-item");

// ========================================
// APPLICATION STATE
// ========================================

let tasks = [];

// Current sidebar filter
let currentView = "all";

// ========================================
// GET TASKS
// ========================================

async function getTasks() {
  try {
    hideError();
    showLoading();

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    tasks = await response.json();

    updateStats(tasks);
    applyFiltersAndRender();
  } catch (error) {
    console.error("Get tasks error:", error);

    showError(error.message || "Failed to load tasks.");
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
          ${escapeHTML(task.priority)}
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
          type="button"
          class="task-action-btn complete-btn"
          data-id="${task.id}"
          title="${task.completed ? "Mark as active" : "Mark as completed"}"
        >
          ${task.completed ? "↩" : "✓"}
        </button>

        <button
          type="button"
          class="task-action-btn edit-btn"
          data-id="${task.id}"
          title="Edit task"
        >
          ✎
        </button>

        <button
          type="button"
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
    hideError();

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create task");
    }

    // Reset form
    taskForm.reset();

    // Restore default priority
    taskPriorityInput.value = "medium";

    // Reload tasks
    await getTasks();
  } catch (error) {
    console.error("Create task error:", error);

    showError(error.message || "Failed to create task.");
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

  // Edit title
  const newTitle = prompt("Edit task title:", task.title);

  if (newTitle === null) {
    return;
  }

  const trimmedTitle = newTitle.trim();

  if (!trimmedTitle) {
    alert("Task title cannot be empty.");
    return;
  }

  // Edit priority
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
    hideError();

    const response = await fetch(`${API_URL}/${taskId}`, {
      // IMPORTANT:
      // Backend uses PATCH, not PUT.
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: trimmedTitle,
        priority: priority,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task");
    }

    await getTasks();
  } catch (error) {
    console.error("Edit task error:", error);

    showError(error.message || "Failed to update task.");
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
    hideError();

    const response = await fetch(`${API_URL}/${taskId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete task");
    }

    await getTasks();
  } catch (error) {
    console.error("Delete task error:", error);

    showError(error.message || "Failed to delete task.");
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
    hideError();

    const response = await fetch(`${API_URL}/${taskId}`, {
      // IMPORTANT:
      // Backend uses PATCH.
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        completed: !task.completed,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task status");
    }

    await getTasks();
  } catch (error) {
    console.error("Toggle task error:", error);

    showError(error.message || "Failed to update task status.");
  }
}

// ========================================
// ADD TASK FORM
// ========================================

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const priority = taskPriorityInput.value;

  if (!title) {
    alert("Please enter a task title.");
    taskTitleInput.focus();
    return;
  }

  await createTask({
    title,
    priority,
    completed: false,
  });
});

// ========================================
// TASK ACTION EVENTS
// ========================================

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const taskId = Number(button.dataset.id);

  if (!taskId) {
    return;
  }

  if (button.classList.contains("edit-btn")) {
    editTask(taskId);
    return;
  }

  if (button.classList.contains("delete-btn")) {
    deleteTask(taskId);
    return;
  }

  if (button.classList.contains("complete-btn")) {
    toggleTask(taskId);
  }
});

// ========================================
// SEARCH
// ========================================

searchInput.addEventListener("input", () => {
  applyFiltersAndRender();
});

// ========================================
// PRIORITY FILTER
// ========================================

priorityFilter.addEventListener("change", () => {
  applyFiltersAndRender();
});

// ========================================
// STATUS FILTER
// ========================================

statusFilter.addEventListener("change", () => {
  applyFiltersAndRender();
});

// ========================================
// SORT
// ========================================

sortSelect.addEventListener("change", () => {
  applyFiltersAndRender();
});

// ========================================
// CLEAR FILTERS
// ========================================

clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  priorityFilter.value = "all";
  statusFilter.value = "all";

  currentView = "all";

  setActiveNavItem(0);

  applyFiltersAndRender();
});

// ========================================
// REFRESH
// ========================================

refreshButton.addEventListener("click", () => {
  getTasks();
});

// ========================================
// SIDEBAR NAVIGATION
// ========================================

navItems.forEach((navItem, index) => {
  navItem.addEventListener("click", (event) => {
    event.preventDefault();

    setActiveNavItem(index);

    switch (index) {
      case 0:
        currentView = "all";
        break;

      case 1:
        currentView = "active";
        break;

      case 2:
        currentView = "completed";
        break;

      case 3:
        currentView = "high";
        break;

      case 4:
        currentView = "medium";
        break;

      case 5:
        currentView = "low";
        break;

      default:
        currentView = "all";
    }

    applyFiltersAndRender();
  });
});

// ========================================
// SET ACTIVE NAV ITEM
// ========================================

function setActiveNavItem(activeIndex) {
  navItems.forEach((item, index) => {
    item.classList.toggle("active", index === activeIndex);
  });
}

// ========================================
// FILTER + SEARCH + SORT
// ========================================

function applyFiltersAndRender() {
  let filteredTasks = [...tasks];

  // ----------------------------------------
  // Sidebar view
  // ----------------------------------------

  if (currentView === "active") {
    filteredTasks = filteredTasks.filter((task) => task.completed === false);
  }

  if (currentView === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed === true);
  }

  if (
    currentView === "high" ||
    currentView === "medium" ||
    currentView === "low"
  ) {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === currentView,
    );
  }

  // ----------------------------------------
  // Search
  // ----------------------------------------

  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm),
    );
  }

  // ----------------------------------------
  // Priority filter
  // ----------------------------------------

  const selectedPriority = priorityFilter.value;

  if (selectedPriority !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.priority === selectedPriority,
    );
  }

  // ----------------------------------------
  // Status filter
  // ----------------------------------------

  const selectedStatus = statusFilter.value;

  if (selectedStatus === "active") {
    filteredTasks = filteredTasks.filter((task) => task.completed === false);
  }

  if (selectedStatus === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed === true);
  }

  // ----------------------------------------
  // Sorting
  // ----------------------------------------

  sortTasks(filteredTasks);

  // ----------------------------------------
  // Render
  // ----------------------------------------

  renderTasks(filteredTasks);
}

// ========================================
// SORT TASKS
// ========================================

function sortTasks(tasksToSort) {
  const sortValue = sortSelect.value;

  if (sortValue === "created-desc") {
    tasksToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (sortValue === "created-asc") {
    tasksToSort.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (sortValue === "title") {
    tasksToSort.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortValue === "priority") {
    const priorityOrder = {
      high: 1,
      medium: 2,
      low: 3,
    };

    tasksToSort.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );
  }
}

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

function hideError() {
  errorState.classList.add("hidden");
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
