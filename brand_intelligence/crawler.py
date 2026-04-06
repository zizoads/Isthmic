# ملف crawler.py (النسخة المتكاملة الكاملة)
import asyncio
import aiohttp
import json
import os
import re
import random
import uuid
import time
from datetime import datetime
from collections import defaultdict
from typing import List, Dict, Optional, Any
import nltk
from nltk.corpus import stopwords
from bs4 import BeautifulSoup
try:
    from brand_intelligence.storage import (
        init_storage, save_article, save_patent, save_startup, 
        save_trend, save_brand_opportunity, save_session, 
        get_trends, get_opportunities, get_instincts
    )
except ImportError:
    from storage import (
        init_storage, save_article, save_patent, save_startup, 
        save_trend, save_brand_opportunity, save_session, 
        get_trends, get_opportunities, get_instincts
    )

# -------------------- إعداد NLTK --------------------
def setup_nltk():
    nltk_data_dir = os.path.join(os.getcwd(), 'nltk_data')
    os.makedirs(nltk_data_dir, exist_ok=True)
    if nltk_data_dir not in nltk.data.path:
        nltk.data.path.append(nltk_data_dir)
    packages = ['stopwords', 'punkt', 'wordnet']
    for package in packages:
        try:
            nltk.data.find(f'corpora/{package}')
        except LookupError:
            nltk.download(package, download_dir=nltk_data_dir, quiet=True)
    print("✅ NLTK ready")

setup_nltk()

try:
    from brand_intelligence.crawler_base import AdvancedCrawler
    from brand_intelligence.platforms import PatentPlatforms
    from brand_intelligence.agents import DataCollectorAgent, TrendAnalyzerAgent, BrandGeneratorAgent, EvaluatorAgent, LearningLoop, MsgHub
except ImportError:
    from crawler_base import AdvancedCrawler
    from platforms import PatentPlatforms
    from agents import DataCollectorAgent, TrendAnalyzerAgent, BrandGeneratorAgent, EvaluatorAgent, LearningLoop, MsgHub

# -------------------- النظام الرئيسي --------------------
class SmartBrandIntelligence:
    def __init__(self):
        self.crawler = AdvancedCrawler()
        self.data_collector = DataCollectorAgent(self.crawler)
        self.trend_analyzer = TrendAnalyzerAgent()
        self.brand_generator = BrandGeneratorAgent()
        self.evaluator = EvaluatorAgent()
        self.agents = [self.data_collector, self.trend_analyzer, self.brand_generator, self.evaluator]
        self.session_id = None
    async def full_pipeline(self, config: Dict) -> Dict:
        # init_storage() is now called at module level
        self.session_id = str(uuid.uuid4())
        start_time = datetime.now().isoformat()
        save_session(self.session_id, start_time)
        
        config['session_id'] = self.session_id
        
        if config.get('enable_loop', False):
            loop = LearningLoop(
                self.agents, 
                max_iterations=config.get('max_iterations', 3),
                target_score=config.get('target_score', 0.8)
            )
            result = await loop.run(config)
        else:
            hub = MsgHub(self.agents)
            result = await hub.sequential_pipeline(config)
            
        end_time = datetime.now().isoformat()
        stats = {
            'articles_fetched': len(result.get('articles', [])),
            'patents_fetched': len(result.get('patents', [])),
            'startups_fetched': len(result.get('startups', [])),
            'trends_found': len(result.get('trends', [])),
            'opportunities_generated': len(result.get('opportunities', []))
        }
        save_session(self.session_id, start_time, end_time, stats)
        return result
    async def improvement_loop(self, limit: int = 10, iterations: int = 2):
        initial_data = {'limit': limit, 'session_id': self.session_id or str(uuid.uuid4())}
        loop = LearningLoop(self.agents, max_iterations=iterations)
        result = await loop.run(initial_data)
        return result
    async def close(self):
        await self.crawler.close()
