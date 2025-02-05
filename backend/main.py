from contextlib import asynccontextmanager

from app.routers.auth_routes import auth_router
from app.routers.customer_routes import router as customer_router
from app.routers.ticket_routes import router as ticket_router
from app.routers.user_routes import user_router
from app.utils.create_superadmin import create_superadmin_if_not_exists
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

version = "v1"
api_prefix = f"/api/{version}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Make sure create_superadmin_if_not_exists is an async function
    await create_superadmin_if_not_exists()
    yield  # Hand control back to the FastAPI app lifecycle


app = FastAPI(
    title="Customer Issues Tracker (CIT)",
    description="A REST API for creating and managing customer tickets",
    version=version,
    lifespan=lifespan,
)


# CORS middleware
origins = ["http://localhost:3000", "https://cit-admin-two.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["x-password-reset"],
)

app.include_router(router=auth_router, prefix=f"{api_prefix}/auth", tags=["auth"])
app.include_router(router=user_router, prefix=f"{api_prefix}", tags=["users"])
app.include_router(router=customer_router, prefix=f"{api_prefix}", tags=["customers"])
app.include_router(router=ticket_router, prefix=f"{api_prefix}", tags=["tickets"])


@app.get("/health")
async def health_check():
    return {"status": "ok"}
