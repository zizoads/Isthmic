import aiohttp
import random
import asyncio
from bs4 import BeautifulSoup
import uuid
import json
from datetime import datetime

class AdvancedCrawler:
    def __init__(self, max_retries=3):
        self.session = None
        self.max_retries = max_retries

    async def init_session(self):
        if not self.session:
            self.session = aiohttp.ClientSession(headers=self._headers())

    def _headers(self):
        return {
            'User-Agent': random.choice([
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
            ]),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
        }

    async def fetch_with_retry(self, url, timeout=30, retries=None):
        await self.init_session()
        max_retries = retries if retries is not None else self.max_retries
        for attempt in range(max_retries):
            try:
                async with self.session.get(url, timeout=timeout) as resp:
                    if resp.status == 200:
                        return await resp.text()
                    else:
                        print(f"HTTP {resp.status} from {url}, attempt {attempt+1}")
            except Exception as e:
                print(f"Error fetching {url}: {e}, attempt {attempt+1}")
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
        return None

    async def fetch_platform_rss(self, name, url, limit):
        articles = []
        content = await self.fetch_with_retry(url)
        if not content:
            return articles
        try:
            soup = BeautifulSoup(content, 'lxml-xml')
        except Exception:
            soup = BeautifulSoup(content, 'xml')
        for item in soup.find_all('item')[:limit]:
            title = item.find('title').text if item.find('title') else ''
            link = item.find('link').text if item.find('link') else ''
            pub_date = item.find('pubDate').text if item.find('pubDate') else ''
            desc = item.find('description').text if item.find('description') else ''
            articles.append({
                'id': str(uuid.uuid4()),
                'title': title,
                'content': desc,
                'url': link,
                'platform': name,
                'published_at': pub_date,
                'crawled_at': datetime.now().isoformat(),
                'sentiment': 0.0,
                'keywords': [],
                'metadata': {}
            })
        return articles

    async def fetch_patents_patentsview(self, limit):
        patents = []
        url = f"https://api.patentsview.org/patents/query?q=*&f=['patent_id','patent_title','patent_abstract','patent_date']&o={{'per_page':{limit}}}"
        content = await self.fetch_with_retry(url)
        if content:
            try:
                data = json.loads(content)
                for item in data.get('patents', []):
                    patents.append({
                        'id': str(uuid.uuid4()),
                        'title': item.get('patent_title', ''),
                        'abstract': item.get('patent_abstract', ''),
                        'url': f"https://patents.google.com/patent/{item.get('patent_id')}",
                        'platform': 'PatentsView',
                        'patent_number': item.get('patent_id', ''),
                        'filing_date': item.get('patent_date', ''),
                        'inventors': '',
                        'assignee': '',
                        'crawled_at': datetime.now().isoformat(),
                        'keywords': []
                    })
            except Exception:
                pass
        return patents

    async def close(self):
        if self.session:
            await self.session.close()
