# 🧩 TaskNest — Task Manager

> A full-stack task management application for creating, organizing, prioritizing, and tracking daily tasks.

---

## 📖 About The Project

TaskNest is a full-stack Task Manager application built with **Node.js and Express.js**.

The project demonstrates a RESTful API using **MVC architecture**, environment configuration, validation, error handling, and a responsive frontend connected to the backend.

### Architecture

```text
Frontend
   ↓
REST API
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Data
```

---

## 🚀 Features

- ➕ Create new tasks
- 🗂️ View and manage tasks
- 🔎 Search tasks by title
- 🎚️ Filter by priority and status
- ↕️ Sort tasks
- ✍️ Edit existing tasks
- 🗑️ Delete tasks
- 🔄 Toggle task completion
- 📈 View task statistics
- 🛡️ Input validation and error handling
- 📱 Responsive dashboard

---

## 🧰 Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

### Backend

- Node.js
- Express.js

### Tools & Middleware

- Git & GitHub
- dotenv
- CORS
- REST API testing tools

---

## 🗃️ Project Structure

```text
task-manager-api/
│
├── backend/
│   ├── index.js
│   ├── .env
│   ├── config/
│   │   └── env.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── services/
│   │   └── taskService.js
│   └── data/
│       └── taskData.js
│
└── frontend/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

---

## 🔗 API Endpoints

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/tasks`     | Get all tasks    |
| GET    | `/api/tasks/:id` | Get a task by ID |
| POST   | `/api/tasks`     | Create a task    |
| PATCH  | `/api/tasks/:id` | Update a task    |
| DELETE | `/api/tasks/:id` | Delete a task    |

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/ibnumohammed99/task-manager-project.git
```

Install dependencies:

```bash
cd task-manager-api
npm install
```

Create `backend/.env`:

```env
PORT=3000
APP_NAME=Task Manager API
```

Start the development server:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

### Frontend

Open a second terminal:

```bash
cd frontend
npx serve .
```

Then open the local frontend URL provided in the terminal.

---

## 🌐 Frontend

The frontend connects to the REST API and provides a dashboard for managing tasks, including searching, filtering, sorting, editing, completing, and deleting tasks.

---

## 🔮 Future Improvements

- Add database persistence
- Add user authentication
- Add task due dates and reminders
- Deploy the application online

---

## 👨‍💻 Author

**Miftahudin Mohammed**

Computer Science & Engineering Student

Adama Science and Technology University
