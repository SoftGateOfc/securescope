@extends('estrutura_principal.estrutura')
@section('conteudo')
<div class="flex flex-wrap gap-4 justify-around mt-4 ">
   <a class="w-full md:w-[22%] card-dashboard-branco block p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
         
        <div class="flex justify-between items-start ">
            <div>
                <p class=" text-gray-500 font-medium ">Total de Projetos</p>
            </div>
            <div class="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                <i class="fa fa-map-pin text-blue-600 text-lg"></i>
            </div>
        </div>
        
       
        <div id="numero_absoluto_card_projetos" class="text-4xl font-bold text-gray-900 mb-3 estatisticas_load">
            0
        </div>
        
        <!-- PORCENTAGEM COM SETA E TEXTO -->
        <div class="flex items-center gap-2">
            <i id="icone_card_projetos" class="estatisticas_load text-lg"></i>
            <span id="numero_relatorio_card_projetos" class="text-sm font-medium  estatisticas_load">
                0
            </span>
        </div>
    </a>
    <a class="w-full md:w-[22%] card-dashboard-branco block p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
     
    <div class="flex justify-between items-start">
        <div>
            <p class="text-gray-500 font-medium">Total de Vulnerabilidades</p>
        </div>
      <div class="bg-yellow-100 w-10 h-10 rounded-lg flex items-center justify-center">
        <i class="fas fa-exclamation-triangle text-yellow-600 text-lg"></i>
        </div>
    </div>
    
   
    <div id="numero_absoluto_card_vulnerabilidades" class="text-4xl font-bold text-gray-900 mb-3 estatisticas_load">
        0
    </div>
    
    <!-- PORCENTAGEM COM SETA E TEXTO -->
    <div class="flex items-center gap-2">
        <i id="icone_card_vulnerabilidades" class="estatisticas_load text-lg"></i>
        <span id="numero_relatorio_card_vulnerabilidades" class="text-sm font-medium estatisticas_load">
            0
        </span>
    </div>
</a>
    <a class="w-full md:w-[22%] card-dashboard-branco block p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
     
        <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 font-medium">Total de Riscos</p>
            </div>
            <div class="bg-red-200 w-10 h-10 rounded-lg flex items-center justify-center">
                <i class="fas fa-bell text-red-600 text-xl"></i>
            </div>
        </div>
        
    
        <div id="numero_absoluto_card_riscos" class="text-4xl font-bold text-gray-900 mb-3 estatisticas_load">
            0
        </div>
        
        <!-- PORCENTAGEM COM SETA E TEXTO -->
        <div class="flex items-center gap-2">
            <i id="icone_card_riscos" class="estatisticas_load text-lg"></i>
            <span id="numero_relatorio_card_riscos" class="text-sm font-medium estatisticas_load">
                0
            </span>
        </div>
    </a>
    <a class="w-full md:w-[22%] card-dashboard-branco block p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
     
        <div class="flex justify-between items-start">
            <div>
                <p class="text-gray-500 font-medium">Total de Recomendações</p>
            </div>
            <div class="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
                
                <i class="fas fa-clipboard-check text-green-600 text-xl"></i>
                
            </div>
        </div>
        
    
        <div id="numero_absoluto_card_recomendacoes" class="text-4xl font-bold text-gray-900 mb-3 estatisticas_load">
            0
        </div>
        
        <!-- PORCENTAGEM COM SETA E TEXTO -->
        <div class="flex items-center gap-2">
            <i id="icone_card_recomendacoes" class="estatisticas_load text-lg"></i>
            <span id="numero_relatorio_card_recomendacoes" class="text-sm font-medium estatisticas_load">
                0
            </span>
        </div>
    </a>
</div>
<!-- <div class="my-4 w-full">
    <div id="grafico_projetos_spinner" class="text-center">
        <div role="status">
            <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>            
        </div>
    </div>
    <div class="w-full overflow-x-auto">
        <canvas id="grafico_projetos" class="hidden w-full h-auto"></canvas>
    </div>    
