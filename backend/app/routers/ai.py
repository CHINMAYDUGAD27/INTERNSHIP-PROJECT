from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.models.crowd import Crowd
from app.ai.crowd_ai import analyze_crowd
from app.ai.ollama_client import chat
from app.ml.prediction import predict_risk
from app.ml.crowd_prediction import predict_crowd

router = APIRouter(
    prefix="/ai",
    tags=["Artificial Intelligence"]
)


@router.get("/crowd-analysis/{crowd_id}")
def crowd_analysis(
    crowd_id: int,
    db: Session = Depends(get_db)
):

    crowd = db.query(Crowd).filter(
        Crowd.id == crowd_id
    ).first()

    if not crowd:
        raise HTTPException(
            status_code=404,
            detail="Crowd record not found"
        )

    result = analyze_crowd(
        crowd.location,
        crowd.expected_visitors,
        crowd.actual_visitors,
        crowd.risk_level
    )

    return {
        "crowd_data": {
            "location": crowd.location,
            "expected_visitors": crowd.expected_visitors,
            "actual_visitors": crowd.actual_visitors,
            "risk_level": crowd.risk_level
        },
        "ai_analysis": result
    }

@router.get("/crowd-risk")
def crowd_risk():

    risk = predict_risk(
        previous_visitors=150000,
        current_visitors=250000
    )

    return {
        "previous_visitors":150000,
        "current_visitors":250000,
        "predicted_risk":risk
    }

@router.get("/smart-crowd-analysis/{crowd_id}")
def smart_crowd_analysis(
    crowd_id:int,
    db:Session = Depends(get_db)
):

    crowd = db.query(Crowd).filter(
        Crowd.id == crowd_id
    ).first()


    if not crowd:
        raise HTTPException(
            status_code=404,
            detail="Crowd data not found"
        )


    # ML Prediction
    predicted_risk = predict_risk(
        crowd.expected_visitors,
        crowd.actual_visitors
    )


    # Ollama AI Recommendation
    ai_result = analyze_crowd(
        crowd.location,
        crowd.expected_visitors,
        crowd.actual_visitors,
        predicted_risk
    )


    return {

        "crowd_information":{

            "location":crowd.location,

            "expected_visitors":
            crowd.expected_visitors,

            "actual_visitors":
            crowd.actual_visitors

        },


        "ml_prediction":{

            "risk_level":
            predicted_risk

        },


        "ai_recommendation":
        ai_result

    }

@router.get("/predict-crowd")
def predict_crowd_api():

    predicted_visitors = predict_crowd(
        day_of_week="Monday",
        month="August",
        location="Ramkund",
        event_type="Shahi Snan",
        weather="Sunny",
        temperature=31
    )

    return {
        "predicted_visitors": predicted_visitors
    }


# ──────────────────────────────────────────────────────────────
#  RAG-powered Chat endpoint using Ollama + live DB context
# ──────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


