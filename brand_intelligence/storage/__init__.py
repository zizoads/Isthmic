import json
import os
import firebase_admin
from firebase_admin import credentials, firestore
from .firebase import FirebaseProvider
from .local import LocalProvider

# Singleton instance
_provider = None

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
