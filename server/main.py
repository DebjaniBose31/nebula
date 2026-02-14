from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Nebula API", version="0.1.0")

# In-memory user store (replace with database in production)
users_db: dict[str, dict] = {}


class SignUpRequest(BaseModel):
    firstname: str
    lastname: str
    email: str
    username: str
    password: str


@app.post("/api/user/register")
def sign_up(request: SignUpRequest):
    """Register a new user."""
    if request.email in users_db:
        raise HTTPException(
            status_code=409,
            detail={"result": False, "message": "an user already exist in this email"},
        )

    users_db[request.email] = {
        "firstname": request.firstname,
        "lastname": request.lastname,
        "email": request.email,
        "username": request.username,
        "password": request.password,
    }

    return {"result": True, "message": "successfully registered"}
