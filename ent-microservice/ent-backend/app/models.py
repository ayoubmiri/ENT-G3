from pydantic import BaseModel, EmailStr
from typing import List, Optional

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    roles: Optional[List[str]] = []

class UserIn(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    roles: Optional[List[str]] = []

class UserDB(UserIn):
    id: str
