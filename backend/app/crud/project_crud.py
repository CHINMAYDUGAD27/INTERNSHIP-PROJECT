from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project_schema import ProjectCreate


def create_project(db: Session, project: ProjectCreate):

    new_project = Project(
        project_name=project.project_name,
        department=project.department,
        location=project.location,
        budget=project.budget,
        progress=project.progress,
        status=project.status,
        start_date=project.start_date,
        end_date=project.end_date,
        description=project.description
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project


def get_all_projects(db: Session):
    return db.query(Project).all()


def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()


def update_project(db: Session, project_id: int, project: ProjectCreate):

    db_project = db.query(Project).filter(Project.id == project_id).first()

    if not db_project:
        return None

    db_project.project_name = project.project_name
    db_project.department = project.department
    db_project.location = project.location
    db_project.budget = project.budget
    db_project.progress = project.progress
    db_project.status = project.status
    db_project.start_date = project.start_date
    db_project.end_date = project.end_date
    db_project.description = project.description

    db.commit()
    db.refresh(db_project)

    return db_project


def delete_project(db: Session, project_id: int):

    db_project = db.query(Project).filter(Project.id == project_id).first()

    if not db_project:
        return None

    db.delete(db_project)
    db.commit()

    return {"message": "Project Deleted Successfully"}