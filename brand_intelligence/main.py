# ملف main.py
from fastapi import FastAPI, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from .models import CrawlRequest
from .storage import init_storage, get_trends, get_opportunities
from .crawler import SmartBrandIntelligence
from typing import List, Optional

# Initialize storage on startup
init_storage()

app = FastAPI(title="Smart Brand Intelligence API")

@app.post("/api/crawl")
async def crawl(request: CrawlRequest, background_tasks: BackgroundTasks):
    system = SmartBrandIntelligence()
    background_tasks.add_task(run_crawl, system, request.dict())
    return {"status": "started", "message": "Crawling started in background"}

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

app.mount("/", StaticFiles(directory="static", html=True), name="static")
