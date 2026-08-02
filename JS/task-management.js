// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);
const subjectsList = currentUser.subjects;
const tasksList = currentUser.tasks;
const currentDate = new Date();

// Elements Retrieve
const tasksContainer = document.getElementById("tasks-container");
const addTaskButton = document.getElementById("add-task");
const taskModal = document.getElementById("modal");
const taskModalOverlay = document.getElementById("modal-overlay");
const closeModalButton = document.getElementById("cancel-btn");
const saveNewTaskButton = document.getElementById("save-btn");
const taskNameInput = document.getElementById("task-name");
const subjectSelector = document.getElementById("subject-selector");
const deadlineDateSelector = document.getElementById("deadline-date");
const deadlineTimeSelector = document.getElementById("deadline-time");
const prioritySelector = document.getElementById("priority-selector");

// JS-HTML Render
let subjectOptions;
if (subjectsList.length !== 0) {
  subjectOptions = `
  <option value="" disabled selected>
    Select a subject
  </option>
  `;
  subjectsList.forEach((element) => {
    subjectOptions += `<option value="${element.id}">${element.name}</option>`;
  });
} else {
  subjectOptions = `
  <option value="" disabled selected>
    No subjects yet. Please create a subject first.
  </option>
  `;
}
subjectSelector.innerHTML = subjectOptions;

function renderTasks() {
  if (tasksList.length != 0) {
    tasksContainer.innerHTML = `
    <div class="tasks-category" id="high-priority">HighPriority</div>
    <div class="tasks-category" id="medium-priority">MediumPriority</div>
    <div class="tasks-category" id="low-priority">LowPriority</div>
    `;
  } else {
    tasksContainer.innerHTML = `
    <p class="no-task-notification">
    You are all done! There are no tasks left right now.
    Take a rest or click "Edit Task" to create a new one!
    </p>
    `;
  }
}

// Functions and Events
addTaskButton.addEventListener("click", () => {
  taskModalOverlay.classList.remove("hidden");
});
closeModalButton.addEventListener("click", () => {
  taskModalOverlay.classList.add("hidden");
});
saveNewTaskButton.addEventListener("click", () => {
  const task = taskNameInput.value;
  const subjectId = subjectSelector.value;
  const deadlineDate = deadlineDateSelector.value;
  const deadlineTime = deadlineTimeSelector.value;
  const priority = prioritySelector.value;

  if (task.trim() === "") {
    alert("Please enter task's name!");
    return;
  } else if (subjectId === "") {
    alert("Please select task's subject!");
    return;
  } else if (deadlineDate === "") {
    alert("Please select task's deadline date!");
    return;
  } else if (deadlineTime === "") {
    alert("Please select task's deadline time!");
    return;
  } else if (priority === "") {
    alert("Please select task's priority!");
  } else {
    let taskId;
    if (tasksList.length === 0) {
      taskId = 1;
    } else {
      taskId = Number(tasksList[tasksList.length - 1].taskId + 1);
    }
    const newTask = {
      taskId: taskId,
      task: task,
      subjectId: subjectId,
      deadlineDate: deadlineDate,
      deadlineTime: deadlineTime,
      priority: priority,
    };
    tasksList.push(newTask);
    alert("Task created!");
    localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
  }
});