# ── Official event schedule — COPIED EXACTLY from Information.jsx ─────────────
# This is the single source of truth. Any date question is answered
# from this Python dict — the AI model is never trusted for dates.
EVENT_SCHEDULE = [
    {
        "date": "31 October 2026",
        "name": "Official Commencement – Dhwajarohan (Flag Hoisting)",
        "location": "Ramkund & Nashik",
        "type": "Milestone",
        "keywords": ["commencement", "dhwajarohan", "flag hoisting", "flag hoisting 2026",
                     "official start", "mela starts", "kumbh starts", "begins", "start of kumbh"]
    },
    {
        "date": "24 July 2027",
        "name": "Flag Hoisting Ceremony (Opening of Main Mela)",
        "location": "Nashik & Trimbakeshwar",
        "type": "Milestone",
        "keywords": ["flag hoisting 2027", "main mela", "opening of main mela",
                     "main mela begins", "main mela starts"]
    },
    {
        "date": "2 August 2027",
        "name": "First Amrit Snan – Ashadh Somvati Amavasya",
        "location": "Ramkund & Kushavarta Kund",
        "type": "Amrit Snan",
        "keywords": ["first amrit snan", "1st amrit snan", "ashadh somvati",
                     "ashadh amavasya", "first snan", "first amrit"]
    },
    {
        "date": "31 August 2027",
        "name": "Second Amrit Snan – Shravan Amavasya",
        "location": "Ramkund & Kushavarta Kund",
        "type": "Amrit Snan",
        "keywords": ["second amrit snan", "2nd amrit snan", "shravan amavasya",
                     "shravan snan", "second snan", "second amrit"]
    },
    {
        "date": "5 September 2027",
        "name": "Rishi Panchami",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["rishi panchami"]
    },
    {
        "date": "11 September 2027",
        "name": "Third Amrit Snan (Vaishnava) – Bhadrapada Ekadashi",
        "location": "Ramkund & Nashik",
        "type": "Amrit Snan",
        "keywords": ["third amrit snan vaishnava", "vaishnava snan", "3rd amrit snan vaishnava",
                     "bhadrapada ekadashi vaishnava", "vaishnava amrit"]
    },
    {
        "date": "12 September 2027",
        "name": "Third Amrit Snan (Shaiva) – Bhadrapada Ekadashi",
        "location": "Kushavarta, Trimbak",
        "type": "Amrit Snan",
        "keywords": ["third amrit snan shaiva", "shaiva snan", "3rd amrit snan shaiva",
                     "bhadrapada ekadashi shaiva", "shaiva amrit"]
    },
    {
        "date": "15 September 2027",
        "name": "Bhadrapada Purnima",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["bhadrapada purnima"]
    },
    {
        "date": "11 October 2027",
        "name": "Ashwin Shudh Ekadashi",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["ashwin shudh ekadashi", "ashwin ekadashi"]
    },
    {
        "date": "15 October 2027",
        "name": "Ashwin Purnima",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["ashwin purnima"]
    },
    {
        "date": "10 November 2027",
        "name": "Kartik Shudh Ekadashi",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["kartik shudh ekadashi", "kartik ekadashi"]
    },
    {
        "date": "14 November 2027",
        "name": "Kartik Purnima",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["kartik purnima"]
    },
    {
        "date": "26 January 2028",
        "name": "Mouni Amavasya",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["mouni amavasya", "mauni amavasya"]
    },
    {
        "date": "1 February 2028",
        "name": "Vasant Panchami",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["vasant panchami", "basant panchami"]
    },
    {
        "date": "8 February 2028",
        "name": "Ganga Godavari Mahotsav",
        "location": "Ramkund, Nashik",
        "type": "Festival",
        "keywords": ["ganga godavari mahotsav", "godavari mahotsav", "ganga mahotsav"]
    },
    {
        "date": "27 February 2028",
        "name": "Maha Shivratri",
        "location": "Kushavarta, Trimbak",
        "type": "Festival",
        "keywords": ["maha shivratri", "mahashivratri", "shivratri"]
    },
    {
        "date": "25 May 2028 to 2 June 2028",
        "name": "Ganga Dussehra Utsav",
        "location": "Both Locations",
        "type": "Festival",
        "keywords": ["ganga dussehra", "dussehra utsav", "ganga dussehra utsav"]
    },
    {
        "date": "24 July 2028",
        "name": "Official Conclusion – Flag Lowering",
        "location": "Nashik & Trimbakeshwar",
        "type": "Milestone",
        "keywords": ["conclusion", "flag lowering", "mela ends", "end of mela",
                     "official conclusion", "last day", "kumbh ends"]
    },
]


