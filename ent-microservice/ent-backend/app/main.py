from fastapi import FastAPI, Depends
# from app.auth import get_current_user, oauth2_scheme
# from app.cassandra_db import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.models import User
import os
from app.api.deps import get_current_user
app = FastAPI()


# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8000",  # Add Keycloak callback
        "http://localhost:8001",
        "http://localhost:8002",
        "http://localhost:8003",

        "http://127.0.0.1:8000",  # Add Keycloak callback
        "http://127.0.0.1:8001", # Ensure FastAPI itself # Ensure FastAPI itself
        "http://127.0.0.1:8002",
        "http://127.0.0.1:8003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        

        "http://192.168.1.30:3000",
        "http://192.168.1.30:3001",
        "http://192.168.1.30:8000",  # Add Keycloak callback
        "http://192.168.1.30:8001",
        "http://192.168.1.30:8002",
        "http://192.168.1.30:8003" 

        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


@app.get("/userinfo")
async def read_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/public")
async def public_info():
    return {"message": "Public information available to all users"}
@app.get("/")
async def root():
    return {"message": "EST Salé ENT API"}