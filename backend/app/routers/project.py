from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.project_schema import ProjectCreate
from app.crud.project_crud import (
    create_project,
    get_all_projects,
    get_project,
    update_project,
    delete_project
)

router = APIRouter(
    prefix="/projects",
    tags=["Project Planning"]
)


@router.post("/")
def add_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return create_project(db, project)


@router.get("/")
def view_projects(db: Session = Depends(get_db)):
    return get_all_projects(db)


@router.get("/{project_id}")
def view_project(project_id: int, db: Session = Depends(get_db)):

    project = get_project(db, project_id)

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project Not Found"
        )

    return project


@router.put("/{project_id}")
def edit_project(
    project_id: int,
    project: ProjectCreate,
    db: Session = Depends(get_db)
):

    updated = update_project(db, project_id, project)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Project Not Found"
        )

    return updated


@router.delete("/{project_id}")
def remove_project(
    project_id: int,
    db: Session = Depends(get_db)
):

    deleted = delete_project(db, project_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Project Not Found"
        )

    return deleted