# ملف main.py
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
try:
    from .models import CrawlRequest
    from .storage import init_storage, get_trends, get_opportunities
    from .crawler import SmartBrandIntelligence
except ImportError:
    from models import CrawlRequest
    from storage import init_storage, get_trends, get_opportunities
    from crawler import SmartBrandIntelligence
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize storage on startup
init_storage()

app = FastAPI(title="Smart Brand Intelligence API")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "Internal server error", "details": str(exc)}
    )

@app.post("/api/crawl")
async def crawl(request: CrawlRequest, background_tasks: BackgroundTasks):
    try:
        system = SmartBrandIntelligence()
        background_tasks.add_task(run_crawl, system, request.dict())
        return {"status": "started", "message": "Crawling started in background"}
    except Exception as e:
        logger.error(f"Crawl start error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def run_crawl(system, config):
    await system.full_pipeline(config)
    await system.close()

@app.get("/api/trends")
async def trends():
    return get_trends()

@app.get("/api/opportunities")
async def opportunities():
    return get_opportunities()

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.get("/api/export")
async def export():
    trends = get_trends(limit=100)
    opps = get_opportunities(limit=100)
    return {"trends": trends, "opportunities": opps}

import os

# Get the directory of the current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Ensure static directory exists before mounting
if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
else:
    logger.warning(f"Static directory not found at {STATIC_DIR}. Skipping mount.")
