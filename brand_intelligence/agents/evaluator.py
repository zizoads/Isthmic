from typing import Dict
from .base import BaseAgent
from storage import get_instincts

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
