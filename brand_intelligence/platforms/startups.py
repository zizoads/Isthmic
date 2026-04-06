import uuid
import random
from datetime import datetime
from bs4 import BeautifulSoup
from brand_intelligence.platforms.base import parse_startups_html

class StartupPlatforms:
    @staticmethod
    async def fetch_crunchbase(limit):
        return [{
            'id': str(uuid.uuid4()),
            'name': f"Sample Startup {i+1}",
            'description': "A technology startup",
            'url': "https://example.com",
            'platform': "Crunchbase",
            'founded_year': "2023",
            'funding_total': random.uniform(500000, 5000000),
            'investors': "Sample Investors",
            'category': "AI",
            'crawled_at': datetime.now().isoformat(),
            'keywords': []
        } for i in range(min(limit, 3))]

    @staticmethod
    async def fetch_pitchbook(limit):
        return []
    @staticmethod
    async def fetch_tracxn(limit):
        return []
    @staticmethod
    async def fetch_dealroom(limit):
        return []

    @staticmethod
    async def fetch_betalist(limit, crawler):
        url = "https://betalist.com/"
        content = await crawler.fetch_with_retry(url)
        return parse_startups_html(
            content, limit, "BetaList", "https://betalist.com", 
            'div.startup', 'h3 a', 'p'
        )

    @staticmethod
    async def fetch_producthunt(crawler, limit):
        url = "https://www.producthunt.com/feed"
        content = await crawler.fetch_with_retry(url)
        startups = []
        if content:
            try:
                soup = BeautifulSoup(content, 'lxml-xml')
            except Exception:
                soup = BeautifulSoup(content, 'xml')
            for item in soup.find_all('item')[:limit]:
                title = item.find('title').text if item.find('title') else ''
                link = item.find('link').text if item.find('link') else ''
                desc = item.find('description').text if item.find('description') else ''
                startups.append({
                    'id': str(uuid.uuid4()),
                    'name': title,
                    'description': desc,
                    'url': link,
                    'platform': "Product Hunt",
                    'founded_year': '',
                    'funding_total': 0,
                    'investors': '',
                    'category': '',
                    'crawled_at': datetime.now().isoformat(),
                    'keywords': []
                })
        return startups

    @staticmethod
    async def fetch_angellist(limit, crawler):
        url = "https://angel.co/companies"
        content = await crawler.fetch_with_retry(url)
        return parse_startups_html(
            content, limit, "AngelList", "https://angel.co", 
            'div.startup', 'a.startup-link', 'p'
        )

    @staticmethod
    async def fetch_startupbase(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'StartupBase Co', 'description': 'Sample', 'url': 'https://startupbase.com', 'platform': 'StartupBase', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]

    @staticmethod
    async def fetch_launchingnext(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'LaunchingNext Startup', 'description': 'Sample', 'url': 'https://www.launchingnext.com', 'platform': 'Launching Next', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]

    @staticmethod
    async def fetch_saashub(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'SaaSHub Product', 'description': 'Sample', 'url': 'https://www.saashub.com', 'platform': 'SaaSHub', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]

    @staticmethod
    async def fetch_growthlist(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'GrowthList Startup', 'description': 'Sample', 'url': 'https://growthlist.co', 'platform': 'GrowthList', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]
