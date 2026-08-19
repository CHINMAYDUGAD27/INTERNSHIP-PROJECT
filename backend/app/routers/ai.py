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

    Includes per-location breakdown so questions like
    "how many pilgrims at Ramkund?" can be answered with ACTUAL DB values.
    """
    lines = ["=== LIVE KUMBH MELA DATABASE (fetched right now) ===\n"]

    # ── CROWD DATA (per location) ──────────────────────────────
    try:
        crowds = db.query(Crowd).all()
        if crowds:
            total_expected = sum(c.expected_visitors or 0 for c in crowds)
            total_actual   = sum(c.actual_visitors   or 0 for c in crowds)
            lines.append("CROWD DATA (per location):")
            lines.append(f"  Overall — Expected: {total_expected:,} | Actual: {total_actual:,}")
            for c in crowds:
                lines.append(
                    f"  • {c.location}: actual={c.actual_visitors:,}, "
                    f"expected={c.expected_visitors:,}, risk={c.risk_level}, date={c.date}"
                )
        else:
            lines.append("CROWD DATA: No records in database.")
    except Exception as e:
        lines.append(f"CROWD DATA: Error fetching — {e}")

    # ── MEDICAL DATA (per camp) ────────────────────────────────
    try:
        from app.models.medical import Medical
        medicals = db.query(Medical).all()
        if medicals:
            lines.append("\nMEDICAL DATA (per camp):")
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

    # ── TRAFFIC DATA (per road) ────────────────────────────────
    try:
        from app.models.traffic import Traffic
        traffics = db.query(Traffic).all()
        if traffics:
            lines.append("\nTRAFFIC DATA (per road):")
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

    # ── SAFETY DATA (per checkpoint) ──────────────────────────
    try:
        from app.models.safety import Safety
        safeties = db.query(Safety).all()
        if safeties:
            total_officers = sum(s.officers_deployed or 0 for s in safeties)
            lines.append(f"\nSAFETY DATA (total officers: {total_officers}):")
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

    # ── INFRASTRUCTURE & PROJECTS ──────────────────────────────
    try:
        from app.models.project import Project
        projects = db.query(Project).all()
        if projects:
            lines.append("\nINFRASTRUCTURE PROJECTS:")
            for p in projects:
                lines.append(f"  • {p.project_name} ({p.department}): Budget=₹{p.budget:,}, Progress={p.progress}%, Status={p.status}, Ends: {p.end_date}")
    except Exception: pass

    # ── BUDGET & FINANCE ──────────────────────────────────────
    try:
        from app.models.budget import Budget
        budgets = db.query(Budget).all()
        if budgets:
            lines.append("\nDEPARTMENT BUDGETS:")
            for b in budgets:
                lines.append(f"  • {b.department}: Allocated=₹{b.allocated_budget:,.2f}, Spent=₹{b.spent_budget:,.2f}, Remaining=₹{b.remaining_budget:,.2f}")
    except Exception: pass

    # ── SADHU GRAM & AKHARAS ──────────────────────────────────
    try:
        from app.models.sadhu_gram import SadhuGram
        sadhus = db.query(SadhuGram).all()
        if sadhus:
            lines.append("\nSADHU GRAM (AKHARAS):")
            for sg in sadhus:
                lines.append(f"  • {sg.akhara_name} (Zone {sg.zone}): Sadhus={sg.sadhu_count}/{sg.capacity}, Area={sg.allocated_area_sqm} sqm, Status={sg.status}")
    except Exception: pass

    # ── LAND ACQUISITION ──────────────────────────────────────
    try:
        from app.models.land_acquisition import LandAcquisition
        lands = db.query(LandAcquisition).all()
        if lands:
            lines.append("\nLAND ACQUISITION:")
            for l in lands:
                lines.append(f"  • {l.location} (Owner: {l.owner_name}): Area={l.area_sqm} sqm, Purpose={l.purpose}, Status={l.status}, Cost=₹{l.compensation_amount:,.2f}")
    except Exception: pass

    # ── ACCOMMODATION ──────────────────────────────────────────
    try:
        from app.models.accommodation import Accommodation
        acc = db.query(Accommodation).all()
        if acc:
            lines.append("\nACCOMMODATION (Devotees):")
            for a in acc:
                lines.append(f"  • {a.devotee_name} @ {a.location}: Status={a.status}, Darshan={a.darshan_slot}")
    except Exception: pass

    # ── CLEANLINESS & SANITATION ──────────────────────────────
    try:
        from app.models.cleanliness import Cleanliness
        cln = db.query(Cleanliness).all()
        if cln:
            lines.append("\nCLEANLINESS (Water & Ghats):")
            for c in cln:
                lines.append(f"  • {c.ghat_name} (Zone {c.zone}): Status={c.sanitation_status}, Water AQI={c.water_quality_index}, pH={c.ph_level}")
    except Exception: pass

    # ── OFFICIAL EVENT SCHEDULE ──────────────────────────────
    lines.append("\nOFFICIAL NASHIK KUMBH MELA 2026-2028 EVENT SCHEDULE:")
    lines.append("  (Each line: EVENT NUMBER | DATE | EVENT NAME)")
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

    # ── OFFICIALS & LEADERSHIP ────────────────────────────────
    lines.append("\nOFFICIALS & LEADERSHIP:")
    lines.append("  • President of India: Droupadi Murmu")
    lines.append("  • Prime Minister of India: Narendra Modi")
    lines.append("  • Home Minister of India: Amit Shah")
    lines.append("  • Governor of Maharashtra: Jishnu Dev Varma")
    lines.append("  • Chief Minister of Maharashtra: Devendra Fadnavis")
    lines.append("  • Kumbh Mela Minister: Girish Mahajan")
    lines.append("  • Mayor of Nashik: Smt. Himgauri Aher-Adke")

    # ── EMERGENCY CONTACTS ────────────────────────────────────
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
            "=== CRITICAL RULES (NEVER BREAK THESE) ===\n"
            "RULE 1 - DATES: If the user message contains a 'VERIFIED FACT FROM PROJECT SCHEDULE', "
            "you MUST use that exact date in your answer. Do NOT override it.\n"
            "RULE 2 - NUMBERS: For crowd counts, budgets, officer counts, and all live metrics — "
            "ONLY use the numbers from the LIVE DATA section. NEVER invent or estimate numbers.\n"
            "RULE 3 - OFFICIALS: For questions about who is CM, Minister, or Mayor — "
            "ONLY use names from the OFFICIALS section below.\n"
            "RULE 4 - GENERAL INTELLIGENCE: If the user asks a different question, a conversational question, "
            "or about any topic (e.g., history, general knowledge, outside facts) not covered by the LIVE DATA below, "
            "you MUST use your own general intelligence and knowledge to provide a highly accurate, logical, and helpful answer.\n"
            "RULE 5 - GREETINGS: For hi/hello/greetings — respond warmly and briefly, offer to help.\n"
            "RULE 6 - FORMAT: Be direct. No preamble. Keep answers under 200 words.\n\n"
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