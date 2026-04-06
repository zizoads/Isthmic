import pytest
import asyncio
from brand_intelligence.crawler import SmartBrandIntelligence

@pytest.mark.asyncio
async def test_smart_brand_intelligence_init():
    crawler = SmartBrandIntelligence()
    assert crawler.data_collector is not None
    assert crawler.trend_analyzer is not None
    assert crawler.brand_generator is not None
    assert crawler.evaluator is not None
    assert crawler.learning_loop is not None
    assert crawler.msg_hub is not None

@pytest.mark.asyncio
async def test_smart_brand_intelligence_run():
    crawler = SmartBrandIntelligence()
    # Mocking the agents to avoid actual network calls
    class MockDataCollector:
        async def collect_data(self, crawler_instance, platforms, limit):
            return [{"title": "Test", "content": "Test"}]
    class MockTrendAnalyzer:
        def analyze_trends(self, data):
            return [{"keyword": "Test", "frequency": 1}]
        def identify_opportunities(self, data):
            return [{"keyword": "Test", "frequency": 1}]
    class MockBrandGenerator:
        def generate_brands(self, trends, opportunities, style):
            return [{"name": "Test Brand", "description": "Test"}]
    class MockEvaluator:
        def evaluate_brands(self, brands, keywords):
            return [{"name": "Test Brand", "description": "Test", "score": 0.9}]
    
    crawler.data_collector = MockDataCollector()
    crawler.trend_analyzer = MockTrendAnalyzer()
    crawler.brand_generator = MockBrandGenerator()
    crawler.evaluator = MockEvaluator()
    
    result = await crawler.run_intelligence_cycle(
        platforms=["TechCrunch"],
        limit=1,
        style="merged",
        enable_loop=False
    )
    
    assert "brands" in result
    assert len(result["brands"]) == 1
    assert result["brands"][0]["name"] == "Test Brand"
