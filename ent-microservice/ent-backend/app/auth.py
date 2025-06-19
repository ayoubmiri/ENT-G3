# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2AuthorizationCodeBearer
# from jose import jwt, JWTError
# from jose.utils import base64url_decode
# from cryptography.hazmat.primitives.asymmetric import rsa
# from cryptography.hazmat.backends import default_backend
# from cryptography.hazmat.primitives import serialization
# import httpx
# import time
# import os
# from uuid import uuid4

# from app.models import User, UserIn, UserDB
# from app.cassandra_db import get_user_by_id, insert_user

# router = APIRouter()

# KEYCLOAK_SERVER_URL = os.getenv("KEYCLOAK_SERVER_URL", "http://keycloak:8080")
# KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "ent-realm")
# KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "ent-client")

# KEYCLOAK_JWKS_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs"
# KEYCLOAK_TOKEN_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"
# KEYCLOAK_AUTH_URL = f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/auth"

# oauth2_scheme = OAuth2AuthorizationCodeBearer(
#     authorizationUrl=KEYCLOAK_AUTH_URL,
#     tokenUrl=KEYCLOAK_TOKEN_URL,
# )

# CACHE_EXPIRATION_TIME = 3600
# jwks_cache = None

# async def get_jwks():
#     global jwks_cache
#     if jwks_cache is None or time.time() - jwks_cache['timestamp'] > CACHE_EXPIRATION_TIME:
#         async with httpx.AsyncClient() as client:
#             response = await client.get(KEYCLOAK_JWKS_URL)
#             response.raise_for_status()
#             jwks_cache = {
#                 "keys": response.json(),
#                 "timestamp": time.time()
#             }
#     return jwks_cache["keys"]

# def construct_rsa_public_key(jwk):
#     e = int.from_bytes(base64url_decode(jwk["e"]), "big")
#     n = int.from_bytes(base64url_decode(jwk["n"]), "big")
#     public_numbers = rsa.RSAPublicNumbers(e, n)
#     key = public_numbers.public_key(default_backend())
#     return key.public_bytes(
#         encoding=serialization.Encoding.PEM,
#         format=serialization.PublicFormat.SubjectPublicKeyInfo
#     )

# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         jwks = await get_jwks()
#         public_key_pem = construct_rsa_public_key(jwks["keys"][0])

#         payload = jwt.decode(
#             token,
#             public_key_pem,
#             algorithms=["RS256"],
#             audience=KEYCLOAK_CLIENT_ID,
#             options={"verify_aud": True}
#         )

#         user_id = payload.get("sub")
#         if not user_id:
#             raise HTTPException(status_code=401, detail="No user id in token")

#         # Fetch userinfo from Keycloak Userinfo endpoint
#         async with httpx.AsyncClient() as client:
#             headers = {"Authorization": f"Bearer {token}"}
#             userinfo_response = await client.get(
#                 f"{KEYCLOAK_SERVER_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/userinfo",
#                 headers=headers
#             )
#             userinfo_response.raise_for_status()
#             user_data = userinfo_response.json()

#         # Check if user exists in Cassandra, insert if not
#         existing_user = get_user_by_id(user_id)
#         if not existing_user:
#             user = User(
#                 id=user_id,
#                 username=user_data.get("preferred_username"),
#                 email=user_data.get("email"),
#                 first_name=user_data.get("given_name"),
#                 last_name=user_data.get("family_name"),
#                 roles=payload.get("realm_access", {}).get("roles", [])
#             )
#             insert_user(user)

#         return User(
#             id=user_id,
#             username=user_data.get("preferred_username"),
#             email=user_data.get("email"),
#             first_name=user_data.get("given_name"),
#             last_name=user_data.get("family_name"),
#             roles=payload.get("realm_access", {}).get("roles", [])
#         )

#     except JWTError as e:
#         raise HTTPException(status_code=401, detail=f"Token decode error: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# # New registration endpoint
# @router.post("/register", status_code=status.HTTP_201_CREATED)
# def register(user_in: UserIn):
#     # Create unique ID for user
#     user_id = str(uuid4())

#     # Construct full user data object
#     user_db = UserDB(**user_in.dict(), id=user_id)

#     # Check if user already exists by username or email — you can add your logic here if needed

#     # Insert new user in Cassandra
#     insert_user(user_db)

#     return {"message": "User registered successfully", "user_id": user_id, "username": user_db.username}
