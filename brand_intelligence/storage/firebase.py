import uuid
from firebase_admin import firestore
from .base import StorageProvider

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
