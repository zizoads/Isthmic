from brand_intelligence.crawler_base import AdvancedCrawler
from brand_intelligence.platforms.base import parse_startups_html

async def fetch_launchingnext(limit):
    crawler = AdvancedCrawler()
    url = "https://www.launchingnext.com/"
    content = await crawler.fetch_with_retry(url)
    await crawler.close()
    
    return parse_startups_html(
        content, limit, "Launching Next", "https://www.launchingnext.com", 
        '.startup-item', '.name', '.description'
    )
