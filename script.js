
console.log("JavaScript is working!");

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskButton");
const taskList = document.getElementById("tasklist");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter((task) =>
            task &&
            (typeof task.id === "number" || typeof task.id === "string") &&
            typeof task.text === "string"
        );
    }
} catch (error) {
    console.warn("Could not load saved tasks.", error);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";

    tasks.forEach((task) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        span.className = task.completed
            ? "task-text completed"
            : "task-text";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", () => {
            const updatedTask = prompt("Edit your task:", task.text);

            if (updatedTask !== null && updatedTask.trim() !== "") {
                task.text = updatedTask.trim();
                saveTasks();
                displayTasks();
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            displayTasks();
        });

        li.append(checkbox, span, editBtn, deleteBtn);
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();
