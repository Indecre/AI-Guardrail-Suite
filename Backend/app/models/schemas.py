from typing import List, Optional

from pydantic import BaseModel, Field


class FairCheckRequest(BaseModel):
    y_true: List[int]
    y_pred: List[int]
    sensitive: List[int]


class FairCheckResponse(BaseModel):
    fairness_score: float
    demographic_parity_diff: float
    equal_opportunity_diff: float
    suggestions: List[str]
    aif360: dict = Field(default_factory=dict)
    report_card: dict = Field(default_factory=dict)


class AgenticRequest(BaseModel):
    prompt: str
    domain: str = "general"


class SpanFlag(BaseModel):
    span: str
    reason: str


class AgentResult(BaseModel):
    agent: str
    score: float
    notes: str
    flags: List[SpanFlag] = Field(default_factory=list)


class AgenticResponse(BaseModel):
    misalignment_risk: float
    results: List[AgentResult]
    audit_id: str


class AlignCheckRequest(BaseModel):
    org: str = "acme"
    domain: str = "general"
    prompt: str
    draft: Optional[str] = None


class AlignCheckResponse(BaseModel):
    status: str
    alignment_score: float
    results: List[AgentResult]
    suggested_rewrite: Optional[str] = None
    audit_id: str


class TruthTraceRequest(BaseModel):
    claim: str


class TruthTraceResponse(BaseModel):
    verdict: str
    sources: List[str]
    notes: Optional[str] = None
