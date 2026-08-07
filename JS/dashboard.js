// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const holidays = JSON.parse(localStorage.getItem("studyPlannerHolidays"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);
const subjectsList = currentUser.subjects;
const tasksList = currentUser.tasks;

// Elemenet Retrieve
const holidaysContainer = document.getElementById("holiday");
const subjectsContainer = document.getElementById("subjects");
const tasksContainer = document.getElementById("tasks");

// Functions
function getFormattedDate(rawDate, year) {
  const month = String(rawDate.getMonth() + 1).padStart(2, "0");
  const day = String(rawDate.getDate()).padStart(2, "0");
  const formatted = `${year}-${month}-${day}`;
  return formatted;
}
function getUpcomingHolidayDataFromHolidays(rawData) {
  // Holiday API Free chỉ cung cấp dữ liệu của năm trước,
  // vì vậy dashboard sử dụng năm dữ liệu của API để tính toán ngày lễ tiếp theo.
  let currentDateObj = new Date();
  const year = "2025";
  const formatted = getFormattedDate(currentDateObj, year);
  currentDateObj = new Date(formatted);
  currentDateObj.setHours(0, 0, 0, 0);
  const holidays = rawData.holidays;
  let essentialData = {
    name: null,
    upcomingHoliday: null,
  };
  const upcomingHoliday = holidays.find((holiday) => {
    const holidayDateObj = new Date(`${holiday.date}T00:00:00`);
    return holidayDateObj >= currentDateObj;
  });
  essentialData.name = upcomingHoliday.name;
  const holidayDate = new Date(`${upcomingHoliday.date}T00:00:00`);
  essentialData.upcomingHoliday = getFormattedDate(holidayDate, 2026);

  return essentialData;
}
function sortTasksByDeadline() {
  const sortedTasks = [...tasksList];
  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
  };

  sortedTasks.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityDiff !== 0) return priorityDiff;

    const dateA = new Date(`${a.deadlineDate}T${a.deadlineTime}`);

    const dateB = new Date(`${b.deadlineDate}T${b.deadlineTime}`);

    return dateA - dateB;
  });
  return sortedTasks;
}

// Essential Data Initialize
const upcomingHolidayData = getUpcomingHolidayDataFromHolidays(holidays);

// Add informations to container
const dateObj = new Date(upcomingHolidayData.upcomingHoliday);
const formalOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};
const formalHolidayDate = dateObj.toLocaleDateString("en-US", formalOptions);
let holidaysHTML = `
    <h1>Upcoming Holiday<h1>
    <h2>${upcomingHolidayData.name}<h2>
    <h2>${formalHolidayDate}<h2>
`;
holidaysContainer.innerHTML = holidaysHTML;

let subjectsHTML = "";
subjectsList.forEach((subject) => {
  const remainingTasks = tasksList.filter(
    (task) => task.subjectId === subject.id
  ).length;
  subjectsHTML += `
            <div
                class="subject-card"
                style="background-color:${subject.color}">
                <h3>${subject.name}</h3>
                <p>${remainingTasks} task${
    remainingTasks !== 1 ? "s" : ""
  } remaining</p>
            </div>
        `;
});
// các element cần edit css vào dashboard.css : class subject-card, h3 và p của nó
if (subjectsHTML.length === 0) {
  document.getElementById("subjects-title").remove();
} else {
  subjectsContainer.innerHTML = subjectsHTML;
}
let highHTML = "";
let mediumHTML = "";
let lowHTML = "";
const sortedTasks = sortTasksByDeadline();
if (sortedTasks.length === 0) {
  tasksContainer.innerHTML = `
    <p class="no-task-notification">
    You are all done! There are no tasks left right now.
    Take a rest or click "Edit Task" to create a new one!
    </p>
    `;
} else {
  sortedTasks.forEach((element) => {
    // 1. Pass the string into a Date instance
    const dateObj = new Date(element.deadlineDate);

    // 2. Configure the exact layout specifications
    const formalOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    // 3. Convert to a formal English format
    const formalDate = dateObj.toLocaleDateString("en-US", formalOptions);
    if (element.priority === "high") {
      highHTML += `
        <div class="task-card" data-task="${element.task}" style="background-color:#ef4444;">
          <div class="task-info">
            <h3 class="task-title">${element.task}</h3>
              <p class="task-deadline">
                  Deadline: ${formalDate}, ${element.deadlineTime}
              </p>
          </div>
          <input type="checkbox" class="complete-task-checkbox">
        </div>
        `;
    } else if (element.priority === "medium") {
      mediumHTML += `
        <div class="task-card" data-task="${element.task}" style="background-color:#f59e0b;">
          <div class="task-info">
            <h3 class="task-title">${element.task}</h3>
            <p class="task-deadline">
                Deadline: ${formalDate}, ${element.deadlineTime}
            </p>
          </div>
          <input type="checkbox" class="complete-task-checkbox">
        </div>
        `;
    } else {
      lowHTML += `
        <div class="task-card" data-task="${element.task}" style="background-color:#10b981;">
          <div class="task-info">
            <h3 class="task-title">${element.task}</h3>
            <p class="task-deadline">
                Deadline: ${formalDate}, ${element.deadlineTime}
            </p>
          </div>
          <input type="checkbox" class="complete-task-checkbox">
        </div>
        
        `;
    }
    tasksContainer.innerHTML = `
    <div id="task-title">
      <h1>Task</h1>
      <h3>Tasks Remaining: ${sortedTasks.length}</h1>
    <div>
  `;
    tasksContainer.innerHTML += highHTML;
    tasksContainer.innerHTML += mediumHTML;
    tasksContainer.innerHTML += lowHTML;
    const tasksCheckboxes = document.querySelectorAll(
      ".complete-task-checkbox"
    );
    tasksCheckboxes.forEach((element) => {
      element.addEventListener("change", (event) => {
        if (event.target.checked) {
          const finishedTask = element.parentElement.dataset.task;
          const finishedTaskIndex = tasksList.indexOf(
            tasksList.find((taskElement) => taskElement.task === finishedTask)
          );

          setTimeout(() => {
            tasksList.splice(finishedTaskIndex, 1);
            localStorage.setItem(
              "studyPlannerDatabase",
              JSON.stringify(database)
            );
            renderTasks();
          }, 300);
        }
      });
    });
  });
}
