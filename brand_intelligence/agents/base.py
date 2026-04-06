from typing import Any

class BaseAgent:
    def __init__(self, name: str):
        self.name = name
    async def process(self, input_data: Any) -> Any:
        raise NotImplementedError
