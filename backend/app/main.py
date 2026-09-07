from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine,Base
from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_status_history import OrderStatusHistory

from app.routes.customer import router as customer_router
from app.routes.product import router as product_router
from app.routes.order import router as order_router

app = FastAPI(
    title="Enterprise Order Management API",
    version="1.0.0"
)



Base.metadata.create_all(bind=engine)

app.include_router(customer_router)
app.include_router(product_router)
app.include_router(order_router)

@app.get("/")
def root():
    return {
        "message": "Enterprise Order Management API is running"
    }


@app.get("/health")
def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "UP",
            "database": "Connected"
        }

    except Exception as e:
        return {
            "status": "DOWN",
            "database": "Not connected",
            "error": str(e)
        }