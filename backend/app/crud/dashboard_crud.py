from sqlalchemy.orm import Session

from app.models.dashboard import Dashboard


def get_dashboard(db: Session):

    dashboard = db.query(Dashboard).first()

    if dashboard is None:

        dashboard = Dashboard(
            total_projects=125,
            completed_projects=48,
            ongoing_projects=77,
            total_budget=250000000,
            budget_used=95000000,
            total_devotees=12000000,
            police_personnel=18000,
            medical_camps=240,
            ambulances=320,
            buses=850,
            parking_spaces=50000
        )

        db.add(dashboard)
        db.commit()
        db.refresh(dashboard)

    return dashboard