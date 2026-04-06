from brand_intelligence.platforms.base import parse_startups_html
import uuid
from datetime import datetime

async def fetch_angellist(limit, crawler):
    url = "https://angel.co/companies"
    content = await crawler.fetch_with_retry(url)
    return parse_startups_html(
        content, limit, "AngelList", "https://angel.co", 
        'div.startup', 'a.startup-link', 'p'
    )