def _find_event_date(user_message: str) -> str | None:
    """
    Check if the user is asking about an event date.
    If so, inject the ENTIRE official schedule directly into the prompt.
    This allows the AI to handle spelling variations (like Pournima vs Purnima)
    without failing strict Python keyword matches.
    """
    msg = user_message.lower()
    is_date_query = False
    
    date_triggers = ["when", "date", "schedule", "kab", "pournima", "purnima", "snan", "ekadashi", "panchami", "shivratri"]
    if any(t in msg for t in date_triggers):
        is_date_query = True

    for event in EVENT_SCHEDULE:
        if any(kw in msg for kw in event["keywords"]):
            is_date_query = True
            break

    if not is_date_query:
        return None

    schedule_str = "=== OFFICIAL PROJECT SCHEDULE (USE THIS FOR DATES) ===\n"
    for e in EVENT_SCHEDULE:
        schedule_str += f"- {e['name']}: {e['date']} ({e['location']})\n"

    return (
        "The user is asking about an event date. YOU MUST USE THE FOLLOWING SCHEDULE TO ANSWER. "
        "Ignore any other knowledge you have about dates. Match the user's spelling closely (e.g., 'Pournima' = 'Purnima').\n\n"
        + schedule_str
    )



def _build_rag_context(db: Session) -> str:
    """
    Pull ALL real-time data from the database and build a structured context
    string injected into every chat prompt.
    Includes per-location breakdown and aggregate summaries.
    """
    lines = ["=== LIVE KUMBH MELA DATABASE (fetched right now) ===\n"]

    # ── CROWD DATA ──────────────────────────────────────────────
    try:
        crowds = db.query(Crowd).all()
        if crowds:
            total_expected = sum(c.expected_visitors or 0 for c in crowds)
            total_actual   = sum(c.actual_visitors   or 0 for c in crowds)
            high_risk      = [c for c in crowds if c.risk_level in ("High", "Critical")]
            lines.append(f"CROWD DATA SUMMARY: Total Locations={len(crowds)}, Overall Expected={total_expected:,}, Overall Actual={total_actual:,}, High/Critical Risk Zones={len(high_risk)}")
            lines.append("CROWD DATA (all locations):")
            for c in crowds:
                lines.append(
                    f"  • {c.location}: actual={c.actual_visitors:,}, "
                    f"expected={c.expected_visitors:,}, risk={c.risk_level}, date={c.date}"
                )
        else:
            lines.append("CROWD DATA: No records in database.")
    except Exception as e:
        lines.append(f"CROWD DATA: Error fetching — {e}")

    # ── MEDICAL DATA ────────────────────────────────────────────
    try:
        from app.models.medical import Medical
        medicals = db.query(Medical).all()
        if medicals:
            total_docs  = sum(m.available_doctors   or 0 for m in medicals)
            total_ambs  = sum(m.available_ambulances or 0 for m in medicals)
            total_pts   = sum(m.actual_patients      or 0 for m in medicals)
            lines.append(f"\nMEDICAL DATA SUMMARY: Camps={len(medicals)}, Total Doctors={total_docs}, Total Ambulances={total_ambs}, Total Patients={total_pts}")
            lines.append("MEDICAL DATA (all camps):")
            for m in medicals:
                lines.append(
                    f"  • {m.medical_camp} @ {m.location}: "
                    f"doctors={m.available_doctors}, nurses={m.available_nurses}, "
                    f"ambulances={m.available_ambulances}, "
                    f"patients={m.actual_patients}/{m.expected_patients}, "
                    f"emergency={m.emergency_level}"
                )
        else:
            lines.append("\nMEDICAL DATA: No records in database.")
    except Exception as e:
        lines.append(f"\nMEDICAL DATA: Error fetching — {e}")

    # ── TRAFFIC DATA ─────────────────────────────────────────────
    try:
        from app.models.traffic import Traffic
        traffics = db.query(Traffic).all()
        if traffics:
            total_vehicles = sum(t.vehicle_count or 0 for t in traffics)
            avg_speed = round(sum(t.average_speed or 0 for t in traffics) / len(traffics), 1)
            lines.append(f"\nTRAFFIC DATA SUMMARY: Roads Monitored={len(traffics)}, Total Vehicles={total_vehicles:,}, Avg Speed={avg_speed} km/h")
            lines.append("TRAFFIC DATA (all roads):")
            for t in traffics:
                lines.append(
                    f"  • {t.road_name} @ {t.location}: "
                    f"vehicles={t.vehicle_count}, speed={t.average_speed} km/h, "
                    f"weather={t.weather_condition}, event={t.event_type}"
                )
        else:
            lines.append("\nTRAFFIC DATA: No records in database.")
    except Exception as e:
        lines.append(f"\nTRAFFIC DATA: Error fetching — {e}")

    # ── SAFETY DATA ──────────────────────────────────────────────
    try:
        from app.models.safety import Safety
        safeties = db.query(Safety).all()
        if safeties:
            total_officers = sum(s.officers_deployed or 0 for s in safeties)
            lines.append(f"\nSAFETY DATA SUMMARY: Checkpoints={len(safeties)}, Total Officers Deployed={total_officers}")
            lines.append("SAFETY DATA (all checkpoints):")
            for s in safeties:
                lines.append(
                    f"  • {s.checkpoint_name} (Zone: {s.zone}): "
                    f"officers={s.officers_deployed}, gate={s.gate_status}, "
                    f"density={s.crowd_density}, barricading={s.barricading_status}"
                )
        else:
            lines.append("\nSAFETY DATA: No records in database.")
    except Exception as e:
        lines.append(f"\nSAFETY DATA: Error fetching — {e}")

    # ── INFRASTRUCTURE & PROJECTS ────────────────────────────────
    try:
        from app.models.project import Project
        projects = db.query(Project).all()
        if projects:
            total_budget = sum(p.budget or 0 for p in projects)
            avg_progress = round(sum(p.progress or 0 for p in projects) / len(projects), 1)
            lines.append(f"\nINFRASTRUCTURE SUMMARY: Projects={len(projects)}, Total Budget=₹{total_budget:,}, Avg Progress={avg_progress}%")
            lines.append("INFRASTRUCTURE PROJECTS (all):")
            for p in projects:
                lines.append(f"  • {p.project_name} ({p.department}): Budget=₹{p.budget:,}, Progress={p.progress}%, Status={p.status}, Ends: {p.end_date}")
    except Exception: pass

    # ── BUDGET & FINANCE ─────────────────────────────────────────
    try:
        from app.models.budget import Budget
        budgets = db.query(Budget).all()
        if budgets:
            total_alloc = sum(b.allocated_budget or 0 for b in budgets)
            total_spent = sum(b.spent_budget or 0 for b in budgets)
            lines.append(f"\nBUDGET SUMMARY: Departments={len(budgets)}, Total Allocated=₹{total_alloc:,.2f}, Total Spent=₹{total_spent:,.2f}, Remaining=₹{total_alloc - total_spent:,.2f}")
            lines.append("DEPARTMENT BUDGETS (all):")
            for b in budgets:
                lines.append(f"  • {b.department}: Allocated=₹{b.allocated_budget:,.2f}, Spent=₹{b.spent_budget:,.2f}, Remaining=₹{b.remaining_budget:,.2f}")
    except Exception: pass

    # ── SADHU GRAM & AKHARAS ─────────────────────────────────────
    try:
        from app.models.sadhu_gram import SadhuGram
        sadhus = db.query(SadhuGram).all()
        if sadhus:
            total_sadhus = sum(sg.sadhu_count or 0 for sg in sadhus)
            lines.append(f"\nSADHU GRAM SUMMARY: Akharas={len(sadhus)}, Total Sadhus={total_sadhus:,}")
            lines.append("SADHU GRAM (all akharas):")
            for sg in sadhus:
                lines.append(f"  • {sg.akhara_name} (Zone {sg.zone}): Sadhus={sg.sadhu_count}/{sg.capacity}, Area={sg.allocated_area_sqm} sqm, Status={sg.status}")
    except Exception: pass

    # ── LAND ACQUISITION ─────────────────────────────────────────
    try:
        from app.models.land_acquisition import LandAcquisition
        lands = db.query(LandAcquisition).all()
        if lands:
            total_area = sum(l.area_sqm or 0 for l in lands)
            total_comp = sum(l.compensation_amount or 0 for l in lands)
            lines.append(f"\nLAND ACQUISITION SUMMARY: Parcels={len(lands)}, Total Area={total_area:,} sqm, Total Compensation=₹{total_comp:,.2f}")
            lines.append("LAND ACQUISITION (all):")
            for l in lands:
                lines.append(f"  • {l.location} (Owner: {l.owner_name}): Area={l.area_sqm} sqm, Purpose={l.purpose}, Status={l.status}, Cost=₹{l.compensation_amount:,.2f}")
    except Exception: pass

    # ── ACCOMMODATION ────────────────────────────────────────────
    try:
        from app.models.accommodation import Accommodation
        acc = db.query(Accommodation).all()
        if acc:
            confirmed = len([a for a in acc if a.status == "Confirmed"])
            lines.append(f"\nACCOMMODATION SUMMARY: Total Bookings={len(acc)}, Confirmed={confirmed}")
            lines.append("ACCOMMODATION (all devotees):")
            for a in acc:
                lines.append(f"  • {a.devotee_name} @ {a.location}: Status={a.status}, Darshan={a.darshan_slot}")
    except Exception: pass

    # ── CLEANLINESS & SANITATION ─────────────────────────────────
    try:
        from app.models.cleanliness import Cleanliness
        cln = db.query(Cleanliness).all()
        if cln:
            avg_aqi = round(sum(c.water_quality_index or 0 for c in cln) / len(cln), 1)
            lines.append(f"\nCLEANLINESS SUMMARY: Ghats Monitored={len(cln)}, Avg Water AQI={avg_aqi}")
            lines.append("CLEANLINESS (all ghats):")
            for c in cln:
                lines.append(f"  • {c.ghat_name} (Zone {c.zone}): Status={c.sanitation_status}, Water AQI={c.water_quality_index}, pH={c.ph_level}")
    except Exception: pass

    # ── OFFICIAL EVENT SCHEDULE ──────────────────────────────────
    lines.append("\nOFFICIAL NASHIK KUMBH MELA 2026-2028 EVENT SCHEDULE:")
    lines.append("  01 | 31 October 2026      | Official Commencement - Flag Hoisting")
    lines.append("  02 | 24 July 2027         | Flag Hoisting Ceremony - Main Mela Begins")
    lines.append("  03 | 02 August 2027       | First Amrit Snan - Ashadh Somvati Amavasya")
    lines.append("  04 | 31 August 2027       | Second Amrit Snan - Shravan Amavasya")
    lines.append("  05 | 05 September 2027    | Rishi Panchami")
    lines.append("  06 | 11 September 2027    | Third Amrit Snan - Vaishnava")
    lines.append("  07 | 12 September 2027    | Third Amrit Snan - Shaiva")
    lines.append("  08 | 15 September 2027    | Bhadrapada Purnima")
    lines.append("  09 | 11 October 2027      | Ashwin Shudh Ekadashi")
    lines.append("  10 | 15 October 2027      | Ashwin Purnima")
    lines.append("  11 | 10 November 2027     | Kartik Shudh Ekadashi")
    lines.append("  12 | 14 November 2027     | Kartik Purnima")
    lines.append("  13 | 26 January 2028      | Mouni Amavasya")
    lines.append("  14 | 01 February 2028     | Vasant Panchami")
    lines.append("  15 | 08 February 2028     | Ganga Godavari Mahotsav")
    lines.append("  16 | 27 February 2028     | Maha Shivratri")
    lines.append("  17 | 25 May 2028          | Ganga Dussehra Utsav")
    lines.append("  18 | 24 July 2028         | Official Conclusion - Mela Ends")

    # ── OFFICIALS & LEADERSHIP ────────────────────────────────────
    lines.append("\nOFFICIALS & LEADERSHIP:")
    lines.append("  • President of India: Droupadi Murmu")
    lines.append("  • Prime Minister of India: Narendra Modi")
    lines.append("  • Home Minister of India: Amit Shah")
    lines.append("  • Governor of Maharashtra: Jishnu Dev Varma")
    lines.append("  • Chief Minister of Maharashtra: Devendra Fadnavis")
    lines.append("  • Kumbh Mela Minister: Girish Mahajan")
    lines.append("  • Mayor of Nashik: Smt. Himgauri Aher-Adke")

    # ── EMERGENCY CONTACTS ────────────────────────────────────────
    lines.append("\nOFFICIAL EMERGENCY CONTACTS (Aaple Sarkar):")
    lines.append("  • Disaster Management: 1077")
    lines.append("  • Child Security & Welfare: 1098")
    lines.append("  • Women Security: 1091")
    lines.append("  • Confidential Crime Complaint: 1090")
    lines.append("  • Emergency Help (General): 112")
    lines.append("  • Police Help: 100")
    lines.append("  • Ambulance: 108")

    lines.append("\n=== END OF LIVE DATA ===")
    return "\n".join(lines)


