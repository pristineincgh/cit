from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db.database import engine, init_db
from app.features.auth import auth_routes
from app.features.customers import customer_routes
from app.features.tickets import ticket_routes
from app.utils.api_exceptions import register_all_errors
from app.utils.middleware import register_middleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server Started")
    init_db()

    yield
    engine.dispose()


version = "v1"

app = FastAPI(
    title="Customer Issues Tracker (CIT)",
    description="A REST API for creating and managing customer tickets",
    version=version,
)

register_all_errors(app)
register_middleware(app)


app.include_router(auth_routes.router, prefix=f"/api/{version}/auth", tags=["auth"])
app.include_router(
    customer_routes.router, prefix=f"/api/{version}/customers", tags=["customers"]
)
app.include_router(
    ticket_routes.router, prefix=f"/api/{version}/tickets", tags=["tickets"]
)
