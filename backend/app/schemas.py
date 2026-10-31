from pydantic import BaseModel, Field
from enum import Enum
from typing import Literal

# 1. Enumération pour la sévérité
class SeverityEnum(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

# 2. Modèle de requête
class CodeAnalysisRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Le code Python à analyser")
    language: Literal["python"] = Field(default="python", description="Langage supporté (MVP: python uniquement)")

# 3. Modèle pour un problème détecté
class Issue(BaseModel):
    rule_id: str | None = Field(None, description="Identifiant de la règle (ex: E501)")
    type: str = Field(..., description="Type de problème (ex: SyntaxError)")
    line: int | None = Field(None, description="Numéro de la ligne concernée")
    severity: SeverityEnum = Field(..., description="Sévérité du problème")
    message: str = Field(..., description="Description détaillée du problème")

# 4. Modèle de réponse
class CodeAnalysisResponse(BaseModel):
    status: str = Field(..., description="Statut de l'analyse (success, error)")
    valid: bool = Field(..., description="Le code est-il syntaxiquement valide ?")
    issues: list[Issue] = Field(default_factory=list, description="Liste des problèmes détectés")
    summary: str = Field(..., description="Résumé global de l'analyse")