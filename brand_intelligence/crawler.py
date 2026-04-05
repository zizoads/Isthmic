# ملف crawler.py (النسخة المتكاملة الكاملة)
import asyncio
import aiohttp
import json
import os
import re
import random
import uuid
import time
from datetime import datetime
from collections import defaultdict
from typing import List, Dict, Optional, Any
import nltk
from nltk.corpus import stopwords
from bs4 import BeautifulSoup
# import firebase_admin
# from firebase_admin import credentials, firestore

# -------------------- إعداد NLTK --------------------
def setup_nltk():
    nltk_data_dir = os.path.join(os.getcwd(), 'nltk_data')
    os.makedirs(nltk_data_dir, exist_ok=True)
    if nltk_data_dir not in nltk.data.path:
        nltk.data.path.append(nltk_data_dir)
    packages = ['stopwords', 'punkt', 'wordnet']
    for package in packages:
        try:
            nltk.data.find(f'corpora/{package}')
        except LookupError:
            nltk.download(package, download_dir=nltk_data_dir, quiet=True)
    print("✅ NLTK ready")

setup_nltk()
stop_words = set(stopwords.words('english')) if nltk else set()

# -------------------- إعداد التخزين (Firebase أو محلي) --------------------
import firebase_admin
from firebase_admin import credentials, firestore

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

# Initialize storage at module level
init_storage()

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

def save_instinct(instinct):
    if firestore_db:
        firestore_db.collection('instincts').document(instinct['id']).set(instinct)
    else:
        db = get_local_db()
        db["instincts"].append(instinct)
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

# -------------------- الزاحف المتقدم --------------------
class AdvancedCrawler:
    def __init__(self, max_retries=3):
        self.session = None
        self.max_retries = max_retries

    async def init_session(self):
        if not self.session:
            self.session = aiohttp.ClientSession(headers=self._headers())

    def _headers(self):
        return {
            'User-Agent': random.choice([
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
            ]),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
        }

    async def fetch_with_retry(self, url, timeout=30, retries=None):
        await self.init_session()
        max_retries = retries if retries is not None else self.max_retries
        for attempt in range(max_retries):
            try:
                async with self.session.get(url, timeout=timeout) as resp:
                    if resp.status == 200:
                        return await resp.text()
                    else:
                        print(f"HTTP {resp.status} from {url}, attempt {attempt+1}")
            except Exception as e:
                print(f"Error fetching {url}: {e}, attempt {attempt+1}")
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
        return None

    async def fetch_platform_rss(self, name, url, limit):
        articles = []
        content = await self.fetch_with_retry(url)
        if not content:
            return articles
        # Try lxml first, fallback to xml
        try:
            soup = BeautifulSoup(content, 'lxml-xml')
        except:
            soup = BeautifulSoup(content, 'xml')
        for item in soup.find_all('item')[:limit]:
            title = item.find('title').text if item.find('title') else ''
            link = item.find('link').text if item.find('link') else ''
            pub_date = item.find('pubDate').text if item.find('pubDate') else ''
            desc = item.find('description').text if item.find('description') else ''
            articles.append({
                'id': str(uuid.uuid4()),
                'title': title,
                'content': desc,
                'url': link,
                'platform': name,
                'published_at': pub_date,
                'crawled_at': datetime.now().isoformat(),
                'sentiment': 0.0,
                'keywords': [],
                'metadata': {}
            })
        return articles

    async def fetch_patents_patentsview(self, limit):
        patents = []
        url = f"https://api.patentsview.org/patents/query?q=*&f=['patent_id','patent_title','patent_abstract','patent_date']&o={{'per_page':{limit}}}"
        content = await self.fetch_with_retry(url)
        if content:
            try:
                data = json.loads(content)
                for item in data.get('patents', []):
                    patents.append({
                        'id': str(uuid.uuid4()),
                        'title': item.get('patent_title', ''),
                        'abstract': item.get('patent_abstract', ''),
                        'url': f"https://patents.google.com/patent/{item.get('patent_id')}",
                        'platform': 'PatentsView',
                        'patent_number': item.get('patent_id', ''),
                        'filing_date': item.get('patent_date', ''),
                        'inventors': '',
                        'assignee': '',
                        'crawled_at': datetime.now().isoformat(),
                        'keywords': []
                    })
            except:
                pass
        return patents

    async def close(self):
        if self.session:
            await self.session.close()

