# Database Design

# AI-Powered Smart Kumbh Mela Administration & Decision Support System
### (Nashik–Trimbakeshwar Simhastha Kumbh Mela 2027–28)

---

# Introduction

The database is one of the core components of the AI-Powered Smart Kumbh Mela Administration & Decision Support System. It is designed to store, manage, and retrieve data related to project planning, infrastructure development, crowd management, traffic, medical services, security, sanitation, reports, and user management.

The project uses PostgreSQL as the relational database management system and SQLAlchemy as the Object Relational Mapper (ORM).

---

# Database Objectives

The database is designed to:

- Store information securely.
- Maintain data consistency.
- Support multiple departments.
- Enable fast retrieval of records.
- Provide reliable data for AI prediction models.
- Generate reports and analytics.
- Maintain historical records for future analysis.

---

# Database Tables

The system contains the following major tables.

## 1. Users

Purpose:
Stores login details and user roles.

Fields:

- user_id (Primary Key)
- full_name
- email
- password
- role
- department
- mobile_number
- created_at

---

## 2. Budget

Purpose:
Stores budget allocation and expenditure.

Fields:

- budget_id
- department
- allocated_amount
- utilized_amount
- remaining_amount
- financial_year
- last_updated

---

## 3. Land_Acquisition

Purpose:
Stores land acquisition details.

Fields:

- land_id
- village_name
- survey_number
- total_area
- acquired_area
- compensation_amount
- acquisition_status
- legal_issue
- updated_at

---

## 4. Road_Development

Purpose:
Stores infrastructure development records.

Fields:

- road_id
- road_name
- project_type
- total_length
- completed_length
- contractor_name
- project_status
- expected_completion
- progress_percentage

---

## 5. Sadhugram

Purpose:
Stores Sadhugram infrastructure information.

Fields:

- sadhugram_id
- location
- capacity
- occupied_capacity
- tents
- toilets
- water_supply
- electricity_supply
- waste_collection

---

## 6. Crowd

Purpose:
Stores crowd-related information.

Fields:

- crowd_id
- location
- date
- time
- estimated_count
- actual_count
- risk_level

---

## 7. Traffic

Purpose:
Stores traffic monitoring records.

Fields:

- traffic_id
- road_name
- congestion_level
- vehicle_count
- average_speed
- diversion_status
- parking_status
- updated_at

---

## 8. Medical

Purpose:
Stores medical facility information.

Fields:

- medical_id
- hospital_name
- available_beds
- doctors_available
- ambulances_available
- emergency_cases
- medicines_available

---

## 9. Police

Purpose:
Stores police deployment details.

Fields:

- police_id
- station_name
- officers_deployed
- incidents_reported
- missing_person_cases
- lost_found_cases

---

## 10. Sanitation

Purpose:
Stores sanitation and cleanliness records.

Fields:

- sanitation_id
- area_name
- garbage_collected
- toilets_cleaned
- waste_level
- river_cleanliness_score

---

## 11. Weather

Purpose:
Stores weather information.

Fields:

- weather_id
- temperature
- humidity
- rainfall
- air_quality_index
- river_level
- weather_alert

---

## 12. Resources

Purpose:
Stores government resource details.

Fields:

- resource_id
- resource_type
- quantity
- available
- assigned_department
- status

---

## 13. Volunteers

Purpose:
Stores volunteer information.

Fields:

- volunteer_id
- name
- mobile
- department
- duty_location
- shift
- attendance

---

## 14. Reports

Purpose:
Stores generated reports.

Fields:

- report_id
- report_name
- report_type
- generated_by
- generated_date
- report_path

---

# Entity Relationships

The Users table is connected with all department modules through user roles.

The Reports table collects data from every department.

AI prediction models use data from:

- Crowd
- Traffic
- Budget
- Medical
- Weather
- Sanitation
- Resources

These datasets are processed to generate predictions and recommendations.

---

# ER Diagram (Conceptual)

```
Users
   |
   |------ Budget
   |
   |------ Road Development
   |
   |------ Land Acquisition
   |
   |------ Crowd
   |
   |------ Traffic
   |
   |------ Medical
   |
   |------ Police
   |
   |------ Sanitation
   |
   |------ Resources
   |
   |------ Volunteers
   |
   |------ Reports
```

---

# Database Features

- Normalized relational database
- Secure data storage
- Fast querying
- Department-wise data segregation
- AI-compatible dataset structure
- Easy backup and recovery
- Scalable for future expansion

---

# Conclusion

The proposed database design provides a robust and scalable structure for managing the various operational aspects of the Nashik–Trimbakeshwar Simhastha Kumbh Mela. It supports centralized data management, AI-driven analytics, report generation, and efficient coordination among multiple government departments.