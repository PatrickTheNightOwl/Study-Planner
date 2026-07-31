// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);
const tasksList = currentUser.tasks;
const currentDate = new Date();

// Elements Retrieve
const mainContainer = document.getElementById("main-content");
const addTaskButton = document.getElementById("add-task");
const taskModal = document.getElementById("modal");
const taskModalOverlay = document.getElementById("modal-overlay");

// JS-HTML
if (tasksList.length !== 0) {
  mainContainer.innerHTML += `
    <div class="priority-container" id="high-priority"></div>
    <div class="priority-container" id="medium-priority"></div>
    <div class="priority-container" id="low-priority"></div>
  `;
}

//Add event listener
addTaskButton.addEventListener("click", () => {});
