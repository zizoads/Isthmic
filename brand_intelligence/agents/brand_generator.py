import uuid
from datetime import datetime
from typing import Dict
from brand_intelligence.agents.base import BaseAgent
from brand_intelligence.storage import get_instincts, save_brand_opportunity

class BrandGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__("BrandGenerator")
        # Load instincts dynamically
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
