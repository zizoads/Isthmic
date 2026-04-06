import asyncio
from typing import Dict
from .base import BaseAgent
from brand_intelligence.storage import save_article, save_patent, save_startup
from brand_intelligence.crawler_base import AdvancedCrawler
from brand_intelligence.platforms import PatentPlatforms
from brand_intelligence.platforms.startups import (
    fetch_crunchbase, fetch_betalist, fetch_producthunt, fetch_angellist,
    fetch_startupbase, fetch_launchingnext, fetch_saashub, fetch_growthlist
)

class DataCollectorAgent(BaseAgent):
    def __init__(self, crawler: AdvancedCrawler):
        super().__init__("DataCollector")
        self.crawler = crawler
    async def process(self, input_data: Dict) -> Dict:
        limit = input_data.get('limit_per_source', input_data.get('limit', 10))
        selected_platforms = input_data.get('selected_platforms', None)
        
        articles = []
        tech_platforms = [
            ("TechCrunch", "https://techcrunch.com/feed/"),
            ("The Verge", "https://www.theverge.com/rss/index.xml"),
            ("Engadget", "https://www.engadget.com/rss.xml"),
            ("TechRadar", "https://www.techradar.com/rss"),
            ("GeekWire", "https://www.geekwire.com/feed/"),
            ("CNET", "https://www.cnet.com/rss/news/"),
            ("Mashable", "https://mashable.com/feeds/rss/all"),
            ("Gizmodo", "https://gizmodo.com/rss"),
            ("Lifewire", "https://www.lifewire.com/rss")
        ]
        
        for name, url in tech_platforms:
            if selected_platforms and name not in selected_platforms:
                continue
            arts = await self.crawler.fetch_platform_rss(name, url, limit)
            articles.extend(arts)
            for a in arts:
                save_article(a)
        
        patents = []
        if not selected_platforms or "PatentsView" in selected_platforms:
            patents.extend(await PatentPlatforms.fetch_patentsview(limit, self.crawler))
            for p in patents:
                save_patent(p)
        
        startups = []
        startup_sources = [
            ("Crunchbase", fetch_crunchbase),
            ("BetaList", fetch_betalist),
            ("Product Hunt", fetch_producthunt),
            ("AngelList", fetch_angellist),
            ("StartupBase", fetch_startupbase),
            ("Launching Next", fetch_launchingnext),
            ("SaaSHub", fetch_saashub),
            ("GrowthList", fetch_growthlist)
        ]
        
        for name, fetcher in startup_sources:
            if selected_platforms and name not in selected_platforms:
                continue
            res = await fetcher(limit)
            startups.extend(res)
            for s in res:
                save_startup(s)
                
        return {'articles': articles, 'patents': patents, 'startups': startups}