@router.post("/chat")
def generic_ai_chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # Build RAG context from live database
        rag_context = _build_rag_context(db)

        system_prompt = (
            "You are KumbhAI — the AI Decision Support System for Nashik Kumbh Mela 2027-2028 administration.\n\n"

            "=== STATIC FACTS (ABSOLUTE TRUTH — NEVER CONTRADICT THESE) ===\n"
            "• Event Name: Nashik–Trimbakeshwar Simhastha Kumbh Mela 2027-2028\n"
            "• Frequency: Held every 12 years\n"
            "• Official Start: 31 October 2026 (Dhwajarohan / Flag Hoisting Ceremony)\n"
            "• Official End: 24 July 2028 (Flag Lowering / Mela Conclusion)\n"
            "• Location: Nashik (Ramkund Ghat) and Trimbakeshwar (Kushavarta Kund), Maharashtra, India\n"
            "• Sacred River: Godavari\n"
            "• Chief Minister of Maharashtra: Devendra Fadnavis\n"
            "• Kumbh Mela Minister: Girish Mahajan\n"
            "• Mayor of Nashik: Smt. Himgauri Aher-Adke\n"
            "• Key Bathing Dates (Amrit Snan):\n"
            "  - First Amrit Snan: 2 August 2027 (Ashadh Somvati Amavasya) at Ramkund & Kushavarta Kund\n"
            "  - Second Amrit Snan: 31 August 2027 (Shravan Amavasya)\n"
            "  - Third Amrit Snan (Vaishnava): 11 September 2027\n"
            "  - Third Amrit Snan (Shaiva): 12 September 2027\n"
            "  - Maha Shivratri Snan: 27 February 2028\n\n"

            "=== CRITICAL RULES (NEVER BREAK THESE) ===\n"
            "RULE 1 - STATIC FACTS: You MUST use the STATIC FACTS above for any question about dates, duration, location, or officials. NEVER use your own training data for these — it may be wrong.\n"
            "RULE 2 - NUMBERS: For crowd counts, budgets, officer counts, and all live metrics — "
            "ONLY use the numbers from the LIVE DATA section. NEVER invent or estimate numbers.\n"
            "RULE 3 - OFFICIALS: ONLY use names from the STATIC FACTS or OFFICIALS section. Never guess.\n"
            "RULE 4 - GENERAL KNOWLEDGE FALLBACK: First, always try to answer based on the LIVE DATA and STATIC FACTS provided. If the information requested is NOT available there (e.g., historical context, general Kumbh Mela traditions, religious significance), use your general intelligence to provide an accurate and helpful answer.\n"
            "RULE 5 - GREETINGS: For hi/hello/greetings — respond warmly and briefly, offer to help.\n"
            "RULE 6 - FORMAT: Be DIRECT. Do NOT start with preambles like 'Based on the provided data...' or 'According to...'. Answer immediately and concisely in under 200 words.\n\n"
            "=== LIVE PROJECT DATA ===\n"
            + rag_context
        )

        # Python-level event date lookup — injects the correct date directly
        # into the user message so the model cannot override it
        user_text = request.message
        verified_fact = _find_event_date(user_text)
        if verified_fact:
            user_text = f"{user_text}\n\n[SYSTEM NOTE: {verified_fact}]"

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_text}
        ]

        reply = chat(messages, temperature=0.05)
        return {"response": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))