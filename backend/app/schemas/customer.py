from pydantic import BaseModel, EmailStr
from typing import Optional


class CustomerCreate(BaseModel):
    customer_code: str
    name: str
    email: EmailStr
    phone: Optional[str] = None


class CustomerResponse(BaseModel):
    id: int
    customer_code: str
    name: str
    email: EmailStr
    phone: Optional[str] = None

    class Config:
        from_attributes = True