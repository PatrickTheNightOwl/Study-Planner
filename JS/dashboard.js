const database = JSON.parse(localStorage.getItem("studyPlannerDatabase")) || {
  users: [],
};

const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);

if (!currentUser) {
  window.location.replace("authentication-login.html");
  throw new Error("A signed-in user is required to view the dashboard.");
}

const subjectsList = currentUser.subjects || [];
const tasksList = currentUser.tasks || [];

const holidaysContainer = document.getElementById("holiday");
const subjectsTitle = document.getElementById("subjects-title");
const subjectsContainer = document.getElementById("subjects");
const tasksContainer = document.getElementById("tasks");

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(rawDate) {
  const date = new Date(`${rawDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getUpcomingHolidayData(rawData) {
  const holidayItems = Array.isArray(rawData?.holidays) ? rawData.holidays : [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = holidayItems
    .map((holiday) => {
      const sourceDate = new Date(`${holiday.date}T00:00:00`);
      if (Number.isNaN(sourceDate.getTime())) return null;

      const candidate = new Date(
        today.getFullYear(),
        sourceDate.getMonth(),
        sourceDate.getDate()
      );
      if (candidate < today) candidate.setFullYear(candidate.getFullYear() + 1);

      return { name: holiday.name, date: candidate };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date)[0];

  return upcoming || null;
}

function sortTasksByDeadline() {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...tasksList].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    return (
      new Date(`${a.deadlineDate}T${a.deadlineTime}`) -
      new Date(`${b.deadlineDate}T${b.deadlineTime}`)
    );
  });
}

function renderHoliday() {
  const holidays = JSON.parse(localStorage.getItem("studyPlannerHolidays")) || {
    holidays: [],
  };

  const upcoming = getUpcomingHolidayData(holidays);

  if (!upcoming) {
    holidaysContainer.innerHTML = `
      <h1>Upcoming holiday</h1>
      <h2>No holiday data yet</h2>
      <p>Your next holiday will appear here when data is available.</p>
    `;
    return;
  }

  holidaysContainer.innerHTML = `
    <h1>Upcoming holiday</h1>
    <h2>${escapeHTML(upcoming.name)}</h2>
    <p>
      ${upcoming.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  `;
}

function renderSubjects() {
  subjectsTitle.hidden = subjectsList.length === 0;

  if (subjectsList.length === 0) {
    subjectsContainer.innerHTML = `
      <p class="no-task-notification">
        No subjects yet. Open Subject Management to create your first one.
      </p>
    `;
    return;
  }

  subjectsContainer.innerHTML = subjectsList
    .map((subject) => {
      const remainingTasks = tasksList.filter(
        (task) => task.subjectId === subject.id
      ).length;

      return `
        <article class="subject-card" style="--subject-color:${escapeHTML(
          subject.color
        )}">
          <h3>${escapeHTML(subject.name)}</h3>
          <p>${remainingTasks} task${
        remainingTasks !== 1 ? "s" : ""
      } remaining</p>
        </article>
      `;
    })
    .join("");
}

function createTaskCard(task) {
  const taskName = escapeHTML(task.task);
  return `
    <article class="task-card priority-${escapeHTML(
      task.priority
    )}" data-task="${taskName}">
      <div class="task-info">
        <h3 class="task-title">${taskName}</h3>
        <p class="task-deadline">Deadline: ${formatDate(
          task.deadlineDate
        )}, ${escapeHTML(task.deadlineTime)}</p>
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
        const finishedTaskIndex = tasksList.findIndex(
          (task) => task.task === taskName
        );
        if (finishedTaskIndex !== -1) tasksList.splice(finishedTaskIndex, 1);
        localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
        renderSubjects();
        renderTasks();
      }, 240);
    });
  });
}

function renderTasks() {
  const sortedTasks = sortTasksByDeadline();

  if (sortedTasks.length === 0) {
    tasksContainer.innerHTML = `
      <div id="task-title">
        <h1>Tasks</h1>
        <h3>Nothing due right now</h3>
      </div>
      <p class="no-task-notification">
        You are all caught up. Open Task Management when you are ready to plan the next step.
      </p>
    `;
    return;
  }

  const groups = [
    { key: "high", label: "High priority" },
    { key: "medium", label: "Medium priority" },
    { key: "low", label: "Low priority" },
  ];

  tasksContainer.innerHTML = `
    <div id="task-title">
      <h1>Tasks</h1>
      <h3>${sortedTasks.length} task${
    sortedTasks.length !== 1 ? "s" : ""
  } remaining</h3>
    </div>
    ${groups
      .map((group) => {
        const groupTasks = sortedTasks.filter(
          (task) => task.priority === group.key
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
      .join("")}
  `;

  attachTaskCompletion();
}

async function startDashboard() {
  await holidayReady;

  renderHoliday();
  renderSubjects();
  renderTasks();
}

startDashboard();
