// Data Retrieve
const database = JSON.parse(localStorage.getItem("studyPlannerDatabase"));
const currentUserId = Number(localStorage.getItem("currentUserId"));
const currentUser = database.users.find((user) => user.id === currentUserId);
const subjectsList = currentUser.subjects;

// Elements Retrieve
const mainContainer = document.getElementById("main-content");
const addTaskButton = document.getElementById("add-task");
const taskModal = document.getElementById("modal");
const taskModalOverlay = document.getElementById("modal-overlay");
const closeModalButton = document.getElementById("cancel-btn");
const saveNewTaskButton = document.getElementById("save-btn");
