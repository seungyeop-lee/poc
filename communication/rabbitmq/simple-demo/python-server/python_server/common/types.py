from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class PayloadMessage(BaseModel):
    name: str
    current_time: int
    enable: bool
    data: str

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )
