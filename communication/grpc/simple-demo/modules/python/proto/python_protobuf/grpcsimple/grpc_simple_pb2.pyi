from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class DataRequest(_message.Message):
    __slots__ = ("name", "data")
    NAME_FIELD_NUMBER: _ClassVar[int]
    DATA_FIELD_NUMBER: _ClassVar[int]
    name: str
    data: bytes
    def __init__(self, name: _Optional[str] = ..., data: _Optional[bytes] = ...) -> None: ...

class DataResponse(_message.Message):
    __slots__ = ("resultMessage", "resultData")
    RESULTMESSAGE_FIELD_NUMBER: _ClassVar[int]
    RESULTDATA_FIELD_NUMBER: _ClassVar[int]
    resultMessage: str
    resultData: bytes
    def __init__(self, resultMessage: _Optional[str] = ..., resultData: _Optional[bytes] = ...) -> None: ...
