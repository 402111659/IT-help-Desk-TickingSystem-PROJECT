# IT Help Desk Ticketing System

A full-stack IT Help Desk Ticketing System designed to help organizations manage, track, assign, and resolve IT support requests.

The system provides different functionality for Employees, Technicians, and Administrators, with secure authentication, role-based access control, ticket management, dashboards, and cloud deployment on AWS.

---

## 🚀 Live Application

### Frontend
https://master.d4qa3cwvbpi9o.amplifyapp.com/login

### Backend API
https://api.fatahhelpdesk.host

---

## 📌 Project Overview

The IT Help Desk Ticketing System replaces informal IT support requests such as emails and messages with a centralized ticket management platform.

Employees can submit IT issues and track their tickets, while technicians can manage assigned support requests and administrators can manage users, technicians, tickets, and system information.

### Example IT requests

- Laptop cannot connect to Wi-Fi
- Password reset request
- Printer not working
- Software installation request
- Network connectivity issue
- Hardware problem
- Account access issue

---

# ✨ Features

## 👤 Employee

Employees can:

- Register an account
- Log in using email/password
- Sign in using Google OAuth
- Create support tickets
- Upload screenshots/evidence
- View their submitted tickets
- Track ticket status
- View ticket details
- View ticket history
- Receive ticket updates
- Access help and troubleshooting information

---

## 🧑‍💻 Technician

Technicians can:

- Log in securely
- View assigned tickets
- View ticket details
- Update ticket status
- Change ticket priority
- Add comments
- Resolve support requests
- Manage assigned IT incidents

---

## 👨‍💼 Administrator

Administrators can:

- Log in securely
- View all tickets
- Manage users
- Create technicians
- Assign technicians to tickets
- Manage ticket priorities and statuses
- View dashboards
- View system analytics
- View ticket statistics
- Monitor help desk activity

---

# 🔐 Security

The application implements multiple security mechanisms to protect the system and control access.

### Authentication

- JWT-based authentication
- Google OAuth 2.0 authentication
- BCrypt password hashing
- Secure authentication filters

### Authorization

Role-based access control is implemented using:

- `EMPLOYEE`
- `TECHNICIAN`
- `ADMIN`

Different users receive access to functionality based on their assigned role.

Spring Security is used to protect backend endpoints and enforce authorization rules.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       Users          │
                         │ Employee / Tech /    │
                         │       Admin          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Angular Frontend   │
                         │      TypeScript      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     AWS Amplify      │
                         │   Frontend Hosting   │
                         └──────────┬───────────┘
                                    │
                                  HTTPS
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Application Load     │
                         │      Balancer        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  AWS Elastic         │
                         │     Beanstalk        │
                         │   Spring Boot API    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Amazon RDS      │
                         │        MySQL         │
                         └──────────────────────┘
