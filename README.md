# TaskNode - Node.js Developer Assignment

## Overview
This repository contains the implementation of a task management system with secure user authentication, task creation, updates, real-time notifications, and more. The system is designed using Node.js, Express, MongoDB, and Socket.io for real-time updates.

## Features

1. **User Registration**
   - Endpoint: `/api/auth/signup`
   - Accepts: `username`, `email`, and `password`
   - Validation: Ensures proper email formatting and strong password criteria using regex.

2. **User Login**
   - Endpoint: `/api/auth/login`
   - Accepts: `username/email` and `password`
   - Functionality: Uses `bcrypt.compare()` for secure password verification.
   - Issues a secure JWT token upon successful login for user authentication.

3. **Get User Profile**
   - Endpoint: `/api/users/me`
   - Retrieves: Authenticated user details such as `username`, `email`, roles, etc.
   - Security: Secured with JWT token validation ensuring only authorized users can access this endpoint.

4. **Task Management**
   - **Create Task**: `/api/tasks/create`
     - Allows creation of tasks with `title`, `description`, `due date`, `priority`, and `status`.
   - **Read Tasks**: `/api/tasks`
     - Fetch tasks with optional filtering and sorting functionality.
   - **Update Task**: `/api/tasks/update/:id`
     - Allows task modification.
   - **Delete Task**: `/api/tasks/delete/:id`
     - Safely deletes tasks with appropriate validations.

5. **Real-Time Updates**
   - Implemented **WebSockets (Socket.io)** for real-time notifications during task assignments or status changes.

6. **Task Tracking**
   - Each task is assigned a **unique tracking number** for easy monitoring and improved usability.

7. **Rate Limiting**
   - Rate limiting has been implemented on critical APIs to prevent abuse and ensure fair resource utilization.

8. **Regex Searching**
   - Implemented regex-based search functionality for tasks, allowing users to filter and track task statuses like `completed`, `pending`, and `overdue`.

## Installation

### Clone the Repository

```bash
git clone https://github.com/SatyaPrakashGolden/tasknode.git
cd tasknode



##Install Dependencies

npm install

##Start the Application
node index.js




