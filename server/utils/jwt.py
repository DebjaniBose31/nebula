"""
JWT utilities for token generation and verification.
This module provides abstract classes for handling JWT tokens including
access tokens and refresh tokens for authentication purposes.
"""

from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from enum import Enum


class TokenType(Enum):
    """Enum for token types."""
    ACCESS = "access"
    REFRESH = "refresh"


class JWT(ABC):
    """
    Abstract base class for JWT token handling.
    Provides core functionality for encoding, decoding, and verifying JWT tokens.
    """

    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        """
        Initialize JWT handler.

        Args:
            secret_key: Secret key for encoding/decoding tokens
            algorithm: Algorithm to use for encoding (default: HS256)
        """
        self.secret_key = secret_key
        self.algorithm = algorithm

    def encode_token(
        self,
        payload: Dict[str, Any],
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """
        Encode a JWT token.

        Args:
            payload: Data to encode in the token
            expires_delta: Expiration time for the token. If None, token won't expire.

        Returns:
            Encoded JWT token string
        """
        to_encode = payload.copy()

        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(hours=24)

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, self.secret_key, algorithm=self.algorithm
        )
        return encoded_jwt

    def decode_token(self, token: str) -> Dict[str, Any]:
        """
        Decode a JWT token.

        Args:
            token: JWT token string to decode

        Returns:
            Decoded token payload

        Raises:
            jwt.InvalidTokenError: If token is invalid or expired
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.InvalidTokenError as e:
            raise jwt.InvalidTokenError(f"Invalid token: {str(e)}")

    def verify_token(self, token: str) -> bool:
        """
        Verify if a token is valid.

        Args:
            token: JWT token string to verify

        Returns:
            True if token is valid, False otherwise
        """
        try:
            self.decode_token(token)
            return True
        except jwt.InvalidTokenError:
            return False

    @abstractmethod
    def get_token_type(self) -> TokenType:
        """
        Get the type of token this handler manages.

        Returns:
            TokenType enum value
        """
        pass


class AccessToken(JWT):
    """
    Abstract class for access token handling.
    Access tokens are short-lived tokens used for API authentication.
    """

    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        expiration_minutes: int = 30,
    ):
        """
        Initialize AccessToken handler.

        Args:
            secret_key: Secret key for encoding/decoding tokens
            algorithm: Algorithm to use for encoding (default: HS256)
            expiration_minutes: Access token expiration time in minutes (default: 30)
        """
        super().__init__(secret_key, algorithm)
        self.expiration_minutes = expiration_minutes

    def generate_access_token(self, user_id: str, additional_claims: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate an access token.

        Args:
            user_id: User identifier to include in token
            additional_claims: Additional claims to include in token payload

        Returns:
            Encoded access token string
        """
        payload = {
            "sub": user_id,
            "type": TokenType.ACCESS.value,
        }

        if additional_claims:
            payload.update(additional_claims)

        expires_delta = timedelta(minutes=self.expiration_minutes)
        return self.encode_token(payload, expires_delta)

    def verify_access_token(self, token: str) -> bool:
        """
        Verify if an access token is valid and has correct type.

        Args:
            token: Access token string to verify

        Returns:
            True if token is valid and is an access token, False otherwise
        """
        try:
            payload = self.decode_token(token)
            return payload.get("type") == TokenType.ACCESS.value
        except jwt.InvalidTokenError:
            return False

    def get_user_id_from_token(self, token: str) -> Optional[str]:
        """
        Extract user ID from access token.

        Args:
            token: Access token string

        Returns:
            User ID if token is valid, None otherwise
        """
        try:
            payload = self.decode_token(token)
            if payload.get("type") == TokenType.ACCESS.value:
                return payload.get("sub")
            return None
        except jwt.InvalidTokenError:
            return None

    def get_token_type(self) -> TokenType:
        """Get the token type."""
        return TokenType.ACCESS

    @abstractmethod
    def validate_access_token(self, token: str) -> bool:
        """
        Custom validation logic for access tokens.
        Implement this method in concrete classes.

        Args:
            token: Access token to validate

        Returns:
            True if valid, False otherwise
        """
        pass


