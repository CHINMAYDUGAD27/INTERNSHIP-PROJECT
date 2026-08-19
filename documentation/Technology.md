# Technology Stack

# AI-Powered Smart Kumbh Mela Administration & Decision Support System
### (Nashik–Trimbakeshwar Simhastha Kumbh Mela 2027–28)

---

# Introduction

The AI-Powered Smart Kumbh Mela Administration & Decision Support System is developed using modern web technologies, Artificial Intelligence, Machine Learning, data visualization tools, and database management systems. The selected technologies provide scalability, security, performance, and ease of maintenance.

---

# Overall Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js + Vite |
| Backend | FastAPI |
| Programming Language | Python 3 |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT (JSON Web Token) |
| Password Security | Passlib + Bcrypt |
| AI & Machine Learning | Scikit-learn (Random Forest) |
| Data Processing | Pandas, NumPy |
| Data Visualization | Recharts |
| Maps | Leaflet + OpenStreetMap |
| API Testing | Thunder Client |
| Version Control | Git & GitHub |
| IDE | Visual Studio Code |
| Deployment (Future) | Render, Vercel, Neon PostgreSQL |

---

# Frontend Technologies

## React.js

React.js is used to build a responsive, modular, and interactive user interface. It allows the application to be divided into reusable components, improving development speed and maintainability.

### Purpose

- Dashboard
- Login page
- Module pages
- Reports
- Charts
- Forms
- Maps

---

## Vite

Vite is used as the frontend build tool.

### Advantages

- Fast startup
- Fast compilation
- Lightweight
- Modern development experience

---

## Bootstrap

Bootstrap provides responsive layouts and ready-to-use UI components.

### Usage

- Navigation bars
- Cards
- Tables
- Forms
- Buttons
- Responsive grid system

---

# Backend Technologies

## FastAPI

FastAPI is used for developing REST APIs that connect the frontend, database, and AI modules.

### Responsibilities

- API development
- Authentication
- Database communication
- Report generation
- AI model integration
- Business logic

### Advantages

- High performance
- Automatic API documentation
- Easy integration with Python
- Asynchronous support

---

# Database

## PostgreSQL

PostgreSQL stores all project information securely.

### Stores

- Users
- Budgets
- Roads
- Land acquisition
- Traffic data
- Crowd records
- Medical records
- Police records
- Sanitation data
- Reports

---

# ORM

## SQLAlchemy

SQLAlchemy connects FastAPI with PostgreSQL.

### Benefits

- Object Relational Mapping (ORM)
- Easy database queries
- Better maintainability
- Secure database interaction

---

# Authentication

## JWT (JSON Web Token)

JWT provides secure user authentication and authorization.

### Features

- Secure login
- Role-based access
- Token verification
- Session management

---

## Passlib + Bcrypt

Used to encrypt user passwords before storing them in the database.

### Benefits

- Password hashing
- Enhanced security
- Protection against password theft

---

# Artificial Intelligence & Machine Learning

## Python

Python is the primary programming language used for backend development and AI implementation.

---

## Scikit-learn

Used to develop Machine Learning models.

### Implemented Models

- Crowd prediction
- Traffic prediction
- Crowd-risk classification

---

## Planned Models

Budget forecasting, medical-demand prediction, resource utilization prediction, waste generation prediction, and high-risk-zone detection are planned enhancements. XGBoost is not currently used by the repository.

---

# Data Processing

## Pandas

Used for:

- Reading datasets
- Cleaning data
- Data preprocessing
- Data analysis

---

## NumPy

Used for numerical computations and matrix operations required by Machine Learning algorithms.

---

# Data Visualization

## Recharts

Recharts creates interactive charts and dashboards in the React frontend.

### Visualizations

- Line Charts
- Bar Charts
- Pie Charts
- Area Charts
- Department Progress
- Budget Analysis
- Crowd Analytics

---

# Mapping Technology

## Leaflet

Leaflet is used for displaying interactive maps.

### Displays

- Ramkund
- Trimbakeshwar
- Hospitals
- Parking
- Police Stations
- Medical Camps
- Roads
- Ghats

---

## OpenStreetMap

Provides free map data used by Leaflet.

---

# Development Tools

## Visual Studio Code

Used for project development.

### Advantages

- Lightweight
- Extension support
- Integrated terminal
- Git integration
- Python debugging

---

## Git

Used for version control.

### Purpose

- Track changes
- Maintain project history
- Team collaboration

---

## GitHub

Used to host the project repository online.

### Benefits

- Code backup
- Collaboration
- Version management
- Deployment integration

---

# API Testing

## Thunder Client

Used inside Visual Studio Code for testing FastAPI APIs.

### Usage

- GET requests
- POST requests
- PUT requests
- DELETE requests
- Authentication testing

---

# Deployment Technologies (Future Scope)

## Render

Used for deploying the FastAPI backend.

---

## Vercel

Used for hosting the React frontend.

---

## Neon PostgreSQL

Cloud-hosted PostgreSQL database for production deployment.

---

# Why These Technologies?

The selected technologies are modern, open-source, scalable, secure, and widely used in industry. They provide excellent support for Artificial Intelligence, Machine Learning, web development, data visualization, and database management, making them suitable for building a large-scale Decision Support System for the Nashik–Trimbakeshwar Simhastha Kumbh Mela 2027–28.

---

# Conclusion

The implemented technology stack combines React.js, FastAPI, PostgreSQL, SQLAlchemy, Python, Scikit-learn, Recharts, and GIS mapping technologies. It provides centralized administration, implemented crowd/traffic analytics, and data visualization, with additional predictive models planned for future releases.