# -------------------- منصات براءات الاختراع --------------------
class PatentPlatforms:
    @staticmethod
    async def fetch_uspto(limit):
        return []
    @staticmethod
    async def fetch_wipo(limit):
        return []
    @staticmethod
    async def fetch_google_patents(limit):
        return []
    @staticmethod
    async def fetch_patentsview(limit, crawler):
        return await crawler.fetch_patents_patentsview(limit)
    @staticmethod
    async def fetch_perplexity(limit):
        return []

# -------------------- منصات الشركات الناشئة --------------------
class StartupPlatforms:
    @staticmethod
    async def fetch_crunchbase(limit):
        return [{
            'id': str(uuid.uuid4()),
            'name': f"Sample Startup {i+1}",
            'description': "A technology startup",
            'url': "https://example.com",
            'platform': "Crunchbase",
            'founded_year': "2023",
            'funding_total': random.uniform(500000, 5000000),
            'investors': "Sample Investors",
            'category': "AI",
            'crawled_at': datetime.now().isoformat(),
            'keywords': []
        } for i in range(min(limit, 3))]

    @staticmethod
    async def fetch_pitchbook(limit):
        return []
    @staticmethod
    async def fetch_tracxn(limit):
        return []
    @staticmethod
    async def fetch_dealroom(limit):
        return []

    @staticmethod
    async def fetch_betalist(limit, crawler):
        url = "https://betalist.com/"
        content = await crawler.fetch_with_retry(url)
        startups = []
        if content:
            # Try lxml first, fallback to html.parser
            try:
                soup = BeautifulSoup(content, 'lxml')
            except:
                soup = BeautifulSoup(content, 'html.parser')
            for item in soup.select('div.startup')[:limit]:
                name_elem = item.select_one('h3 a')
                name = name_elem.text.strip() if name_elem else ''
                link = name_elem.get('href') if name_elem else ''
                if link and not link.startswith('http'):
                    link = "https://betalist.com" + link
                desc_elem = item.select_one('p')
                desc = desc_elem.text.strip() if desc_elem else ''
                startups.append({
                    'id': str(uuid.uuid4()),
                    'name': name,
                    'description': desc,
                    'url': link,
                    'platform': "BetaList",
                    'founded_year': '',
                    'funding_total': 0,
                    'investors': '',
                    'category': '',
                    'crawled_at': datetime.now().isoformat(),
                    'keywords': []
                })
        return startups

    @staticmethod
    async def fetch_producthunt(crawler, limit):
        url = "https://www.producthunt.com/feed"
        content = await crawler.fetch_with_retry(url)
        startups = []
        if content:
            # Try lxml first, fallback to xml
            try:
                soup = BeautifulSoup(content, 'lxml-xml')
            except:
                soup = BeautifulSoup(content, 'xml')
            for item in soup.find_all('item')[:limit]:
                title = item.find('title').text if item.find('title') else ''
                link = item.find('link').text if item.find('link') else ''
                desc = item.find('description').text if item.find('description') else ''
                startups.append({
                    'id': str(uuid.uuid4()),
                    'name': title,
                    'description': desc,
                    'url': link,
                    'platform': "Product Hunt",
                    'founded_year': '',
                    'funding_total': 0,
                    'investors': '',
                    'category': '',
                    'crawled_at': datetime.now().isoformat(),
                    'keywords': []
                })
        return startups

    @staticmethod
    async def fetch_angellist(limit, crawler):
        url = "https://angel.co/companies"
        content = await crawler.fetch_with_retry(url)
        startups = []
        if content:
            # Try lxml first, fallback to html.parser
            try:
                soup = BeautifulSoup(content, 'lxml')
            except:
                soup = BeautifulSoup(content, 'html.parser')
            for item in soup.select('div.startup')[:limit]:
                name_elem = item.select_one('a.startup-link')
                name = name_elem.text.strip() if name_elem else ''
                link = name_elem.get('href') if name_elem else ''
                if link and not link.startswith('http'):
                    link = "https://angel.co" + link
                desc_elem = item.select_one('p')
                desc = desc_elem.text.strip() if desc_elem else ''
                startups.append({
                    'id': str(uuid.uuid4()),
                    'name': name,
                    'description': desc,
                    'url': link,
                    'platform': "AngelList",
                    'founded_year': '',
                    'funding_total': 0,
                    'investors': '',
                    'category': '',
                    'crawled_at': datetime.now().isoformat(),
                    'keywords': []
                })
        return startups

    @staticmethod
    async def fetch_startupbase(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'StartupBase Co', 'description': 'Sample', 'url': 'https://startupbase.com', 'platform': 'StartupBase', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]

    @staticmethod
    async def fetch_launchingnext(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'LaunchingNext Startup', 'description': 'Sample', 'url': 'https://www.launchingnext.com', 'platform': 'Launching Next', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]

    @staticmethod
    async def fetch_saashub(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'SaaSHub Product', 'description': 'Sample', 'url': 'https://www.saashub.com', 'platform': 'SaaSHub', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]

    @staticmethod
    async def fetch_growthlist(limit):
        return [{'id': str(uuid.uuid4()), 'name': 'GrowthList Startup', 'description': 'Sample', 'url': 'https://growthlist.co', 'platform': 'GrowthList', 'crawled_at': datetime.now().isoformat(), 'keywords': []} for _ in range(min(limit, 2))]

# -------------------- وكلاء النظام --------------------
class BaseAgent:
    def __init__(self, name: str):
        self.name = name
    async def process(self, input_data: Any) -> Any:
        raise NotImplementedError

class DataCollectorAgent(BaseAgent):
    def __init__(self, crawler: AdvancedCrawler):
        super().__init__("DataCollector")
        self.crawler = crawler
    async def process(self, input_data: Dict) -> Dict:
        limit = input_data.get('limit_per_source', input_data.get('limit', 10))
        selected_platforms = input_data.get('selected_platforms', None)
        timeout = input_data.get('timeout_seconds', 30)
        retries = input_data.get('retry_attempts', 3)
        
        articles = []
        tech_platforms = [
            ("TechCrunch", "https://techcrunch.com/feed/"),
            ("The Verge", "https://www.theverge.com/rss/index.xml"),
            ("Engadget", "https://www.engadget.com/rss.xml"),
            ("TechRadar", "https://www.techradar.com/rss"),
            ("GeekWire", "https://www.geekwire.com/feed/"),
            ("CNET", "https://www.cnet.com/rss/news/"),
            ("Mashable", "https://mashable.com/feeds/rss/all"),
            ("Gizmodo", "https://gizmodo.com/rss"),
            ("Lifewire", "https://www.lifewire.com/rss")
        ]
        
        for name, url in tech_platforms:
            if selected_platforms and name not in selected_platforms:
                continue
            arts = await self.crawler.fetch_platform_rss(name, url, limit)
            articles.extend(arts)
            for a in arts:
                save_article(a)
        
        patents = []
        if not selected_platforms or "PatentsView" in selected_platforms:
            patents.extend(await PatentPlatforms.fetch_patentsview(limit, self.crawler))
            for p in patents:
                save_patent(p)
        
        startups = []
        startup_sources = [
            ("Crunchbase", StartupPlatforms.fetch_crunchbase),
            ("BetaList", lambda l: StartupPlatforms.fetch_betalist(l, self.crawler)),
            ("Product Hunt", lambda l: StartupPlatforms.fetch_producthunt(self.crawler, l)),
            ("AngelList", lambda l: StartupPlatforms.fetch_angellist(l, self.crawler)),
            ("StartupBase", StartupPlatforms.fetch_startupbase),
            ("Launching Next", StartupPlatforms.fetch_launchingnext),
            ("SaaSHub", StartupPlatforms.fetch_saashub),
            ("GrowthList", StartupPlatforms.fetch_growthlist)
        ]
        
        for name, fetcher in startup_sources:
            if selected_platforms and name not in selected_platforms:
                continue
            if asyncio.iscoroutinefunction(fetcher) or hasattr(fetcher, '__name__') and fetcher.__name__ == '<lambda>':
                res = await fetcher(limit)
            else:
                res = fetcher(limit)
            startups.extend(res)
            for s in res:
                save_startup(s)
                
        return {'articles': articles, 'patents': patents, 'startups': startups}

class TrendAnalyzerAgent(BaseAgent):
    def __init__(self):
        super().__init__("TrendAnalyzer")
        self.keyword_freq = defaultdict(int)
        self.platform_counts = defaultdict(lambda: defaultdict(int))
    async def process(self, input_data: Dict) -> Dict:
        articles = input_data.get('articles', [])
        patents = input_data.get('patents', [])
        startups = input_data.get('startups', [])
        
        min_len = input_data.get('min_keyword_length', 4)
        exclude_stop = input_data.get('exclude_stopwords', True)
        
        w_articles = input_data.get('weight_articles', 1.0)
        w_patents = input_data.get('weight_patents', 2.0)
        w_startups = input_data.get('weight_startups', 3.0)
        
        regex = rf'\b[a-z]{{{min_len},}}\b'
        
        for art in articles:
            text = (art['title'] + " " + art['content']).lower()
            words = re.findall(regex, text)
            for w in words:
                if not exclude_stop or w not in stop_words:
                    self.keyword_freq[w] += w_articles
                    self.platform_counts[w][art['platform']] += 1
        for pat in patents:
            text = (pat['title'] + " " + pat['abstract']).lower()
            words = re.findall(regex, text)
            for w in words:
                if not exclude_stop or w not in stop_words:
                    self.keyword_freq[w] += w_patents
                    self.platform_counts[w][pat['platform']] += 1
        for st in startups:
            text = (st['name'] + " " + st.get('description', '')).lower()
            words = re.findall(regex, text)
            for w in words:
                if not exclude_stop or w not in stop_words:
                    self.keyword_freq[w] += w_startups
                    self.platform_counts[w][st['platform']] += 1
                    
        trends = []
        now = datetime.now().isoformat()
        min_freq = input_data.get('min_keyword_frequency', 3)
        
        for word, freq in self.keyword_freq.items():
            if freq >= min_freq:
                platforms = [p for p, cnt in self.platform_counts[word].items() if cnt > 0]
                velocity = min(1.0, len(platforms) / 5.0)
                opp_score = min(1.0, (freq / 20) * (len(platforms) / 5.0))
                trends.append({
                    'id': str(uuid.uuid4()),
                    'keyword': word,
                    'frequency': freq,
                    'platforms': platforms,
                    'first_seen': now,
                    'last_seen': now,
                    'velocity': velocity,
                    'opportunity_score': opp_score,
                    'sentiment_avg': 0.0
                })
        
        min_trend_score = input_data.get('min_trend_score', 0.0)
        trends = [t for t in trends if t['opportunity_score'] >= min_trend_score]
        trends.sort(key=lambda x: x['opportunity_score'], reverse=True)
        
        for t in trends:
            save_trend(t)
        return {'trends': trends}

class BrandGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__("BrandGenerator")
        self.instincts = get_instincts()
    async def process(self, input_data: Dict) -> Dict:
        trends = input_data.get('trends', [])
        if not trends:
            return {'opportunities': []}
            
        max_trends = input_data.get('max_trends', 5)
        brand_style = input_data.get('brand_name_style', 'merged')
        max_brands = input_data.get('max_brands', 5)
        
        opportunities = []
        common_words = [t['keyword'] for t in trends[:max_trends]]
        
        if common_words:
            for i in range(min(len(common_words) // 2, max_brands)):
                w1, w2 = common_words[i*2], common_words[i*2+1]
                
                if brand_style == 'merged':
                    brand_name = (w1 + w2).title()
                elif brand_style == 'acronym':
                    brand_name = (w1[0] + w2[0]).upper() + " " + (w1 + w2).title()
                else: # compound
                    brand_name = f"{w1.title()} {w2.title()}"
                    
                opportunities.append({
                    'id': str(uuid.uuid4()),
                    'name': brand_name,
                    'positioning': f"Leading solution for {w1} and {w2}",
                    'persona': "Tech professionals and innovators",
                    'gap': f"Lack of integrated platforms addressing {w1}",
                    'supporting_evidence': [w1, w2],
                    'opportunity_score': (trends[i*2]['opportunity_score'] + trends[i*2+1]['opportunity_score']) / 2,
                    'created_at': datetime.now().isoformat(),
                    'session_id': input_data.get('session_id', '')
                })
        
        for opp in opportunities:
            save_brand_opportunity(opp)
        return {'opportunities': opportunities}

class EvaluatorAgent(BaseAgent):
    def __init__(self):
        super().__init__("Evaluator")
        self.instincts = get_instincts()
    async def process(self, input_data: Dict) -> Dict:
        opportunities = input_data.get('opportunities', [])
        enable_instincts = input_data.get('enable_instincts', True)
        min_confidence = input_data.get('min_instinct_confidence', 0.6)
        
        if enable_instincts:
            instincts = [i for i in self.instincts if i['confidence'] >= min_confidence]
            for opp in opportunities:
                for inst in instincts:
                    if any(word in opp['gap'].lower() for word in inst['pattern'].split()):
                        opp['opportunity_score'] += inst['confidence'] * 0.1
                opp['opportunity_score'] = min(1.0, opp['opportunity_score'])
        
        opportunities.sort(key=lambda x: x['opportunity_score'], reverse=True)
        return {'opportunities': opportunities}

class LearningLoop:
    def __init__(self, agents: List[BaseAgent], max_iterations: int = 3, target_score: float = 0.8):
        self.agents = agents
        self.max_iter = max_iterations
        self.target_score = target_score
    async def run(self, initial_data: Dict) -> Dict:
        data = initial_data
        for i in range(self.max_iter):
            print(f"🔄 Iteration {i+1}/{self.max_iter}")
            for agent in self.agents:
                data = await agent.process(data)
            if 'opportunities' in data and data['opportunities']:
                best_score = data['opportunities'][0]['opportunity_score']
                if best_score >= self.target_score:
                    print("✅ Target score reached")
                    break
        return data

class MsgHub:
    def __init__(self, participants: List[BaseAgent]):
        self.participants = participants
    async def sequential_pipeline(self, input_data: Dict) -> Dict:
        data = input_data
        for agent in self.participants:
            data = await agent.process(data)
        return data

# -------------------- النظام الرئيسي --------------------
class SmartBrandIntelligence:
    def __init__(self):
        self.crawler = AdvancedCrawler()
        self.data_collector = DataCollectorAgent(self.crawler)
        self.trend_analyzer = TrendAnalyzerAgent()
        self.brand_generator = BrandGeneratorAgent()
        self.evaluator = EvaluatorAgent()
        self.agents = [self.data_collector, self.trend_analyzer, self.brand_generator, self.evaluator]
        self.session_id = None
    async def full_pipeline(self, config: Dict) -> Dict:
        # init_storage() is now called at module level
        self.session_id = str(uuid.uuid4())
        start_time = datetime.now().isoformat()
        save_session(self.session_id, start_time)
        
        config['session_id'] = self.session_id
        
        if config.get('enable_loop', False):
            loop = LearningLoop(
                self.agents, 
                max_iterations=config.get('max_iterations', 3),
                target_score=config.get('target_score', 0.8)
            )
            result = await loop.run(config)
        else:
            hub = MsgHub(self.agents)
            result = await hub.sequential_pipeline(config)
            
        end_time = datetime.now().isoformat()
        stats = {
            'articles_fetched': len(result.get('articles', [])),
            'patents_fetched': len(result.get('patents', [])),
            'startups_fetched': len(result.get('startups', [])),
            'trends_found': len(result.get('trends', [])),
            'opportunities_generated': len(result.get('opportunities', []))
        }
        save_session(self.session_id, start_time, end_time, stats)
        return result
    async def improvement_loop(self, limit: int = 10, iterations: int = 2):
        initial_data = {'limit': limit, 'session_id': self.session_id or str(uuid.uuid4())}
        loop = LearningLoop(self.agents, max_iterations=iterations)
        result = await loop.run(initial_data)
        return result
    async def close(self):
        await self.crawler.close()
