from brand_intelligence.crawler_base import AdvancedCrawler
from brand_intelligence.platforms.base import parse_startups_html

async def fetch_betalist(limit):
    crawler = AdvancedCrawler()
    url = "https://betalist.com/"
    content = await crawler.fetch_with_retry(url)
    await crawler.close()
    
    return parse_startups_html(
        content, limit, "BetaList", "https://betalist.com", 
        'div.startup', 'h3 a', 'p'
    )
