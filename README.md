# IT Help Desk Ticketing System

A full-stack IT Help Desk Ticketing System designed to help organizations manage IT support requests from ticket creation through resolution.

The system allows employees to report IT issues, technicians to manage assigned tickets, and administrators to manage users, tickets, and system analytics.

---

## Project Overview

The IT Help Desk Ticketing System replaces informal IT support requests with a structured ticketing workflow.

Users can:

- Create IT support tickets
- Track ticket status
- View ticket history
- Add comments
- Upload supporting information/screenshots
- Receive assistance from technicians

Technicians can:

- View assigned tickets
- Update ticket status
- Change ticket priority
- Add comments
- Resolve tickets

Administrators can:

- View all tickets
- Manage users
- Create technicians
- Assign technicians
- Manage user roles
- View ticket statistics
- View system analytics
- Monitor overall system activity

---

# Technology Stack

## Frontend

- Angular
- TypeScript
- HTML5
- CSS3
- Chart.js
- Angular Router
- HTTP Client

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- JWT Authentication
- Google OAuth 2.0

## Database

- MySQL
- Amazon RDS

## Cloud / Deployment

- AWS Amplify — Angular frontend
- AWS Elastic Beanstalk — Spring Boot backend
- Amazon RDS — MySQL database

## Development Tools

- Visual Studio Code
- IntelliJ IDEA
- Git
- GitHub
- GitHub Desktop
- Maven
- MySQL Workbench

---

# System Architecture

The application follows a full-stack cloud architecture:

```text
                    USERS
                      │
                      ▼
              ┌───────────────┐
              │ AWS Amplify   │
              │ Angular       │
              │ Frontend      │
              └───────┬───────┘
                      │
                  REST API
                      │
                      ▼
          ┌──────────────────────┐
          │ AWS Elastic Beanstalk │
          │ Spring Boot Backend   │
          └──────────┬───────────┘
                     │
                     │ JPA / Hibernate
                     ▼
             ┌────────────────┐
             │ Amazon RDS      │
             │ MySQL Database  │
             └────────────────┘
