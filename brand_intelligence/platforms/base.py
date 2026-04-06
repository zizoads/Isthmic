import uuid
from datetime import datetime
from bs4 import BeautifulSoup

def parse_startups_html(content, limit, platform_name, base_url, item_selector, name_selector, desc_selector):
    startups = []
    if content:
        try:
            soup = BeautifulSoup(content, 'lxml')
        except Exception:
            soup = BeautifulSoup(content, 'html.parser')
        for item in soup.select(item_selector)[:limit]:
            name_elem = item.select_one(name_selector)
            name = name_elem.text.strip() if name_elem else ''
            link = name_elem.get('href') if name_elem else ''
            if link and not link.startswith('http'):
                link = base_url + link
            desc_elem = item.select_one(desc_selector)
            desc = desc_elem.text.strip() if desc_elem else ''
            startups.append({
                'id': str(uuid.uuid4()),
                'name': name,
                'description': desc,
                'url': link,
                'platform': platform_name,
                'founded_year': '',
                'funding_total': 0,
                'investors': '',
                'category': '',
                'crawled_at': datetime.now().isoformat(),
                'keywords': []
            })
    return startups
