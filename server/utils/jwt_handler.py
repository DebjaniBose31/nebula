from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
import jwt
import os


PRIVATE_KEY = os.getenv("JWT_PRIVATE_KEY")

PUBLIC_KEY = os.getenv("JWT_PUBLIC_KEY")


JWT_ALGORITHM = "RS256"

if not PRIVATE_KEY or not PUBLIC_KEY:
    raise ValueError("JWT RSA Keys are not properly set")

class JWT(ABC):
    @abstractmethod
    def generate(self, data: dict, expires_delta: timedelta) -> str:
        # Create a new token
        pass

    @abstractmethod
    def verify(self, token: str) -> dict:
        # If a token is valid, return it
        pass

class Access_Token(JWT):
    def generate(self, data: dict, expires_delta: timedelta = timedelta(minutes=15)) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode.update({"exp": expire, "type": "access"})
        
        # SIGN using the PRIVATE_KEY
        return jwt.encode(to_encode, PRIVATE_KEY, algorithm=JWT_ALGORITHM)

    def verify(self, token: str) -> dict:
        try:
            # VERIFY using the PUBLIC_KEY
            payload = jwt.decode(token, PUBLIC_KEY, algorithms=[JWT_ALGORITHM])
            if payload.get("type") != "access":
                raise ValueError("Invalid token type")
            return payload
        except (jwt.PyJWTError, ValueError):
            return {}

class Refresh_Token(JWT):
    def generate(self, data: dict, expires_delta: timedelta = timedelta(days=7)) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta
        to_encode.update({"exp": expire, "type": "refresh"})
        
        # SIGN using the PRIVATE_KEY
        return jwt.encode(to_encode, PRIVATE_KEY, algorithm=JWT_ALGORITHM)

    def verify(self, token: str) -> dict:
        try:
            # VERIFY using the PUBLIC_KEY
            payload = jwt.decode(token, PUBLIC_KEY, algorithms=[JWT_ALGORITHM])
            if payload.get("type") != "refresh":
                raise ValueError("Invalid token type")
            return payload
        except (jwt.PyJWTError, ValueError):
            return {}