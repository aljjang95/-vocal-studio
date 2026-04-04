from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.evaluate import router as evaluate_router

app = FastAPI(title="VocalMind AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(evaluate_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
