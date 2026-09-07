from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False
    )

    old_status = Column(
        String(30),
        nullable=True
    )

    new_status = Column(
        String(30),
        nullable=False
    )

    changed_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    