from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
import jwt
import os

SIGNING_KEY= os.getenv("JWT_SIGNING_KEY")
JWT_ALGORITHM= os.getenv("JWT_ALGORITHM","HS256")
if not SIGNING_KEY:
    raise ValueError("JWT_SIGNING_KEY is not set")
class JWT(ABC):
    @abstractmethod
    def generate(self,data:dict,expires_delta:timedelta)->str:
        #create a new token
        pass
    @abstractmethod
    def verify(self,token:str)->dict:
        #if a token is valid and return
        pass

class Access_Token(JWT):
    def generate(self,data:dict,expires_delta:timedelta= timedelta(minutes=15)) ->str:
        to_encode=data.copy()
        expire=datetime.now(timezone.utc)+expires_delta
        to_encode.update({"exp":expire,"type":"access"})
        return jwt.encode(to_encode, SIGNING_KEY, algorithm=JWT_ALGORITHM)
    def verify(self,token:str)->dict:
        try:
            payload=jwt.decode(token, SIGNING_KEY, algorithms=[JWT_ALGORITHM])
            if payload.get("type") !="access":
                raise ValueError("Invalid token type")
            return payload
        except (jwt.PyJWTError,ValueError):
            return {}

class Refresh_Token(JWT):
    def generate(self,data:dict,expires_delta:timedelta=timedelta(days=7)) ->str:
        to_encode=data.copy()
        expire=datetime.now(timezone.utc)+expires_delta
        to_encode.update({"exp":expire,"type":"refresh"})
        return jwt.encode(to_encode, SIGNING_KEY, algorithm=JWT_ALGORITHM)
    def verify(self,token:str)->dict:
        try:
            payload=jwt.decode(token, SIGNING_KEY, algorithms=[JWT_ALGORITHM])
            if payload.get("type") !="refresh":
                raise ValueError("Invalid token type")
            return payload
        except (jwt.PyJWTError,ValueError):
            return {}