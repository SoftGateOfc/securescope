#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Utilitários para processar dados de vulnerabilidades
Contém apenas: análise de criticidade, mapeamento de pilar e reorganização
"""
import re

_MOJIBAKE_PATTERN = re.compile(r'[ÃÂ][\x80-\xBF]')

def fix_encoding(texto: str) -> str:
    """
    Corrige SOMENTE mojibake clássico.
    Nunca altera texto correto digitado pelo usuário.
    """
    if not isinstance(texto, str) or not texto:
        return texto

    # Texto normal do usuário → não toca
    if not _MOJIBAKE_PATTERN.search(texto):
        return texto

    try:
        corrigido = texto.encode('latin1').decode('utf-8')

        # Segurança máxima: só aceita se removeu mojibake
        if _MOJIBAKE_PATTERN.search(corrigido):
            return texto

        return corrigido
    except (UnicodeEncodeError, UnicodeDecodeError):
        return texto

def nomear_nivel_vulnerabilidade(vulnerabilidade):
    """
    Converte o nível numérico de vulnerabilidade em texto descritivo
    Igual ao JavaScript nomearNivelVulnerabilidade()
    """
    nivel = int(vulnerabilidade)
    if nivel ==1:
        return "Atende Plenamente"
    if nivel == 2:
        return "Atende Após Ajustes"
    elif nivel == 3:
        return "Atende Após Ajustes Médios"
    elif nivel == 4:
        return "Não Atende"
    elif nivel == 5:
        return "Não Existe"
    else:
        return f"Nível {vulnerabilidade}"


def mapear_icone_pilar(pilar):
    """
    Converte o nome/URL do pilar para o nome do arquivo de ícone
    """
    if 'pessoas' in pilar.lower():
        return 'pessoas.png'
    elif 'tecnologia' in pilar.lower():
        return 'tecnologia.png'
    elif 'processos' in pilar.lower():
        return 'processos.png'
    elif 'informacao' in pilar.lower() or 'informação' in pilar.lower():
        return 'informacoes.png'
    elif 'gestao' in pilar.lower() or 'gestão' in pilar.lower():
        return 'gestao.png'
    
    # Fallback
    return 'ICON_PESSOAS.png'


def mapear_cor_criticidade(criticidade):
    """
    Mapeia a criticidade textual para RGB (para os círculos)
    """
    cores = {
        'vermelho-escuro': (192, 0, 0),     
        'laranja': (237, 125, 49),            
        'amarelo': (255, 192, 0),             
        'verde-escuro': (0, 97, 0),           
        'verde-claro': (146, 208, 80)         
    }
    return cores.get(criticidade, (128, 128, 128))  # Cinza 


def reorganizar_por_criticidade(respostas):
    """
    Reorganiza as respostas por ordem de criticidade (maior → menor)
    Filtra apenas vulnerabilidades (nivel > 1) e renumera sequencialmente
    """
    if not respostas or len(respostas) == 0:
        return []
    
    # 1. Filtrar apenas vulnerabilidades (vulnerabilidade > 1)
    vulnerabilidades = [
        r for r in respostas 
        if int(r.get('vulnerabilidade', 0)) > 1
    ]
    
    if len(vulnerabilidades) == 0:
        return []
    
    # 2. Ordem de criticidade (maior = mais crítico)
    ordem_criticidade = {
        'vermelho-escuro': 5,  
        'laranja': 4,           
        'amarelo': 3,           
        'verde-escuro': 2,      
        'verde-claro': 1        
    }
    
    # 3. Ordenar por criticidade 
    vulnerabilidades_ordenadas = sorted(
        vulnerabilidades,
        key=lambda x: ordem_criticidade.get(x.get('criticidade', ''), 0),
        reverse=True
    )
    
    # 4. Renumerar sequencialmente 
    for indice, item in enumerate(vulnerabilidades_ordenadas):
        item['nc_sequencial'] = str(indice + 1).zfill(3)  
    
    return vulnerabilidades_ordenadas


def mapear_cor_prioridade(prioridade):
    """
    Mapeia a prioridade textual para RGB (para os círculos)
    Prioridade: longo prazo (vermelho), médio prazo (amarelo), curto prazo (verde)
    """
    cores = {
        'vermelho-escuro': (192, 0, 0),      # Longo Prazo
        'amarelo': (255, 192, 0),             # Médio Prazo
        'verde-claro': (146, 208, 80)         # Curto Prazo
    }
    return cores.get(prioridade, (128, 128, 128))  # Cinza se não encontrar


def reorganizar_por_prioridade(respostas):
    """
    Reorganiza as respostas por ordem de prioridade (longo → médio → curto)
    Filtra apenas vulnerabilidades (nivel > 1) e renumera sequencialmente
    """
    if not respostas or len(respostas) == 0:
        return []
    
    # 1. Filtrar apenas vulnerabilidades (vulnerabilidade > 1)
    vulnerabilidades = [
        r for r in respostas 
        if int(r.get('vulnerabilidade', 0)) > 1
    ]
    
    if len(vulnerabilidades) == 0:
        return []
    
    # 2. Ordem de prioridade 
    ordem_prioridade = {
        'vermelho-escuro': 3,  # Longo Prazo 
        'amarelo': 2,           # Médio Prazo
        'verde-claro': 1        # Curto Prazo
    }
    
    # 3. Ordenar por prioridade 
    prioridades_ordenadas = sorted(  
        vulnerabilidades,
        key=lambda x: ordem_prioridade.get(x.get('prioridade', ''), 0),
        reverse=True
    )
    
    # 4. Renumerar sequencialmente (NC-001, NC-002...)
    for indice, item in enumerate(prioridades_ordenadas):  
        item['nc_sequencial'] = str(indice + 1).zfill(3)  
    
    return prioridades_ordenadas 

