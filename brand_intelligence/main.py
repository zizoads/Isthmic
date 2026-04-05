# ملف main.py
from fastapi import FastAPI, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
from pydantic import BaseModel
import os
from crawler import SmartBrandIntelligence, get_trends, get_opportunities

# Storage initialization is now handled inside SmartBrandIntelligence.full_pipeline
# or can be called explicitly if needed.

app = FastAPI(title="Smart Brand Intelligence API")

class CrawlRequest(BaseModel):
    selected_platforms: Optional[List[str]] = None
    min_keyword_length: int = 5
    min_keyword_frequency: int = 3
    exclude_stopwords: bool = True
    weight_articles: float = 1.0
    weight_patents: float = 2.0
    weight_startups: float = 3.0
    min_trend_score: float = 0.4
    max_trends: int = 15
    brand_name_style: str = "merged"
    max_brands: int = 5
    enable_loop: bool = True
    max_iterations: int = 3
    target_score: float = 0.85
    enable_instincts: bool = True
    min_instinct_confidence: float = 0.7
    limit_per_source: int = 10
    timeout_seconds: int = 45
    retry_attempts: int = 2
    export_format: str = "json"
    include_full_text: bool = False
    max_articles: int = 100

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
