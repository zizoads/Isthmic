from bs4 import BeautifulSoup
import uuid
from datetime import datetime
from brand_intelligence.crawler_base import AdvancedCrawler

async def fetch_producthunt(limit):
    crawler = AdvancedCrawler()
    url = "https://www.producthunt.com/feed"
    content = await crawler.fetch_with_retry(url)
    await crawler.close()
    
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
