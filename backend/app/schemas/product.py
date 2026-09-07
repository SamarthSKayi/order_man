from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class ProductCreate(BaseModel):
    product_code: str
    name: str
    description: Optional[str] = None
    price: Decimal
    stock_quantity: int


class ProductResponse(BaseModel):
    id: int
    product_code: str
    name: str
    description: Optional[str] = None
    price: Decimal
    stock_quantity: int
    is_active: bool

    class Config:
        from_attributes = True