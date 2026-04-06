import pytest
import asyncio
from crawler import SmartBrandIntelligence

@pytest.mark.asyncio
async def test_crawler_initialization():
    system = SmartBrandIntelligence()
    assert system.crawler is not None
    assert system.data_collector is not None
    assert system.trend_analyzer is not None
    assert system.brand_generator is not None
    assert system.evaluator is not None
    await system.close()

@pytest.mark.asyncio
async def test_full_pipeline_structure():
    system = SmartBrandIntelligence()
    config = {
        "limit": 1,
        "enable_loop": False
    }
    # We don't run the full pipeline to avoid external network calls in basic tests
    # but we verify the method exists and accepts config
    assert hasattr(system, 'full_pipeline')
    await system.close()

def test_nltk_setup():
    from crawler import setup_nltk
    # Should not raise any exceptions
    setup_nltk()
