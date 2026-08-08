const database = JSON.parse(localStorage.getItem("studyPlannerDatabase")) || {
  users: [],
};
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);

if (!currentUser) {
  window.location.replace("authentication-login.html");
  throw new Error("A signed-in user is required to manage tasks.");
}

const subjectsList = currentUser.subjects || [];
const tasksList = currentUser.tasks || [];

const tasksContainer = document.getElementById("tasks-container");
const addTaskButton = document.getElementById("add-task");
const taskModalOverlay = document.getElementById("modal-overlay");
const closeModalButton = document.getElementById("cancel-btn");
const deleteTaskButton = document.getElementById("del-btn");
const saveNewTaskButton = document.getElementById("save-btn");
const taskNameInput = document.getElementById("task-name");
const subjectSelector = document.getElementById("subject-selector");
const deadlineDateSelector = document.getElementById("deadline-date");
const deadlineTimeSelector = document.getElementById("deadline-time");
const prioritySelector = document.getElementById("priority-selector");

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(rawDate) {
  return new Date(`${rawDate}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderSubjectOptions() {
  if (subjectsList.length === 0) {
    subjectSelector.innerHTML = `
      <option value="" disabled selected>No subjects yet. Create a subject first.</option>
    `;
    return;
  }

  subjectSelector.innerHTML = `
    <option value="" disabled selected>Select a subject</option>
    ${subjectsList
      .map(
        (subject) =>
          `<option value="${subject.id}">${escapeHTML(subject.name)}</option>`
      )
      .join("")}
  `;
}

function createTaskCard(task) {
  const taskName = escapeHTML(task.task);
  return `
    <article class="task-card priority-${escapeHTML(task.priority)}" data-task="${taskName}">
      <div class="task-info">
        <h3 class="task-title">${taskName}</h3>
        <p class="task-deadline">Deadline: ${formatDate(task.deadlineDate)}, ${escapeHTML(
          task.deadlineTime
        )}</p>
      </div>
      <input type="checkbox" class="complete-task-checkbox" aria-label="Mark ${taskName} as complete" />
    </article>
  `;
}

function attachTaskCompletion() {
  document.querySelectorAll(".complete-task-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      if (!event.target.checked) return;

      const taskCard = event.target.closest(".task-card");
      const taskName = taskCard.dataset.task;
      taskCard.classList.add("completed");

      setTimeout(() => {
        const index = tasksList.findIndex((task) => task.task === taskName);
        if (index !== -1) tasksList.splice(index, 1);
        localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
        renderTasks();
      }, 240);
    });
  });
}

function renderTasks() {
  if (tasksList.length === 0) {
    tasksContainer.innerHTML = `
      <p class="no-task-notification">
        No tasks yet. Add one to turn your next study goal into a clear step.
      </p>
    `;
    return;
  }

  const groups = [
    { key: "high", label: "High priority" },
    { key: "medium", label: "Medium priority" },
    { key: "low", label: "Low priority" },
  ];

  tasksContainer.innerHTML = groups
    .map((group) => {
      const groupTasks = tasksList
        .filter((task) => task.priority === group.key)
        .sort(
          (a, b) =>
            new Date(`${a.deadlineDate}T${a.deadlineTime}`) -
            new Date(`${b.deadlineDate}T${b.deadlineTime}`)
        );

      return `
        <section class="tasks-group" id="${group.key}-priority">
          <div class="task-group-heading">
            <span>${group.label}</span>
            <span class="task-count">${groupTasks.length || "None"}</span>
          </div>
          ${groupTasks.map(createTaskCard).join("")}
        </section>
      `;
    })
    .join("");

  attachTaskCompletion();
}

function closeModal() {
  taskModalOverlay.classList.add("hidden");
}

function resetForm() {
  taskNameInput.value = "";
  subjectSelector.value = "";
  deadlineDateSelector.value = "";
  deadlineTimeSelector.value = "";
  prioritySelector.value = "";
}

renderSubjectOptions();
renderTasks();

addTaskButton.addEventListener("click", () => {
  taskModalOverlay.classList.remove("hidden");
  taskNameInput.focus();
});

closeModalButton.addEventListener("click", closeModal);

taskModalOverlay.addEventListener("click", (event) => {
  if (event.target === taskModalOverlay) closeModal();
});

deleteTaskButton.addEventListener("click", () => {
  const taskName = taskNameInput.value.trim();

  if (taskName === "") {
    alert("Please enter the task name.");
    return;
  }

  const index = tasksList.findIndex(
    (task) => task.task.toLowerCase() === taskName.toLowerCase()
  );

  if (index === -1) {
    alert("No task found. Please check the task name again.");
    return;
  }

  tasksList.splice(index, 1);
  localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
  renderTasks();
  resetForm();
  closeModal();
  alert("Task deleted.");
});

saveNewTaskButton.addEventListener("click", () => {
  const taskName = taskNameInput.value.trim();
  const subjectId = Number(subjectSelector.value);
  const deadlineDate = deadlineDateSelector.value;
  const deadlineTime = deadlineTimeSelector.value;
  const priority = prioritySelector.value;

  if (taskName === "") {
    alert("Please enter the task name.");
    return;
  }
  if (!subjectSelector.value) {
    alert("Please select the task subject.");
    return;
  }
  if (!deadlineDate) {
    alert("Please select the task deadline date.");
    return;
  }
  if (!deadlineTime) {
    alert("Please select the task deadline time.");
    return;
  }
  if (!priority) {
    alert("Please select the task priority.");
    return;
  }
  if (
    tasksList.some(
      (task) => task.task.toLowerCase().trim() === taskName.toLowerCase()
    )
  ) {
    alert("That task already exists.");
    return;
  }

  tasksList.push({
    task: taskName,
    subjectId,
    deadlineDate,
    deadlineTime,
    priority,
  });
  localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
  renderTasks();
  resetForm();
  closeModal();
  alert("Task created.");
});
