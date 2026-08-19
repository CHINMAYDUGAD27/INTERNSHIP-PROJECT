# System Architecture

# AI-Powered Smart Kumbh Mela Administration & Decision Support System
### (Nashik–Trimbakeshwar Simhastha Kumbh Mela 2027–28)

---

# Introduction

The AI-Powered Smart Kumbh Mela Administration & Decision Support System follows a three-tier architecture consisting of the Presentation Layer, Application Layer, and Data Layer. Artificial Intelligence modules are integrated into the backend to provide predictive analytics and intelligent decision support.

The architecture is designed to be modular, scalable, secure, and maintainable, allowing new modules and AI models to be added in the future without major modifications.

---

# Overall System Architecture

```
+-----------------------------------------------------------+
|                        Users                              |
|-----------------------------------------------------------|
| Administrator | Police | Traffic | Medical | Sanitation   |
| Budget Officer | Volunteer Coordinator | Citizens         |
+----------------------------+------------------------------+
                             |
                             |
                             v
+-----------------------------------------------------------+
|                  React.js Frontend Dashboard              |
|-----------------------------------------------------------|
| Login | Dashboard | Maps | Reports | AI Chatbot | Charts  |
+----------------------------+------------------------------+
                             |
                    REST API (HTTP/HTTPS)
                             |
                             v
+-----------------------------------------------------------+
|                  FastAPI Backend Server                   |
|-----------------------------------------------------------|
| Authentication (JWT)                                      |
| Business Logic                                            |
| Report Generator                                          |
| AI Prediction Services                                    |
| Notification Services                                     |
+----------------------------+------------------------------+
             |                         |
             |                         |
             v                         v
+----------------------+     +------------------------------+
| PostgreSQL Database  |     | AI / Machine Learning Models |
|----------------------|     |------------------------------|
| Users                |     | Crowd Prediction             |
| Budget               |     | Traffic Prediction           |
| Roads                |     | Crowd-risk Classification    |
| Land                 |     | Planned: budget/medical/waste|
| Crowd                |     | Planned: resource/risk models|
| Medical              |     |                              |
| Police               |     |                              |
| Reports              |     +------------------------------+
+----------------------+
```

---

# Architecture Layers

## 1. Presentation Layer

The Presentation Layer is developed using React.js and provides a modern web interface for users.

### Responsibilities

- User Login
- Dashboard
- Data Entry Forms
- Interactive Maps
- Reports
- Charts
- AI Chat Interface

---

## 2. Application Layer

The Application Layer is developed using FastAPI.

This layer handles:

- Business Logic
- Authentication
- Database Operations
- AI Integration
- API Management
- Report Generation

---

## 3. Data Layer

The Data Layer uses PostgreSQL for storing all project data.

### Stored Data

- User Accounts
- Budget Details
- Infrastructure Progress
- Traffic Records
- Crowd Information
- Medical Data
- Police Reports
- Sanitation Records
- Generated Reports

---

# Artificial Intelligence Layer

The AI Layer analyzes historical and current data to generate predictions.

The following AI models are currently implemented:

- Crowd Prediction
- Traffic Prediction
- Crowd-risk Classification

Planned models include budget forecasting, road-delay prediction, medical/water/resource demand prediction, waste generation prediction, and high-risk-zone detection. The AI assistant currently injects database records into the Ollama prompt; vector-database RAG is planned.

---

# System Workflow

Step 1

User logs into the system.

↓

Step 2

Dashboard loads department information.

↓

Step 3

User enters or updates information.

↓

Step 4

Backend validates the data.

↓

Step 5

Data is stored in PostgreSQL.

↓

Step 6

AI models analyze the latest data.

↓

Step 7

Predictions are generated.

↓

Step 8

Results are displayed on dashboards, maps, charts, and reports.

---

# Security Architecture

The system includes:

- JWT Authentication
- Password Hashing using Bcrypt
- Role-Based Access Control
- Secure REST APIs
- Input Validation
- Error Handling

---

# Advantages of the Architecture

- Modular Design
- Easy Maintenance
- Scalable Architecture
- AI Integration
- Fast Performance
- Secure Communication
- Easy Deployment
- Future Expansion Support

---

# Conclusion

The proposed architecture provides a scalable, secure, and intelligent foundation for managing the Nashik–Trimbakeshwar Simhastha Kumbh Mela 2027–28. By integrating React.js, FastAPI, PostgreSQL, and Artificial Intelligence, the system enables centralized administration, predictive analytics, and data-driven decision-making for multiple government departments.
