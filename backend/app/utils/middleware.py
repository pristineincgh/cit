import logging
import time

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger("uvicorn.access")
logger.disabled = True


def register_middleware(app: FastAPI):
    # CORS middleware
    origins = [
        "http://localhost:3000",  # Your frontend application
        # Add other origins if needed
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def custom_logging(request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)
        process_time = time.time() - start_time

        message = f"{request.client.host}:{request.client.port} - {request.method} - {request.url.path} - {response.status_code} completed after {process_time}s"

        print(message)

        return response

    @app.middleware("http")
    async def check_authorization_header(request: Request, call_next):
        login_path = "/api/v1/auth/login"

        if request.url.path != login_path and "Authorization" not in request.headers:
            return JSONResponse(
                content={
                    "error": {
                        "code": "AUTHENTICATION_FAILED",
                        "message": "Authorization header is missing.",
                    },
                    "details": {
                        "resolution": "Include a valid token in the 'Authorization' header to access this resource.",
                        "example": {"header": "Authorization: Bearer <your-token>"},
                    },
                },
                status_code=401,  # HTTP status for unauthorized access
            )

        response = await call_next(request)

        return response
