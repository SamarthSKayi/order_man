from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse
from app.models.order_status_history import OrderStatusHistory
from app.schemas.order_status import OrderStatusUpdate
import uuid



router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)



@router.post(
    "/",
    response_model=OrderResponse,
    status_code=201
)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    # 1. Check customer
    customer = (
        db.query(Customer)
        .filter(Customer.id == order_data.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # 2. Validate that order contains items
    if not order_data.items:
        raise HTTPException(
            status_code=400,
            detail="Order must contain at least one item"
        )

    total_amount = Decimal("0")
    order_items = []

    # 3. Validate products and calculate total
    for item in order_data.items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        if not product.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Product {item.product_id} is inactive"
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for product {item.product_id}"
            )

        subtotal = product.price * item.quantity

        total_amount += subtotal

        order_items.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": product.price,
            "subtotal": subtotal
        })

    # 4. Generate order number
    order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"

    new_order = Order(
    order_number=order_number,
    customer_id=order_data.customer_id,
    status="PENDING",
    total_amount=total_amount,
    currency=order_data.currency
)   

    db.add(new_order)
    db.flush()

   

    status_history = OrderStatusHistory(
    order_id=new_order.id,
    old_status=None,
    new_status="PENDING"
)

    db.add(status_history)

    # 6. Create order items + reduce stock
    for item in order_items:

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item["product"].id,
            quantity=item["quantity"],
            unit_price=item["unit_price"],
            subtotal=item["subtotal"]
        )

        db.add(order_item)

        item["product"].stock_quantity -= item["quantity"]

    # 7. Commit everything
    try:
        for item in order_items:

            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item["product"].id,
                quantity=item["quantity"],
                unit_price=item["unit_price"],
                subtotal=item["subtotal"]
            )

        db.add(order_item)

        item["product"].stock_quantity -= item["quantity"]

        db.commit()

    except Exception:
        db.rollback()
        raise

    db.refresh(new_order)

    return new_order

@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order

@router.get(
    "/",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()

@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse
)
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    allowed_transitions = {
        "PENDING": ["CONFIRMED", "CANCELLED"],
        "CONFIRMED": ["PROCESSING", "CANCELLED"],
        "PROCESSING": ["SHIPPED"],
        "SHIPPED": ["DELIVERED"],
        "DELIVERED": [],
        "CANCELLED": []
    }

    current_status = order.status
    new_status = status_data.status.upper()

    if new_status not in allowed_transitions.get(current_status, []):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from {current_status} to {new_status}"
        )

    try:
        history = OrderStatusHistory(
            order_id=order.id,
            old_status=current_status,
            new_status=new_status
        )

        order.status = new_status

        db.add(history)
        db.commit()
        db.refresh(order)

    except Exception:
        db.rollback()
        raise

    return order