"""
Módulo de utilitários para processamento de dados
"""
from .processar_dados import (
    reorganizar_por_criticidade,
    mapear_cor_criticidade,
    mapear_icone_pilar,
    nomear_nivel_vulnerabilidade
)

__all__ = [
    'reorganizar_por_criticidade',
    'mapear_cor_criticidade',
    'mapear_icone_pilar',
    'nomear_nivel_vulnerabilidade',
    'reorganizar_por_prioridade',
    'mapear_cor_prioridades',
    'fix_encoding'

]