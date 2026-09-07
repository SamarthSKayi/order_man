from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func

from app.database import Base

from sqlalchemy.orm import relationship


class Order(Base):
    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    status = Column(
        String(30),
        nullable=False,
        default="PENDING"
    )

    total_amount = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    currency = Column(
        String(3),
        nullable=False,
        default="INR"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    items = relationship(
    "OrderItem",
    backref="order",
    cascade="all, delete-orphan"
    )