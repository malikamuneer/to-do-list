// Get DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const darkToggle = document.getElementById("darkToggle");
const filterChips = document.querySelectorAll(".chip");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filtered = tasks.filter((t) =>
    filter === "active" ? !t.done : filter === "completed" ? t.done : true
  );

  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="empty">No tasks ${filter} ✨</li>`;
  } else {
    filtered.forEach((task, i) => {
      const li = document.createElement("li");
      li.className = `item ${task.done ? "done" : ""}`;
      li.innerHTML = `
        <div class="task">
          <input type="checkbox" ${
            task.done ? "checked" : ""
          } data-index="${i}">
          <span class="text">${task.text}</span>
        </div>
        <div class="actions">
          <button class="icon-btn edit" data-index="${i}">✏️</button>
          <button class="icon-btn delete" data-index="${i}">🗑️</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  taskCount.textContent = `${tasks.length} tasks`;
  saveTasks();
}

// Add task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  taskInput.value = "";
  renderTasks();
});

// Toggle complete
taskList.addEventListener("change", (e) => {
  if (e.target.type === "checkbox") {
    tasks[e.target.dataset.index].done = e.target.checked;
    renderTasks();
  }
});

// Edit task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    let idx = e.target.dataset.index;
    let newText = prompt("Edit task:", tasks[idx].text);
    if (newText !== null && newText.trim() !== "") {
      tasks[idx].text = newText.trim();
      renderTasks();
    }
  }
});

// Delete task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    tasks.splice(e.target.dataset.index, 1);
    renderTasks();
  }
});

// Filters
filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    filter = chip.dataset.filter;
    renderTasks();
  });
});

// Dark mode toggle
darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("darkMode", darkToggle.checked);
});

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}

// Initial render
renderTasks();