</div> -->
<!-- Gráfico de Evolução Anual de Projetos e Riscos -->
<div class="my-6 w-full">

    <!-- Spinner -->
    <div id="grafico_projetos_spinner"
         class="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <!-- spinner igual -->
    </div>

    <!-- Card do Gráfico -->
    <div class="relative w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 hidden"
         id="container_grafico_projetos">

        <!-- 🔵 TÍTULO AGORA DENTRO -->
        <div class="mb-4">
            <h3 class="text-lg font-bold text-gray-800">
                Evolução Anual de Projetos e Riscos
            </h3>
            <p class="text-xs text-gray-500 mt-1">
                Período:
                <span id="periodo_grafico"
                      class="font-medium text-gray-700"></span>
            </p>
        </div>

        <!-- Botão Toggle -->
        <div class="absolute top-6 right-6 z-10">
            <div class="toggle-wrapper">
                <button id="btn_projetos">
                    <span class="flex items-center gap-1.5">
                        <span class="dot dot-projetos"></span>
                        Projetos
                    </span>
                </button>

                <button id="btn_riscos">
                    <span class="flex items-center gap-1.5">
                        <span class="dot dot-riscos"></span>
                        Riscos Mapeados
                    </span>
                </button>
            </div>
        </div>

        <!-- Canvas -->
      <div class="w-full mt-4 h-[400px]">
    <canvas id="grafico_projetos"></canvas>
</div>
    </div>
</div>

<!-- SEÇÃO DOS GRÁFICOS DE PILARES E TÓPICOS -->
<div class="flex flex-col md:flex-row gap-6 w-full my-4">
    
    <!-- 🟦 CARD: Gráfico de Pilares (Grau de Conformidade) -->
    <div class="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <!-- Cabeçalho com Dropdown -->
        <div class="flex justify-between items-center mb-4">
            <div>
                <p class="text-gray-500 text-sm mb-1">Avaliação referente a:</p>
                <h3 class="text-xl font-bold text-gray-900">Grau de Conformidade dos Pilares</h3>
            </div>
            
            
            <div class="relative">
                <select id="select_periodo_pilares" class="block w-48 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Carregando...</option>
                </select>
            </div>
        </div>

        <!-- Spinner -->
        <div id="grafico_pilares_spinner" class="text-center py-12">
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        </div>
        
        <!-- Canvas do Gráfico -->
        <div class="w-full overflow-x-auto hidden" id="container_grafico_pilares">
            <canvas id="grafico_pilares" class="w-full h-auto" style="min-height: 350px;"></canvas>
        </div>
    </div>

    <!--  CARD: Gráfico de Tópicos -->
    <div class="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <!-- Cabeçalho com Dropdown -->
        <div class="flex justify-between items-center mb-4">
            <div>
                <p class="text-gray-500 text-sm mb-1">Maiores criticidades no Período</p>
                <h3 class="text-xl font-bold text-gray-900">Top 5 Riscos por Tópico</h3>
            </div>
            
            <!-- ✅ SELECT EXCLUSIVO PARA TÓPICOS -->
            <div class="relative">
                <select id="select_periodo_topicos" class="block w-48 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Carregando...</option>
                </select>
            </div>
        </div>

        <!-- Spinner -->
        <div id="grafico_topicos_spinner" class="text-center py-12">
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
        </div>
        
        <!-- Canvas do Gráfico -->
        <div class="w-full overflow-x-auto hidden px-4" id="container_grafico_topicos">
            <canvas id="grafico_topicos" class="w-full h-auto" style="min-height: 350px;"></canvas>
        </div>
    </div>
</div>
<div>
    <a class="mt-4 block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
        <div class="flex">
            <h4 class="me-4">Projetos - 5 últimos</h4>
            <svg id="spinner-tabela-projetos" aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
        </div>
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Nome
                        </th>
                        <th scope="col" class="px-6 py-3 hidden md:table-cell">
                            Responsável
                        </th>
                        <th scope="col" class="px-6 py-3 hidden md:table-cell">
                            Data de início
                        </th>
                        <th scope="col" class="px-6 py-3 hidden md:table-cell">
                            Data de conclusão
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody id="resultados_tabela_projetos"></tbody>
            </table>
        </div>

    </a>
</div>
@vite('resources/js/usuarios/estatisticas.js')
@endsection