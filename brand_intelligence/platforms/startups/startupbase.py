from brand_intelligence.crawler_base import AdvancedCrawler
from brand_intelligence.platforms.base import parse_startups_html

async def fetch_startupbase(limit):
    crawler = AdvancedCrawler()
    url = "https://startupbase.com/"
    content = await crawler.fetch_with_retry(url)
    await crawler.close()
    
    return parse_startups_html(
        content, limit, "StartupBase", "https://startupbase.com", 
        '.startup-item', '.name', '.description'
    )
