// ---- State ----
// Tasks live in an array and are saved to the browser's localStorage,
// so they survive a page refresh.
const STORAGE_KEY = "my-first-app-tasks";
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = "all";

// ---- Grab the elements we need from the page ----
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const clearDone = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("theme-toggle");

// ---- Helpers ----
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  const visible = tasks.filter((t) => {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  if (visible.length === 0) {
    list.innerHTML = '<li class="empty">Nothing here yet 🎉</li>';
  }

  visible.forEach((task) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.textContent = task.text; // textContent (not innerHTML) keeps user input safe

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      save();
      render();
    });

    li.append(checkbox, text, del);
    list.appendChild(li);
  });

  const left = tasks.filter((t) => !t.done).length;
  count.textContent = `${left} task${left === 1 ? "" : "s"} left`;
}

// ---- Event handlers ----
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the browser from reloading the page
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, done: false });
  input.value = "";
  save();
  render();
});

clearDone.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// ---- Dark mode (remembered too) ----
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeToggle.textContent = dark ? "☀️" : "🌙";
});

// ---- First draw ----
render();
