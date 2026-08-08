# Study Planner

A simple and organized web application designed to help students manage their subjects, tasks, deadlines, and study workload in one place.

## Overview

Study Planner was built as a final web development project with a focus on **simplicity, organization, and productivity**.

The application allows users to create an account, manage their subjects and tasks, set deadlines and priorities, and view their study workload through a centralized dashboard.

## Core Features

### Authentication

* User registration and login
* Account switching
* Local user data persistence

### Subject Management

* Create and delete subjects
* Assign custom colors to subjects
* Prevent duplicate subject names
* Display the number of remaining tasks for each subject

### Task Management

* Create and delete tasks
* Assign tasks to subjects
* Set deadlines and specific times
* Set task priorities
* Mark tasks as completed
* Prevent duplicate task names
* Organize tasks by priority

### Dashboard

* Overview of subjects and remaining tasks
* Display upcoming workload
* Holiday information through an external API

### Holiday API Integration

* Fetch holiday data from an external API
* Store API results locally
* Automatically refresh cached data after 24 hours
* Continue displaying cached data when the user is offline

### Settings

* Manage application settings
* Persist user-specific data

## Tech Stack

* **HTML5** — Structure and semantic content
* **CSS3** — Layout, styling, and responsive interface design
* **JavaScript** — Application logic, DOM manipulation, data management, and API integration
* **LocalStorage** — Client-side data persistence
* **Holiday API** — Holiday data integration

## Data Structure

User data is stored locally using `localStorage`.

A simplified database structure looks like:

```text
studyPlannerDatabase
│
└── users
    ├── id
    ├── email
    ├── password
    ├── subjects
    │   ├── id
    │   ├── name
    │   └── color
    │
    └── tasks
        ├── task
        ├── subjectId
        ├── deadlineDate
        ├── deadlineTime
        └── priority
```

Tasks reference subjects through `subjectId`, allowing subject information to remain independent from individual tasks.

## Project Structure

```text
Study-Planner/
│
├── ASSETS/
│
├── CSS/
│
├── DATA/
│
├── HTML/
│
├── JS/
│
└── README.md
```

## API Caching

The application uses local caching to reduce unnecessary API requests.

```text
Request holiday data
        ↓
Is cached data available?
        ↓
   ┌────┴────┐
  No        Yes
   ↓          ↓
 Fetch     Check age
              ↓
        ┌─────┴─────┐
      < 24h        > 24h
        ↓             ↓
   Use cache       Re-fetch
```

When the user is offline and valid cached data exists, the application can continue displaying the previously stored holiday information.

## What I Learned

This project helped me develop practical experience in:

* DOM manipulation and dynamic UI rendering
* Client-side data management
* LocalStorage and data persistence
* API integration and asynchronous JavaScript
* API caching and expiration logic
* Error handling and edge-case testing
* UI/UX design with CSS
* Structuring a complete web application
* Debugging and refactoring
* Using AI as a development partner rather than simply a code generator

## Project Purpose

This project was created as a final web development project and as an opportunity to apply programming skills to a real productivity-related problem.

The goal was not only to build a functional application, but also to understand the process of turning an idea into a complete product.

## Future Improvements

Possible future improvements include:

* Backend database
* Secure authentication
* Cloud synchronization
* More advanced task filtering and sorting
* Recurring tasks
* Notifications and reminders
* Mobile optimization
* Additional productivity features

## Author

**PatrickTheNightOwl**

Built with HTML, CSS, JavaScript, curiosity, and a lot of debugging.
