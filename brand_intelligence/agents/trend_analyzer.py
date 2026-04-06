import re
import uuid
from datetime import datetime
from collections import defaultdict
from typing import Dict
import nltk
from nltk.corpus import stopwords
from .base import BaseAgent
from storage import save_trend

stop_words = set(stopwords.words('english')) if nltk else set()

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
