from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
from routes.generate import router as generate_router

app = FastAPI(title="Bouquet Builder API", version="1.0.0")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the Next.js dev server (and any local origin) to call this API.
# Tighten origins in production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static files ──────────────────────────────────────────────────────────────
# Flower images live in server/assets/flowers/
# They are served at:  GET /assets/flowers/<filename>
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(generate_router, prefix="/api")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}