from abc import ABC, abstractmethod
from typing import List, Dict

class StorageProvider(ABC):
    @abstractmethod
    def save_article(self, article: Dict): pass
    @abstractmethod
    def save_patent(self, patent: Dict): pass
    @abstractmethod
    def save_startup(self, startup: Dict): pass
    @abstractmethod
    def save_trend(self, trend: Dict): pass
    @abstractmethod
    def save_brand_opportunity(self, opp: Dict): pass
    @abstractmethod
    def save_session(self, session_id: str, start_time: str, end_time: str = None, stats: Dict = None): pass
    @abstractmethod
    def get_trends(self, limit: int = 20) -> List[Dict]: pass
    @abstractmethod
    def get_opportunities(self, limit: int = 10) -> List[Dict]: pass
    @abstractmethod
    def get_instincts(self, min_confidence: float = 0.6) -> List[Dict]: pass
