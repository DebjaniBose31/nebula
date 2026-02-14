from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI(title="Nebula API", version="0.1.0")

# In-memory user store (replace with database in production)
users_db: dict[str, dict] = {}


class SignInRequest(BaseModel):
    email: str
    password: str


@app.post("/api/user/login")
def sign_in(request: SignInRequest):
    """Sign in an existing user."""
    # Find user by email
    user = users_db.get(request.email)

    if user is None:
        raise HTTPException(
            status_code=404,
            detail={"result": False, "message": "user not found"},
        )

    if user["password"] != request.password:
        raise HTTPException(
            status_code=401,
            detail={"result": False, "message": "incorrect password"},
        )

    return {"result": True, "message": "login successful"}
