
import json
import os
import uuid
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Any

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

class FirebaseProvider(StorageProvider):
    def __init__(self, db):
        self.db = db
    
    def save_article(self, article):
        self.db.collection('articles').document(article['id']).set(article)
    
    def save_patent(self, patent):
        self.db.collection('patents').document(patent['id']).set(patent)
    
    def save_startup(self, startup):
        self.db.collection('startups').document(startup['id']).set(startup)
    
    def save_trend(self, trend):
        self.db.collection('trends').document(trend['id']).set(trend)
    
    def save_brand_opportunity(self, opp):
        if 'id' not in opp: opp['id'] = str(uuid.uuid4())
        self.db.collection('brand_opportunities').document(opp['id']).set(opp)
    
    def save_session(self, session_id, start_time, end_time=None, stats=None):
        data = {'start_time': start_time, 'session_id': session_id}
        if end_time: data['end_time'] = end_time
        if stats: data.update(stats)
        self.db.collection('sessions').document(session_id).set(data)
    
    def get_trends(self, limit=20):
        try:
            docs = self.db.collection('trends').order_by('opportunity_score', direction=firestore.Query.DESCENDING).limit(limit).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"⚠️ Error fetching trends: {e}")
            return []
    
    def get_opportunities(self, limit=10):
        try:
            docs = self.db.collection('brand_opportunities').order_by('opportunity_score', direction=firestore.Query.DESCENDING).limit(limit).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"⚠️ Error fetching opportunities: {e}")
            return []
    
    def get_instincts(self, min_confidence=0.6):
        try:
            docs = self.db.collection('instincts').where('confidence', '>=', min_confidence).order_by('confidence', direction=firestore.Query.DESCENDING).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"⚠️ Error fetching instincts: {e}")
            return []

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

# Singleton instance
_provider: StorageProvider = None

def init_storage():
    global _provider
    if _provider: return
    
    cred_json = os.environ.get("FIREBASE_CREDENTIALS")
    if cred_json:
        try:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            _provider = FirebaseProvider(firestore.client())
            print("✅ Firebase initialized successfully")
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}. Falling back to local storage.")
            _provider = LocalProvider()
    else:
        print("⚠️ FIREBASE_CREDENTIALS not found. Using local storage.")
        _provider = LocalProvider()

# Wrapper functions for compatibility
def _ensure_provider():
    if not _provider: init_storage()

def save_article(article): 
    _ensure_provider()
    _provider.save_article(article)

def save_patent(patent): 
    _ensure_provider()
    _provider.save_patent(patent)

def save_startup(startup): 
    _ensure_provider()
    _provider.save_startup(startup)

def save_trend(trend): 
    _ensure_provider()
    _provider.save_trend(trend)

def save_brand_opportunity(opp): 
    _ensure_provider()
    _provider.save_brand_opportunity(opp)

def save_session(session_id, start_time, end_time=None, stats=None): 
    _ensure_provider()
    _provider.save_session(session_id, start_time, end_time, stats)

def get_trends(limit=20): 
    _ensure_provider()
    return _provider.get_trends(limit)

def get_opportunities(limit=10): 
    _ensure_provider()
    return _provider.get_opportunities(limit)

def get_instincts(min_confidence=0.6): 
    _ensure_provider()
    return _provider.get_instincts(min_confidence)
