from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    product_code = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    name = Column(
        String(150),
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    price = Column(
        Numeric(10, 2),
        nullable=False
    )

    stock_quantity = Column(
        Integer,
        nullable=False,
        default=0
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )