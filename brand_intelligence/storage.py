
import json
import os
import uuid
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

LOCAL_DB_PATH = "local_db.json"
firestore_db = None

def init_storage():
    global firestore_db
    if firestore_db: return # Already initialized
    cred_json = os.environ.get("FIREBASE_CREDENTIALS")
    if cred_json:
        try:
            cred_dict = json.loads(cred_json)
            cred = credentials.Certificate(cred_dict)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            firestore_db = firestore.client()
            print("✅ Firebase initialized successfully")
        except Exception as e:
            print(f"❌ Firebase initialization failed: {e}. Falling back to local storage.")
    else:
        print("⚠️ FIREBASE_CREDENTIALS not found. Using local storage.")

def get_local_db():
    if not os.path.exists(LOCAL_DB_PATH):
        with open(LOCAL_DB_PATH, 'w') as f:
            json.dump({"articles": {}, "patents": {}, "startups": {}, "trends": [], "brand_opportunities": [], "instincts": [], "sessions": {}}, f)
    with open(LOCAL_DB_PATH, 'r') as f:
        return json.load(f)

def save_local_db(data):
    with open(LOCAL_DB_PATH, 'w') as f:
        json.dump(data, f, indent=2)

def save_article(article):
    if firestore_db:
        firestore_db.collection('articles').document(article['id']).set(article)
    else:
        db = get_local_db()
        db["articles"][article['id']] = article
        save_local_db(db)

def save_patent(patent):
    if firestore_db:
        firestore_db.collection('patents').document(patent['id']).set(patent)
    else:
        db = get_local_db()
        db["patents"][patent['id']] = patent
        save_local_db(db)

def save_startup(startup):
    if firestore_db:
        firestore_db.collection('startups').document(startup['id']).set(startup)
    else:
        db = get_local_db()
        db["startups"][startup['id']] = startup
        save_local_db(db)

def save_trend(trend):
    if firestore_db:
        firestore_db.collection('trends').document(trend['id']).set(trend)
    else:
        db = get_local_db()
        db["trends"].append(trend)
        save_local_db(db)

def save_brand_opportunity(opp):
    if 'id' not in opp: opp['id'] = str(uuid.uuid4())
    if firestore_db:
        firestore_db.collection('brand_opportunities').document(opp['id']).set(opp)
    else:
        db = get_local_db()
        db["brand_opportunities"].append(opp)
        save_local_db(db)

def save_session(session_id, start_time, end_time=None, stats=None):
    data = {'start_time': start_time, 'session_id': session_id}
    if end_time: data['end_time'] = end_time
    if stats: data.update(stats)
    
    if firestore_db:
        firestore_db.collection('sessions').document(session_id).set(data)
    else:
        db = get_local_db()
        db["sessions"][session_id] = data
        save_local_db(db)

def get_trends(limit=20):
    if firestore_db:
        try:
            docs = firestore_db.collection('trends').order_by('opportunity_score', direction=firestore.Query.DESCENDING).limit(limit).stream()
            return [doc.to_dict() for doc in docs]
        except: return []
    db = get_local_db()
    trends = db.get("trends", [])
    return sorted(trends, key=lambda x: x.get('opportunity_score', 0), reverse=True)[:limit]

def get_opportunities(limit=10):
    if firestore_db:
        try:
            docs = firestore_db.collection('brand_opportunities').order_by('opportunity_score', direction=firestore.Query.DESCENDING).limit(limit).stream()
            return [doc.to_dict() for doc in docs]
        except: return []
    db = get_local_db()
    opps = db.get("brand_opportunities", [])
    return sorted(opps, key=lambda x: x.get('opportunity_score', 0), reverse=True)[:limit]

def get_instincts(min_confidence=0.6):
    if firestore_db:
        try:
            docs = firestore_db.collection('instincts').where('confidence', '>=', min_confidence).order_by('confidence', direction=firestore.Query.DESCENDING).stream()
            return [doc.to_dict() for doc in docs]
        except: return []
    db = get_local_db()
    instincts = db.get("instincts", [])
    return [i for i in instincts if i.get('confidence', 0) >= min_confidence]
