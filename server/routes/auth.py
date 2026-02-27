from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from passlib.context import CryptContext
from models import User

router = APIRouter()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class RegisterUser(BaseModel):
    firstname: str
    lastname: str
    email: str
    username: str
    password: str

@router.post("/api/user/register")
async def register(user: RegisterUser):

    existing_user = await User.filter(email=user.email).first()

    if existing_user:
        return JSONResponse(
            status_code=409,
            content={
                "result":False,
                "message":"an user already exist in this email"
            }
        )

    hashed_password = pwd_context.hash(user.password)

    await User.create(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        username=user.username,
        password=hashed_password
    )

    return {
        "result": True,
        "message": "Successfully registered"
    }