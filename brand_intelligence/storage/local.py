import json
import os
import uuid
from .base import StorageProvider

class LocalProvider(StorageProvider):
    def __init__(self, path="local_db.json"):
        self.path = path
    
    def _get_db(self):
        if not os.path.exists(self.path):
            with open(self.path, 'w') as f:
                json.dump({"articles": {}, "patents": {}, "startups": {}, "trends": [], "brand_opportunities": [], "instincts": [], "sessions": {}}, f)
        with open(self.path, 'r') as f:
            return json.load(f)
    
    def _save_db(self, data):
        with open(self.path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def save_article(self, article):
        db = self._get_db()
        db["articles"][article['id']] = article
        self._save_db(db)
    
    def save_patent(self, patent):
        db = self._get_db()
        db["patents"][patent['id']] = patent
        self._save_db(db)
    
    def save_startup(self, startup):
        db = self._get_db()
        db["startups"][startup['id']] = startup
        self._save_db(db)
    
    def save_trend(self, trend):
        db = self._get_db()
        db["trends"].append(trend)
        self._save_db(db)
    
    def save_brand_opportunity(self, opp):
        if 'id' not in opp: opp['id'] = str(uuid.uuid4())
        db = self._get_db()
        db["brand_opportunities"].append(opp)
        self._save_db(db)
    
    def save_session(self, session_id, start_time, end_time=None, stats=None):
        data = {'start_time': start_time, 'session_id': session_id}
        if end_time: data['end_time'] = end_time
        if stats: data.update(stats)
        db = self._get_db()
        db["sessions"][session_id] = data
        self._save_db(db)
    
    def get_trends(self, limit=20):
        db = self._get_db()
        trends = db.get("trends", [])
        return sorted(trends, key=lambda x: x.get('opportunity_score', 0), reverse=True)[:limit]
    
    def get_opportunities(self, limit=10):
        db = self._get_db()
        opps = db.get("brand_opportunities", [])
        return sorted(opps, key=lambda x: x.get('opportunity_score', 0), reverse=True)[:limit]
    
    def get_instincts(self, min_confidence=0.6):
        db = self._get_db()
        instincts = db.get("instincts", [])
        return [i for i in instincts if i.get('confidence', 0) >= min_confidence]
