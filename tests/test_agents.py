import pytest
import asyncio
from brand_intelligence.agents import DataCollectorAgent, TrendAnalyzerAgent, BrandGeneratorAgent, EvaluatorAgent

@pytest.mark.asyncio
async def test_data_collector_agent():
    agent = DataCollectorAgent()
    # Mocking the crawler
    class MockCrawler:
        async def fetch_platform_rss(self, platform, url, limit):
            return [{"title": "Test Article", "content": "Test Content", "platform": platform}]
    
    crawler = MockCrawler()
    results = await agent.collect_data(crawler, ["TechCrunch"], 1)
    assert len(results) == 1
    assert results[0]["title"] == "Test Article"

def test_trend_analyzer_agent():
    agent = TrendAnalyzerAgent()
    data = [
        {"title": "AI is the future", "content": "Artificial intelligence is growing rapidly."},
        {"title": "New AI startup", "content": "A new startup is using AI for healthcare."}
    ]
    trends = agent.analyze_trends(data)
    assert len(trends) > 0
    assert "AI" in [t["keyword"] for t in trends]

def test_brand_generator_agent():
    agent = BrandGeneratorAgent()
    trends = [{"keyword": "AI", "frequency": 2}]
    opportunities = [{"keyword": "healthcare", "frequency": 1}]
    brands = agent.generate_brands(trends, opportunities, "merged")
    assert len(brands) > 0
    assert "name" in brands[0]

def test_evaluator_agent():
    agent = EvaluatorAgent()
    brands = [{"name": "AI Health", "description": "AI for healthcare"}]
    evaluated_brands = agent.evaluate_brands(brands, ["AI", "healthcare"])
    assert len(evaluated_brands) == 1
    assert "score" in evaluated_brands[0]
    assert evaluated_brands[0]["score"] > 0
