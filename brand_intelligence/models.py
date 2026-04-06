from typing import List, Dict, Optional
from pydantic import BaseModel

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
