from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from models import Workspace
router = APIRouter()

class WorkspaceCreate(BaseModel):
    name: str
    password: str

class WorkspaceJoin(BaseModel):
    workspaceId: str
    password: str

@router.post("/join")
async def join_workspace(data: WorkspaceJoin):
    workspace=await Workspace.filter(workspaceId=data.workspaceId, password=data.password).first()

    ##if data.password == "dev@123": 
    if workspace:
        return {
            "result": True,
            "message": "joined successfully"
        }
    else:
        raise HTTPException(status_code=404, detail={
            "result": False,
            "message": "invalid password or workspace not found"
        })
    
@router.post("/new")
async def create_workspace(data: WorkspaceCreate):
    unique_id = f"uuid-{str(uuid.uuid4())[:7]}-xyz"

    await Workspace.create(workspaceId=unique_id, name=data.name, password=data.password)
    
    return {
        "result": True,
        "message": "workspace created successfully",
        "data": {
            "workspaceId": unique_id
        }
    }