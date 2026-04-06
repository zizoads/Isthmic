from brand_intelligence.crawler_base import AdvancedCrawler
from brand_intelligence.platforms.base import parse_startups_html

async def fetch_growthlist(limit):
    crawler = AdvancedCrawler()
    url = "https://growthlist.co/"
    content = await crawler.fetch_with_retry(url)
    await crawler.close()
    
    return parse_startups_html(
        content, limit, "GrowthList", "https://growthlist.co", 
        '.startup-item', '.name', '.description'
    )
