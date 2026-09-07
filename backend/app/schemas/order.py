from decimal import Decimal

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]
    currency: str = "INR"


class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_id: int
    status: str
    total_amount: Decimal
    currency: str
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True