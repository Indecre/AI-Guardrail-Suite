from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import faircheck, aligncheck, agentic

app = FastAPI(title="AI Guardrails API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(faircheck.router, prefix="/faircheck", tags=["faircheck"])
app.include_router(aligncheck.router, prefix="/aligncheck", tags=["aligncheck"])
app.include_router(agentic.router, prefix="/agentic", tags=["agentic"])


@app.get("/health")
def health():
    return {"status": "ok"}
