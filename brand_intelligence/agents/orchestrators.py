from typing import List, Dict
from .base import BaseAgent

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
