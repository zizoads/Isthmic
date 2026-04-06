from brand_intelligence.crawler_base import AdvancedCrawler
from brand_intelligence.platforms.base import parse_startups_html

async def fetch_saashub(limit):
    crawler = AdvancedCrawler()
    url = "https://www.saashub.com/"
    content = await crawler.fetch_with_retry(url)
    await crawler.close()
    
    return parse_startups_html(
        content, limit, "SaaSHub", "https://www.saashub.com", 
        '.product-item', '.name', '.description'
    )