class RefreshToken(JWT):
    """
    Abstract class for refresh token handling.
    Refresh tokens are long-lived tokens used to generate new access tokens.
    """

    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        expiration_days: int = 7,
    ):
        """
        Initialize RefreshToken handler.

        Args:
            secret_key: Secret key for encoding/decoding tokens
            algorithm: Algorithm to use for encoding (default: HS256)
            expiration_days: Refresh token expiration time in days (default: 7)
        """
        super().__init__(secret_key, algorithm)
        self.expiration_days = expiration_days

    def generate_refresh_token(self, user_id: str, additional_claims: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate a refresh token.

        Args:
            user_id: User identifier to include in token
            additional_claims: Additional claims to include in token payload

        Returns:
            Encoded refresh token string
        """
        payload = {
            "sub": user_id,
            "type": TokenType.REFRESH.value,
        }

        if additional_claims:
            payload.update(additional_claims)

        expires_delta = timedelta(days=self.expiration_days)
        return self.encode_token(payload, expires_delta)

    def verify_refresh_token(self, token: str) -> bool:
        """
        Verify if a refresh token is valid and has correct type.

        Args:
            token: Refresh token string to verify

        Returns:
            True if token is valid and is a refresh token, False otherwise
        """
        try:
            payload = self.decode_token(token)
            return payload.get("type") == TokenType.REFRESH.value
        except jwt.InvalidTokenError:
            return False

    def get_user_id_from_token(self, token: str) -> Optional[str]:
        """
        Extract user ID from refresh token.

        Args:
            token: Refresh token string

        Returns:
            User ID if token is valid, None otherwise
        """
        try:
            payload = self.decode_token(token)
            if payload.get("type") == TokenType.REFRESH.value:
                return payload.get("sub")
            return None
        except jwt.InvalidTokenError:
            return None

    def get_token_type(self) -> TokenType:
        """Get the token type."""
        return TokenType.REFRESH

    @abstractmethod
    def generate_new_access_token(self, refresh_token: str, access_token_class: AccessToken) -> Optional[str]:
        """
        Generate a new access token using this refresh token.
        Implement this method in concrete classes.

        Args:
            refresh_token: Valid refresh token
            access_token_class: AccessToken instance to generate new access token

        Returns:
            New access token if refresh token is valid, None otherwise
        """
        pass


class JWTManager:
    """
    Concrete implementation of JWT token management.
    Handles both access and refresh tokens for authentication.
    """

    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        """
        Initialize JWT Manager.

        Args:
            secret_key: Secret key for encoding/decoding tokens
            algorithm: Algorithm to use for encoding (default: HS256)
        """
        self._access_token = ConcreteAccessToken(secret_key, algorithm)
        self._refresh_token = ConcreteRefreshToken(secret_key, algorithm)

    @property
    def access_token(self) -> AccessToken:
        """Get access token handler."""
        return self._access_token

    @property
    def refresh_token(self) -> RefreshToken:
        """Get refresh token handler."""
        return self._refresh_token

    def generate_token_pair(self, user_id: str) -> Dict[str, str]:
        """
        Generate both access and refresh tokens.

        Args:
            user_id: User identifier

        Returns:
            Dictionary with 'access_token' and 'refresh_token' keys
        """
        return {
            "access_token": self._access_token.generate_access_token(user_id),
            "refresh_token": self._refresh_token.generate_refresh_token(user_id),
        }

    def refresh_access_token(self, refresh_token_str: str) -> Optional[str]:
        """
        Generate new access token using refresh token.

        Args:
            refresh_token_str: Valid refresh token

        Returns:
            New access token if refresh token is valid, None otherwise
        """
        return self._refresh_token.generate_new_access_token(
            refresh_token_str, self._access_token
        )


class ConcreteAccessToken(AccessToken):
    """Concrete implementation of AccessToken."""

    def validate_access_token(self, token: str) -> bool:
        """Validate access token with custom logic."""
        return self.verify_access_token(token)


class ConcreteRefreshToken(RefreshToken):
    """Concrete implementation of RefreshToken."""

    def generate_new_access_token(
        self, refresh_token: str, access_token_class: AccessToken
    ) -> Optional[str]:
        """Generate new access token using refresh token."""
        user_id = self.get_user_id_from_token(refresh_token)
        if user_id and self.verify_refresh_token(refresh_token):
            return access_token_class.generate_access_token(user_id)
        return None
