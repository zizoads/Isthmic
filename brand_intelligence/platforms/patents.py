class PatentPlatforms:
    @staticmethod
    async def fetch_uspto(limit):
        return []
    @staticmethod
    async def fetch_wipo(limit):
        return []
    @staticmethod
    async def fetch_google_patents(limit):
        return []
    @staticmethod
    async def fetch_patentsview(limit, crawler):
        return await crawler.fetch_patents_patentsview(limit)
    @staticmethod
    async def fetch_perplexity(limit):
        return []
