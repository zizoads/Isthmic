import asyncio
from brand_intelligence.crawler import SmartBrandIntelligence
from brand_intelligence.storage import init_storage

async def run_test():
    print("🚀 Initializing storage...")
    init_storage()
    
    print("🤖 Initializing SmartBrandIntelligence...")
    system = SmartBrandIntelligence()
    
    config = {
        'limit': 1,
        'enable_loop': False,
        'selected_platforms': ['SaaSHub'] # Just test one for speed
    }
    
    print("⚙️ Running pipeline...")
    result = await system.full_pipeline(config)
    
    print("✅ Pipeline finished!")
    print(f"Articles fetched: {len(result.get('articles', []))}")
    print(f"Startups fetched: {len(result.get('startups', []))}")
    
    await system.close()

if __name__ == "__main__":
    asyncio.run(run_test())
