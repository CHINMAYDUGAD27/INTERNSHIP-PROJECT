"""
Kumbh Mela DSS — Data Seed Script
Run from the backend/ directory:  python seed_data.py
Wipes existing rows and re-inserts rich, realistic records (5-8 per module).
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date
from app.database.database import SessionLocal, engine, Base
from app.models.crowd import Crowd
from app.models.medical import Medical
from app.models.land_acquisition import LandAcquisition
from app.models.safety import Safety
from app.models.sadhu_gram import SadhuGram
from app.models.accommodation import Accommodation
from app.models.cleanliness import Cleanliness

# ── ensure tables exist ──────────────────────────────────────────────────────
import app.models.user, app.models.dashboard, app.models.project
import app.models.budget, app.models.traffic
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def clear(model):
    db.query(model).delete()
    db.commit()

# ════════════════════════════════════════════════════════════════════════════
# 1. CROWD PREDICTION  — all dates in 2027 event window
# ════════════════════════════════════════════════════════════════════════════
print("Seeding Crowd Prediction...")
clear(Crowd)

crowd_records = [
    Crowd(date=date(2027, 8, 15), location="Ramkund Ghat",          expected_visitors=850000,  actual_visitors=920000,  risk_level="High"),
    Crowd(date=date(2027, 8, 15), location="Trimbakeshwar Temple",   expected_visitors=600000,  actual_visitors=580000,  risk_level="Medium"),
    Crowd(date=date(2027, 8, 17), location="Panchavati",             expected_visitors=400000,  actual_visitors=435000,  risk_level="High"),
    Crowd(date=date(2027, 8, 19), location="Tapovan Ghat",           expected_visitors=300000,  actual_visitors=270000,  risk_level="Low"),
    Crowd(date=date(2027, 8, 21), location="Saptashrungi Road",      expected_visitors=500000,  actual_visitors=550000,  risk_level="Medium"),
    Crowd(date=date(2027, 8, 24), location="Nashik Road Junction",   expected_visitors=750000,  actual_visitors=710000,  risk_level="Medium"),
    Crowd(date=date(2027, 8, 29), location="Godavari Sangam Point",  expected_visitors=1200000, actual_visitors=1380000, risk_level="High"),
    Crowd(date=date(2027, 9, 3),  location="Mukti Dham Area",        expected_visitors=320000,  actual_visitors=295000,  risk_level="Low"),
]
db.add_all(crowd_records)
db.commit()
print(f"  [OK] {len(crowd_records)} crowd records inserted")

# ════════════════════════════════════════════════════════════════════════════
# 2. MEDICAL EMERGENCY
# ════════════════════════════════════════════════════════════════════════════
print("Seeding Medical Emergency...")
clear(Medical)

medical_records = [
    Medical(location="Zone A – Ramkund",        medical_camp="Civil Hospital Nashik",           available_doctors=28, available_nurses=55, available_ambulances=14, expected_patients=800, actual_patients=912, emergency_level="High"),
    Medical(location="Zone B – Trimbakeshwar",  medical_camp="Trimbakeshwar Field Camp",        available_doctors=12, available_nurses=22, available_ambulances=6,  expected_patients=400, actual_patients=387, emergency_level="Normal"),
    Medical(location="Zone C – Panchavati",     medical_camp="Panchavati PHC",                  available_doctors=8,  available_nurses=18, available_ambulances=4,  expected_patients=350, actual_patients=402, emergency_level="High"),
    Medical(location="Zone D – Tapovan",        medical_camp="Tapovan Medical Outpost",          available_doctors=6,  available_nurses=12, available_ambulances=2,  expected_patients=200, actual_patients=190, emergency_level="Normal"),
    Medical(location="Zone E – Nashik Road",    medical_camp="Apollo Clinic (Kumbh Branch)",    available_doctors=15, available_nurses=28, available_ambulances=8,  expected_patients=600, actual_patients=631, emergency_level="Critical"),
    Medical(location="Zone F – Godavari Nagar", medical_camp="Godavari Nagar Trauma Center",   available_doctors=20, available_nurses=38, available_ambulances=10, expected_patients=500, actual_patients=478, emergency_level="Normal"),
    Medical(location="Zone G – Saptashrungi",   medical_camp="Saptashrungi Mobile Medical Unit",available_doctors=5,  available_nurses=10, available_ambulances=0,  expected_patients=150, actual_patients=178, emergency_level="High"),
]
db.add_all(medical_records)
db.commit()
print(f"  [OK] {len(medical_records)} medical records inserted")

# ════════════════════════════════════════════════════════════════════════════
# 3. LAND ACQUISITION
# ════════════════════════════════════════════════════════════════════════════
print("Seeding Land Acquisition...")
clear(LandAcquisition)

land_records = [
    LandAcquisition(parcel_id="PCL-2701", owner_name="Ramesh Shankar Patil",    area_sqm=12500, location="Survey No. 45, Ramkund, Nashik",           purpose="Camps",          status="Acquired",     compensation_amount=3750000,  acquisition_date=date(2027, 6, 12)),
    LandAcquisition(parcel_id="PCL-2702", owner_name="Sunita Vijay Joshi",      area_sqm=8400,  location="Survey No. 12, Trimbak Road, Nashik",       purpose="Roads",          status="Acquired",     compensation_amount=2100000,  acquisition_date=date(2027, 5, 28)),
    LandAcquisition(parcel_id="PCL-2703", owner_name="Prakash Narayan Deshmukh",area_sqm=5200,  location="Gat No. 88, Panchavati",                    purpose="Parking",        status="Acquired",     compensation_amount=1560000,  acquisition_date=date(2027, 7, 3)),
    LandAcquisition(parcel_id="PCL-2704", owner_name="Mangala Bapu Shinde",     area_sqm=9800,  location="Survey No. 67, Tapovan, Nashik",             purpose="Infrastructure", status="Pending",      compensation_amount=2940000,  acquisition_date=None),
    LandAcquisition(parcel_id="PCL-2705", owner_name="Yogesh Mahadev Kulkarni", area_sqm=6700,  location="CTS No. 201, Nashik Road",                  purpose="Camps",          status="Acquired",     compensation_amount=2010000,  acquisition_date=date(2027, 7, 15)),
    LandAcquisition(parcel_id="PCL-2706", owner_name="Vandana Suresh Wagh",     area_sqm=4300,  location="Survey No. 33, Godavari Nagar",              purpose="Roads",          status="On Hold",      compensation_amount=1290000,  acquisition_date=None),
    LandAcquisition(parcel_id="PCL-2707", owner_name="Dinkar Bhau Pawar",       area_sqm=11000, location="Gat No. 102, Saptashrungi Corridor",         purpose="Camps",          status="Acquired",     compensation_amount=3300000,  acquisition_date=date(2027, 6, 30)),
    LandAcquisition(parcel_id="PCL-2708", owner_name="Rekha Vitthal Bhosale",   area_sqm=3100,  location="Survey No. 77, Mukti Dham Road",             purpose="Parking",        status="Rejected",     compensation_amount=930000,   acquisition_date=None),
]
db.add_all(land_records)
db.commit()
print(f"  [OK] {len(land_records)} land acquisition records inserted")

# ════════════════════════════════════════════════════════════════════════════
# 4. SAFETY & PUBLIC CONTROL
# ════════════════════════════════════════════════════════════════════════════
print("Seeding Safety & Public Control...")
clear(Safety)

safety_records = [
    Safety(checkpoint_name="Ramkund Main Gate",        zone="Zone A",  officers_deployed=85,  barricading_status="Active",   gate_status="Open",   crowd_density="High",   last_updated=date(2027, 8, 15), remarks="Stampede alert — extra forces deployed"),
    Safety(checkpoint_name="Trimbak Road Checkpoint",  zone="Zone B",  officers_deployed=60,  barricading_status="Active",   gate_status="Open",   crowd_density="Medium", last_updated=date(2027, 8, 15), remarks="Smooth flow — VIP convoy passing at 14:00"),
    Safety(checkpoint_name="Panchavati Crossing",      zone="Zone C",  officers_deployed=45,  barricading_status="Partial",  gate_status="Open",   crowd_density="High",   last_updated=date(2027, 8, 17), remarks="Barricade repair underway"),
    Safety(checkpoint_name="Tapovan Bridge Entry",     zone="Zone D",  officers_deployed=30,  barricading_status="Active",   gate_status="Closed", crowd_density="Low",    last_updated=date(2027, 8, 15), remarks="Gate closed for structural inspection"),
    Safety(checkpoint_name="Nashik Road Toll Naka",    zone="Zone E",  officers_deployed=72,  barricading_status="Active",   gate_status="Open",   crowd_density="Medium", last_updated=date(2027, 8, 21), remarks="Night shift reinforcement active"),
    Safety(checkpoint_name="Godavari Nagar Entry",     zone="Zone F",  officers_deployed=50,  barricading_status="Inactive", gate_status="Closed", crowd_density="Low",    last_updated=date(2027, 8, 19), remarks="Barricading equipment delayed — awaiting EOD"),
    Safety(checkpoint_name="Saptashrungi Path Gate",   zone="Zone G",  officers_deployed=38,  barricading_status="Active",   gate_status="Open",   crowd_density="Medium", last_updated=date(2027, 8, 24), remarks="Pilgrim flow stable — religious procession expected"),
    Safety(checkpoint_name="Mukti Dham Perimeter",     zone="Zone H",  officers_deployed=20,  barricading_status="Inactive", gate_status="Closed", crowd_density="Low",    last_updated=date(2027, 8, 15), remarks="Low footfall — 2 officers on leave"),
]
db.add_all(safety_records)
db.commit()
print(f"  [OK] {len(safety_records)} safety records inserted")

# ════════════════════════════════════════════════════════════════════════════
# 5. SADHU GRAM MANAGEMENT
# ════════════════════════════════════════════════════════════════════════════
print("Seeding Sadhu Gram...")
clear(SadhuGram)

sadhu_records = [
    SadhuGram(akhara_name="Shri Niranjani Akhara",         zone="Zone A", camp_number="NRA-01", allocated_area_sqm=18000, capacity=5000, sadhu_count=4820, status="Active"),
    SadhuGram(akhara_name="Shri Juna Akhara",              zone="Zone B", camp_number="JNA-01", allocated_area_sqm=22000, capacity=7000, sadhu_count=6750, status="Active"),
    SadhuGram(akhara_name="Shri Mahanirvani Akhara",       zone="Zone A", camp_number="MNA-01", allocated_area_sqm=15000, capacity=4500, sadhu_count=4480, status="Active"),
    SadhuGram(akhara_name="Atal Akhara",                   zone="Zone C", camp_number="ATA-01", allocated_area_sqm=10000, capacity=3000, sadhu_count=2900, status="Active"),
    SadhuGram(akhara_name="Shri Panchagni Akhara",         zone="Zone D", camp_number="PGA-01", allocated_area_sqm=8000,  capacity=2500, sadhu_count=1800, status="Active"),
    SadhuGram(akhara_name="Shri Awahan Akhara",            zone="Zone B", camp_number="AWA-01", allocated_area_sqm=9500,  capacity=2800, sadhu_count=2650, status="Active"),
    SadhuGram(akhara_name="Namo Narayan Akhara",           zone="Zone E", camp_number="NNA-01", allocated_area_sqm=6000,  capacity=1800, sadhu_count=0,    status="Inactive"),
]
db.add_all(sadhu_records)
db.commit()
print(f"  [OK] {len(sadhu_records)} sadhu gram records inserted")

# ════════════════════════════════════════════════════════════════════════════
# 6. ACCOMMODATION & DARSHAN
# ════════════════════════════════════════════════════════════════════════════
print("Seeding Accommodation...")
clear(Accommodation)

accom_records = [
    Accommodation(devotee_name="Priya Ramesh Agarwal",     contact="9823012345", location="Tent Colony A, Ramkund",       check_in=date(2027, 8, 14), check_out=date(2027, 8, 17), token_number="TKN-4401", darshan_slot="Sinhasta – 06:00–08:00", status="Checked In"),
    Accommodation(devotee_name="Mohan Das Tripathi",        contact="9765432100", location="Dharamshala B, Panchavati",    check_in=date(2027, 8, 15), check_out=date(2027, 8, 20), token_number="TKN-4402", darshan_slot="Sinhasta – 08:00–10:00", status="Checked In"),
    Accommodation(devotee_name="Kavita Suresh Mishra",      contact="9911223344", location="Tent Colony C, Tapovan",       check_in=date(2027, 8, 17), check_out=date(2027, 8, 22), token_number="TKN-4403", darshan_slot="Sinhasta – 10:00–12:00", status="Waiting"),
    Accommodation(devotee_name="Balaram Venkat Iyer",       contact="9876500001", location="Bhakta Niwas, Nashik Road",    check_in=date(2027, 8, 18), check_out=date(2027, 8, 21), token_number="TKN-4404", darshan_slot="Sinhasta – 14:00–16:00", status="Checked In"),
    Accommodation(devotee_name="Geeta Arvind Sharma",       contact="9820099887", location="Tent Colony A, Ramkund",       check_in=date(2027, 8, 20), check_out=date(2027, 8, 23), token_number="TKN-4405", darshan_slot="Sinhasta – 06:00–08:00", status="Waiting"),
    Accommodation(devotee_name="Suresh Narayan Pandey",     contact="9988776655", location="Bhakta Niwas, Trimbakeshwar",  check_in=date(2027, 8, 22), check_out=date(2027, 8, 25), token_number="TKN-4406", darshan_slot="Sinhasta – 16:00–18:00", status="Waiting"),
    Accommodation(devotee_name="Anjali Deepak Joshi",       contact="9765011234", location="Tent Colony B, Panchavati",    check_in=date(2027, 8, 25), check_out=date(2027, 8, 28), token_number="TKN-4407", darshan_slot="Sinhasta – 08:00–10:00", status="Checked Out"),
    Accommodation(devotee_name="Rajan Bholanath Tiwari",    contact="9444556677", location="Dharamshala A, Tapovan",       check_in=date(2027, 8, 28), check_out=date(2027, 9, 2),  token_number="TKN-4408", darshan_slot="Sinhasta – 12:00–14:00", status="Waiting"),
]
db.add_all(accom_records)
db.commit()
print(f"  [OK] {len(accom_records)} accommodation records inserted")

# ════════════════════════════════════════════════════════════════════════════
# 7. CLEANLINESS & GODAVARI MONITORING
# ════════════════════════════════════════════════════════════════════════════
print("Seeding Cleanliness...")
clear(Cleanliness)

cleanliness_records = [
    Cleanliness(zone="Zone A", ghat_name="Ramkund Ghat",          sanitation_status="Clean",     water_quality_index=78.5, ph_level=7.2, dissolved_oxygen=6.8, last_checked=date(2027, 8, 15), remarks="Pre-Sinhasta deep cleaning completed"),
    Cleanliness(zone="Zone B", ghat_name="Panchvati Ghat",        sanitation_status="Moderate",  water_quality_index=62.1, ph_level=7.6, dissolved_oxygen=5.9, last_checked=date(2027, 8, 15), remarks="Idol immersion residue — cleanup in progress"),
    Cleanliness(zone="Zone C", ghat_name="Tapovan Ghat",          sanitation_status="Clean",     water_quality_index=82.3, ph_level=7.0, dissolved_oxygen=7.4, last_checked=date(2027, 8, 17), remarks="Satisfactory — daily inspection passed"),
    Cleanliness(zone="Zone D", ghat_name="Kapileshwar Ghat",      sanitation_status="Poor",      water_quality_index=44.6, ph_level=8.1, dissolved_oxygen=4.2, last_checked=date(2027, 8, 19), remarks="High faecal coliform detected — advisory issued"),
    Cleanliness(zone="Zone E", ghat_name="Ahilya Devi Ghat",      sanitation_status="Moderate",  water_quality_index=65.8, ph_level=7.4, dissolved_oxygen=6.1, last_checked=date(2027, 8, 21), remarks="Overflow from temporary toilets — repair underway"),
    Cleanliness(zone="Zone F", ghat_name="Godavari Sangam Ghat",  sanitation_status="Clean",     water_quality_index=74.2, ph_level=7.1, dissolved_oxygen=7.0, last_checked=date(2027, 8, 24), remarks="Post-Sinhasta snan — normal levels restored"),
    Cleanliness(zone="Zone G", ghat_name="Saptashrungi Approach",  sanitation_status="Moderate", water_quality_index=59.0, ph_level=7.8, dissolved_oxygen=5.5, last_checked=date(2027, 8, 29), remarks="Monsoon runoff affecting WQI — monitoring daily"),
]
db.add_all(cleanliness_records)
db.commit()
print(f"  [OK] {len(cleanliness_records)} cleanliness records inserted")

db.close()
print("\nAll seed data inserted successfully!")
print("   Modules seeded: Crowd, Medical, Land Acquisition, Safety, Sadhu Gram, Accommodation, Cleanliness")
