import asyncio
from typing import Dict
from .base import BaseAgent
from storage import save_article, save_patent, save_startup
from crawler_base import AdvancedCrawler
from platforms import PatentPlatforms, StartupPlatforms

class DataCollectorAgent(BaseAgent):
    def __init__(self, crawler: AdvancedCrawler):
        super().__init__("DataCollector")
        self.crawler = crawler
    async def process(self, input_data: Dict) -> Dict:
        limit = input_data.get('limit_per_source', input_data.get('limit', 10))
        selected_platforms = input_data.get('selected_platforms', None)
        timeout = input_data.get('timeout_seconds', 30)
        retries = input_data.get('retry_attempts', 3)
        
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
            ("Crunchbase", StartupPlatforms.fetch_crunchbase),
            ("BetaList", lambda l: StartupPlatforms.fetch_betalist(l, self.crawler)),
            ("Product Hunt", lambda l: StartupPlatforms.fetch_producthunt(self.crawler, l)),
            ("AngelList", lambda l: StartupPlatforms.fetch_angellist(l, self.crawler)),
            ("StartupBase", StartupPlatforms.fetch_startupbase),
            ("Launching Next", StartupPlatforms.fetch_launchingnext),
            ("SaaSHub", StartupPlatforms.fetch_saashub),
            ("GrowthList", StartupPlatforms.fetch_growthlist)
        ]
        
        for name, fetcher in startup_sources:
            if selected_platforms and name not in selected_platforms:
                continue
            if asyncio.iscoroutinefunction(fetcher) or hasattr(fetcher, '__name__') and fetcher.__name__ == '<lambda>':
                res = await fetcher(limit)
            else:
                res = fetcher(limit)
            startups.extend(res)
            for s in res:
                save_startup(s)
                
        return {'articles': articles, 'patents': patents, 'startups': startups}
