from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from utils.jwt import JWTManager
from typing import Optional

# Initialize FastAPI app
app = FastAPI()

# Initialize JWT Manager with your secret key
SECRET_KEY = "your-secret-key-here"  # In production, load from environment variables
jwt_manager = JWTManager(secret_key=SECRET_KEY)

# Setup security scheme
security = HTTPBearer()


# Example route for user login (generates token pair)
@app.post("/auth/login")
async def login(user_id: str):
    """
    Login endpoint that generates access and refresh tokens.

    Args:
        user_id: User identifier

    Returns:
        Token pair with access and refresh tokens
    """
    tokens = jwt_manager.generate_token_pair(user_id)
    return {
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
        "token_type": "bearer",
    }


# Dependency for getting current user from access token
async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    """
    Dependency to validate access token and extract user ID.

    Args:
        credentials: HTTP Bearer credentials from request

    Returns:
        User ID from token

    Raises:
        HTTPException: If token is invalid
    """
    token = credentials.credentials
    user_id = jwt_manager.access_token.get_user_id_from_token(token)

    if user_id is None or not jwt_manager.access_token.validate_access_token(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id


# Example protected route
@app.get("/api/profile")
async def get_profile(current_user: str = Depends(get_current_user)):
    """
    Protected endpoint that requires valid access token.

    Args:
        current_user: Current user ID from dependency

    Returns:
        User profile information
    """
    return {
        "user_id": current_user,
        "message": "This is a protected endpoint",
    }


# Example route for refreshing access token
@app.post("/auth/refresh")
async def refresh_access_token(refresh_token: str):
    """
    Refresh endpoint to generate new access token using refresh token.

    Args:
        refresh_token: Valid refresh token

    Returns:
        New access token

    Raises:
        HTTPException: If refresh token is invalid
    """
    new_access_token = jwt_manager.refresh_access_token(refresh_token)

    if new_access_token is None:  # gitleaks:allow
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    return {
        "access_token": new_access_token,
        "token_type": "bearer",
    }


# Example route for logout (in production, add token to blacklist)
@app.post("/auth/logout")
async def logout(current_user: str = Depends(get_current_user)):
    """
    Logout endpoint. In production, add token to a blacklist/database.

    Args:
        current_user: Current user ID from dependency

    Returns:
        Logout confirmation message
    """
    return {
        "message": f"User {current_user} logged out successfully",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
