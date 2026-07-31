// database.js

const DATABASE_KEY = "studyPlannerDatabase";

function initializeDatabase() {
  const existingDatabase = localStorage.getItem(DATABASE_KEY);

  // Nếu chưa có database
  if (!existingDatabase) {
    const database = {
      users: [],
    };

    localStorage.setItem(DATABASE_KEY, JSON.stringify(database));

    console.log("Database initialized!");
  } else {
    console.log("Database already exists!");
  }
}

initializeDatabase();
