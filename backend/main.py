from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth_routes import auth_router
from app.routers.customer_routes import router as customer_router
from app.routers.ticket_routes import router as ticket_router

version = "v1"
api_prefix = f"/api/{version}"

app = FastAPI(
    title="Customer Issues Tracker (CIT)",
    description="A REST API for creating and managing customer tickets",
    version=version,
)

# CORS middleware
origins = [
    "http://localhost:3000",
    "https://cit-admin-two.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=auth_router, prefix=f"{api_prefix}/auth", tags=["auth"])
app.include_router(router=customer_router, prefix=f"{api_prefix}", tags=["customers"])
app.include_router(router=ticket_router, prefix=f"{api_prefix}", tags=["tickets"])


@app.get("/health")
async def health_check():
    return {"status": "ok"}
