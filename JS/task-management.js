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
const deleteTaskButton = document.getElementById("del-btn");
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
    const highPriority = document.getElementById("high-priority");
    const mediumPriority = document.getElementById("medium-priority");
    const lowPriority = document.getElementById("low-priority");
    let highHTML = "";
    let mediumHTML = "";
    let lowHTML = "";
    tasksList.forEach((element) => {
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
        <div class="task-card" data-task="${element.task}">
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
        <div class="task-card" data-task="${element.task}">
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
        <div class="task-card" data-task="${element.task}">
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
      highPriority.innerHTML = highHTML;
      mediumPriority.innerHTML = mediumHTML;
      lowPriority.innerHTML = lowHTML;
    });
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
  } else {
    tasksContainer.innerHTML = `
    <p class="no-task-notification">
    There are no tasks left right now.
    Click "Edit Task" to create a new one!
    </p>
    `;
  }
}
renderTasks();
// Functions and Events
addTaskButton.addEventListener("click", () => {
  taskModalOverlay.classList.remove("hidden");
});
closeModalButton.addEventListener("click", () => {
  taskModalOverlay.classList.add("hidden");
});
deleteTaskButton.addEventListener("click", () => {
  const taskName = taskNameInput.value;
  const subjectId = subjectSelector.value;
  if (taskName.trim() === "") {
    alert("Please enter task's name!");
    return;
  } else if (subjectId === "") {
    alert("Please select task's subject!");
    return;
  } else {
    const index = tasksList.findIndex(
      (task) => task.task.toLowerCase() === taskName.toLowerCase()
    );
    if (index !== -1) {
      tasksList.splice(index, 1);
      localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
      renderTasks();
      alert("Task deleted!");
    } else {
      alert("No task found! Please check the subject name again.");
    }
  }
});
saveNewTaskButton.addEventListener("click", () => {
  const taskName = taskNameInput.value;
  const subjectId = Number(subjectSelector.value);
  const deadlineDate = deadlineDateSelector.value;
  const deadlineTime = deadlineTimeSelector.value;
  const priority = prioritySelector.value;

  if (taskName.trim() === "") {
    alert("Please enter task's name!");
    return;
  } else if (!subjectSelector.value) {
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
    return;
  } else {
    if (
      tasksList.find(
        (task) =>
          task.task.toLowerCase().trim() === taskName.toLowerCase().trim()
      )
    ) {
      alert("Task is already existed!");
      return;
    } else {
      const newTask = {
        task: taskName,
        subjectId: subjectId,
        deadlineDate: deadlineDate,
        deadlineTime: deadlineTime,
        priority: priority,
      };
      tasksList.push(newTask);
      localStorage.setItem("studyPlannerDatabase", JSON.stringify(database));
      renderTasks();
      alert("Task created!");
    }
  }
});
