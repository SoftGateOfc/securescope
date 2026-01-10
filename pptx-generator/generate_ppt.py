#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
sys.stdin.reconfigure(encoding="utf-8")
import json
from io import BytesIO
from pptx import Presentation
from pptx.util import Inches
from slides.capa import gerar_capa
from slides.sumario import gerar_sumario
from slides.objetivos import gerar_objetivos
from slides.metodologia import gerar_metodologia
from slides.panorama_situacional import gerar_panorama_situacional 
from slides.seguranca import gerar_seguranca
from slides.resumo_exec import gerar_resumo_exec
from slides.resumo_exec_det import gerar_resumo_exec_det
from slides.vulnerabilidades import gerar_vulnerabilidades
from slides.vulnerabilidade_foto import gerar_vulnerabilidades_foto
from slides.recomendacoes import gerar_recomendacoes
from slides.contra_capa import gerar_contra_capa

def main():
    try:
        print("Lendo dados...", file=sys.stderr, flush=True)
        dados = json.load(sys.stdin)
        
        print("Criando apresentacao...", file=sys.stderr, flush=True)
        pres = Presentation()
        pres.slide_width = Inches(10)
        pres.slide_height = Inches(5.625)
        
        print("Gerando capa...", file=sys.stderr, flush=True)
        gerar_capa(pres, dados)
        
        print("Gerando sumário...", file=sys.stderr, flush=True)
        gerar_sumario(pres, dados)
        
        print("Gerando objetivos...", file=sys.stderr, flush=True) 
        gerar_objetivos(pres, dados)  

        print("Gerando metodologia...", file=sys.stderr, flush=True) 
        gerar_metodologia(pres, dados)      

        print("Gerando panorama situacional...", file=sys.stderr, flush=True)  # ← NOVO
        gerar_panorama_situacional(pres, dados)  

        print("Gerando segurança...", file=sys.stderr, flush=True) 
        gerar_seguranca(pres, dados)  
        
        print("Gerando resumo executivo...", file=sys.stderr, flush=True) 
        gerar_resumo_exec(pres, dados)  

        print("Gerando resumo executivo detalhado...", file=sys.stderr, flush=True)
        gerar_resumo_exec_det(pres, dados)

        print("Gerando Vulnerabilidades tabela...", file=sys.stderr, flush=True)
        gerar_vulnerabilidades(pres, dados)

        print("Gerando Vulnerabilidades Específicas tabela...", file=sys.stderr, flush=True)
        gerar_vulnerabilidades_foto(pres, dados)

        print("Gerando Recomendações...", file=sys.stderr, flush=True)  
        gerar_recomendacoes(pres, dados) 

        print("Gerando Contra Capa...", file=sys.stderr, flush=True)  
        gerar_contra_capa(pres, dados) 


        print("Salvando...", file=sys.stderr, flush=True)
        output = BytesIO()
        pres.save(output)
        buffer_data = output.getvalue()
        
        print(f"Tamanho: {len(buffer_data)} bytes", file=sys.stderr, flush=True)
        
        sys.stdout.buffer.write(buffer_data)
        sys.stdout.buffer.flush()
        
        print("Enviado!", file=sys.stderr, flush=True)
        
    except Exception as e:
        print(f"ERRO: {str(e)}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()