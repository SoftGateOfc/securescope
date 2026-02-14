import { formatar_data, mesEAnoAtual, erro } from "../app";

$(".estatisticas_load").html(`<svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>`);
$("#resultados_tabela_projetos").empty();

// Variáveis globais para controle do gráfico de projetos/riscos
let graficoProjetosInstance = null;
let dadosGraficoProjetos = null;
let dadosGraficoRiscos = null;
let modoAtualGrafico = 'projetos'; 

function quebrarTextoEmLinhas(texto, maxCaracteres = 20) {
    if (!texto || texto.length <= maxCaracteres) {
        return [texto];
    }
    
    const palavras = texto.split(' ');
    const linhas = [];
    let linhaAtual = '';
    
    palavras.forEach(palavra => {
        const testaLinha = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
        
        if (testaLinha.length <= maxCaracteres) {
            linhaAtual = testaLinha;
        } else {
            if (linhaAtual) {
                linhas.push(linhaAtual);
            }
            linhaAtual = palavra;
        }
    });
    
    if (linhaAtual) {
        linhas.push(linhaAtual);
    }
    
    return linhas;
}

// Função auxiliar para detectar se está em mobile
function isMobile() {
    return window.innerWidth <= 768;
}

$(document).ready(function(){
    axios.get(app_url+'/usuarios/estatisticas')
        .then(response => {
            let dados = response.data;
            
            // CARDS DE ESTATÍSTICAS
            let qtd_projetos = dados.qtd_projetos_mes;
            let total_projetos_criados = dados.total_projetos_criados;
            let porcentagem_projetos = dados.percentual_projetos;
            $("#icone_card_projetos").html(direcao_seta(porcentagem_projetos));
            $("#numero_absoluto_card_projetos").html(total_projetos_criados.toLocaleString());
            $("#numero_relatorio_card_projetos").html(apresentacao_porcentagem_projetos(porcentagem_projetos));
            
            // VULNERABILIDADES
            let qtd_vulnerabilidades = dados.qtd_vulnerabilidades_mes;
            let total_vulnerabilidades_geral = dados.total_vulnerabilidades_geral;
            let porcentagem_vulnerabilidades = dados.percentual_vulnerabilidades;
            $("#icone_card_vulnerabilidades").html(direcao_seta_invertida(porcentagem_vulnerabilidades));
            $("#numero_absoluto_card_vulnerabilidades").html(total_vulnerabilidades_geral.toLocaleString());
            $("#numero_relatorio_card_vulnerabilidades").html(apresentacao_porcentagem_vulnerabilidades(porcentagem_vulnerabilidades));
            
            // RISCOS
            let qtd_riscos = dados.qtd_riscos_mes;
            let total_riscos_geral = dados.total_riscos_geral;
            let porcentagem_riscos = dados.percentual_riscos;
            $("#icone_card_riscos").html(direcao_seta_invertida(porcentagem_riscos));
            $("#numero_absoluto_card_riscos").html(total_riscos_geral.toLocaleString());
            $("#numero_relatorio_card_riscos").html(apresentacao_porcentagem_vulnerabilidades(porcentagem_riscos));
            
            // RECOMENDAÇÕES
            let qtd_recomendacoes = dados.qtd_recomendacoes_mes;
            let total_recomendacoes_geral = dados.total_recomendacoes_geral; 
            let porcentagem_recomendacoes = dados.percentual_recomendacoes;
            $("#icone_card_recomendacoes").html(direcao_seta(porcentagem_recomendacoes)); 
            $("#numero_absoluto_card_recomendacoes").html(total_recomendacoes_geral.toLocaleString()); 
            $("#numero_relatorio_card_recomendacoes").html(apresentacao_porcentagem_projetos(porcentagem_recomendacoes));
            
            // TABELA DE PROJETOS
            let lista_projetos = dados.lista_projetos;
            $("#spinner-tabela-projetos").hide();
            for (let i in lista_projetos) {
                let projeto = `<tr class="bg-white border-b border-gray-200">                        
                                <td class="px-6 py-4">
                                    ${lista_projetos[i].nome}
                                </td>
                                <td class="px-6 py-4 hidden md:table-cell">
                                    ${lista_projetos[i].criador}
                                </td>
                                <td class="px-6 py-4 hidden md:table-cell">                                    
                                    ${formatar_data(lista_projetos[i].data_inicio, false)}
                                </td>
                                <td class="px-6 py-4 hidden md:table-cell">
                                    ${formatar_data(lista_projetos[i].data_conclusao, false)}
                                </td>
                                <td class="px-6 py-4">
                                    ${badge_projeto(lista_projetos[i].status)}
                                </td>
                            </tr>`;
                $("#resultados_tabela_projetos").append(projeto);
            }
            
            // GRÁFICO DE PROJETOS E RISCOS (anual com toggle)
            dadosGraficoProjetos = dados.grafico_projetos;
            dadosGraficoRiscos = dados.grafico_riscos;
            definirPeriodoGrafico();
            renderizar_grafico_anual();
            atualizarEstiloBotoes();
            $("#grafico_projetos_spinner").hide();  
            $("#container_grafico_projetos").removeClass('hidden'); 
        })
        .catch(error => {
            erro(error);
        })
        .finally(() => {

        })
});

// Event listener para o botão de toggle
$(document).on('click', '#btn_projetos', function() {
    if (modoAtualGrafico === 'projetos') return;
    
    modoAtualGrafico = 'projetos';
    atualizarEstiloBotoes();
    renderizar_grafico_anual();
});

$(document).on('click', '#btn_riscos', function() {
    if (modoAtualGrafico === 'riscos') return; 
    
    modoAtualGrafico = 'riscos';
    atualizarEstiloBotoes();
    renderizar_grafico_anual();
});



function badge_projeto(status) {
    let badge = "";
    switch (status) {        
        case "Completo": badge = `<div class="completo">${status}</div>`; break;
        case "Em andamento": badge = `<div class="andamento">${status}</div>`; break;        
        default: badge = `<span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm ">${status}</span>`; break;
    }
    return badge;
}

function direcao_seta(numero) {
    let icone = "";
    if (numero > 0) {
        icone = `<img src="${window.app_url}/images/Seta_alto.png" alt="Seta para cima" class="w-4 h-4">`;
    } else if (numero < 0) {
        icone = `<img src="${window.app_url}/images/Seta_baixo.png" alt="Seta para baixo" class="w-4 h-4">`;
    } else {
        icone = `<i class="fa fa-minus"></i>`; 
    }
    return icone;
}

function direcao_seta_invertida(numero) {
    let icone = "";
    if (numero > 0) {
        
        icone = `<img src="${window.app_url}/images/Seta_baixo.png" alt="↓" class="w-4 h-4">`;
    } else if (numero < 0) {
     
        icone = `<img src="${window.app_url}/images/Seta_alto.png" alt="↑" class="w-4 h-4">`;
    } else {
        icone = `<span class="text-gray-400">—</span>`;
    }
    return icone;
}

function apresentacao_porcentagem_projetos(numero) {
    let valor_absoluto = Math.abs(numero).toFixed(2);
    
    if (numero > 0) {
        return `<span class="text-green-600">${valor_absoluto}%</span> <span class="text-gray-500">a mais que o mês anterior</span>`;
    } else if (numero < 0) {
        return `<span class="text-red-600">${valor_absoluto}%</span> <span class="text-gray-500">a menos que o mês anterior</span>`;
    } else {
        return `<span class="text-gray-500">Igual ao mês anterior</span>`;
    }
}

function apresentacao_porcentagem_vulnerabilidades(numero) {
    let valor_absoluto = Math.abs(numero).toFixed(2);
    
    if (numero > 0) {
        return `<span class="text-red-600">${valor_absoluto}%</span> <span class="text-gray-500">a mais que o mês anterior</span>`;
    } else if (numero < 0) {
        return `<span class="text-green-600">${valor_absoluto}%</span> <span class="text-gray-500">a menos que o mês anterior</span>`;
    } else {
        return `<span class="text-gray-500">Igual ao mês anterior</span>`;
    }
}
function atualizarEstiloBotoes() {
    $('#btn_projetos').toggleClass('ativo', modoAtualGrafico === 'projetos');
    $('#btn_riscos').toggleClass('ativo', modoAtualGrafico === 'riscos');
}

function renderizar_grafico_anual() {
    
    const canvas = document.getElementById('grafico_projetos');
    const ctx = canvas.getContext('2d');
    
    // Destrói gráfico anterior se existir
    if (graficoProjetosInstance) {
        graficoProjetosInstance.destroy();
    }
    
    // Verificação de segurança
    if (!dadosGraficoProjetos || !dadosGraficoRiscos) {
        console.error('❌ Dados não disponíveis para renderização!');
        return;
    }
    
function criarGradienteAzul(context) {
    const chart = context.chart;
    const {ctx, chartArea, scales} = chart;
    
    if (!chartArea) {
        return 'rgba(59, 130, 246, 0.3)';
    }
    
    const valores = dadosGraficoProjetos.quantidade;
    const valorMaximo = Math.max(...valores);
    
    const yScale = scales.y;
    const pixelMaximo = yScale.getPixelForValue(valorMaximo);
    const pixelZero = yScale.getPixelForValue(0);
    
    const gradiente = ctx.createLinearGradient(0, pixelMaximo, 0, pixelZero);
    gradiente.addColorStop(0, 'rgba(59, 130, 246, 0.7)');
    gradiente.addColorStop(0.3, 'rgba(59, 130, 246, 0.5)');
    gradiente.addColorStop(0.7, 'rgba(59, 130, 246, 0.25)');
    gradiente.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    return gradiente;
}

function criarGradienteVermelho(context) {
    const chart = context.chart;
    const {ctx, chartArea, scales} = chart;
    
    if (!chartArea) {
        return 'rgba(239, 68, 68, 0.3)';
    }
     
    const valores = dadosGraficoRiscos.quantidade;
    const valorMaximo = Math.max(...valores);
    
    const yScale = scales.y;
    const pixelMaximo = yScale.getPixelForValue(valorMaximo);
    const pixelZero = yScale.getPixelForValue(0);
    
    const gradiente = ctx.createLinearGradient(0, pixelMaximo, 0, pixelZero);
    gradiente.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
    gradiente.addColorStop(0.3, 'rgba(239, 68, 68, 0.5)');
    gradiente.addColorStop(0.7, 'rgba(239, 68, 68, 0.25)');
    gradiente.addColorStop(1, 'rgba(239, 68, 68, 0)');
    
    return gradiente;
}
    // Configurações dos datasets
    const datasets = [];
    
   if (modoAtualGrafico === 'projetos') {
    // LINHA ATIVA: PROJETOS
    datasets.push({
        label: 'Projetos',
        data: dadosGraficoProjetos.quantidade,
        borderColor: 'rgba(59, 130, 246, 0.9)',       
        backgroundColor: criarGradienteAzul,
        fill: true,
        tension: 0.4,
        borderWidth: 2,                                
        pointRadius: 3,                                
        pointBackgroundColor: 'rgba(59, 130, 246, 0.9)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,                           
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderWidth: 2,
        borderDash: []
    });
    
    // LINHA INATIVA: RISCOS
    datasets.push({
        label: 'Riscos Mapeados',
        data: dadosGraficoRiscos.quantidade,
        borderColor: 'rgba(239, 68, 68, 0.35)',       
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        borderWidth: 1.5,                            
        pointRadius: 0,                             
        pointBackgroundColor: 'rgba(239, 68, 68, 0.35)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 2,                         
        pointHoverBackgroundColor: 'rgba(239, 68, 68, 0.6)',
        pointHoverBorderWidth: 2,
        borderDash: [5, 5]
    });
} else {
    // LINHA INATIVA: PROJETOS
    datasets.push({
        label: 'Projetos',
        data: dadosGraficoProjetos.quantidade,
        borderColor: 'rgba(59, 130, 246, 0.35)',     
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        borderWidth: 1.5,                              
        pointRadius: 0,                              
        pointBackgroundColor: 'rgba(59, 130, 246, 0.35)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 2,                          
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 0.6)',
        pointHoverBorderWidth: 2,
        borderDash: [5, 5]
    });
    
    // LINHA ATIVA: RISCOS
    datasets.push({
        label: 'Riscos Mapeados',
        data: dadosGraficoRiscos.quantidade,
        borderColor: 'rgba(239, 68, 68, 0.9)',       
        backgroundColor: criarGradienteVermelho,
        fill: true,
        tension: 0.4,
        borderWidth: 2,                               
        pointRadius: 3,                              
        pointBackgroundColor: 'rgba(239, 68, 68, 0.9)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,                          
        pointHoverBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointHoverBorderWidth: 2,
        borderDash: []
    });
}
    
    graficoProjetosInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dadosGraficoProjetos.meses,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500',
                            family: 'Archivo'
                        },
                        color: '#6B7280'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.06)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: 'Archivo'
                        },
                        padding: 10,
                        precision: 0,
                        color: '#6B7280'
                    }
                }
            }
        }
    });
}

function definirPeriodoGrafico() {
    const hoje = new Date();
    
    // Calcula mês de início (atual - 5)
    const dataInicio = new Date(hoje);
    dataInicio.setMonth(dataInicio.getMonth() - 5);
    const mesInicio = dataInicio.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const anoInicio = dataInicio.getFullYear();
    
    // Calcula mês de fim (atual + 6)
    const dataFim = new Date(hoje);
    dataFim.setMonth(dataFim.getMonth() + 6);
    const mesFim = dataFim.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const anoFim = dataFim.getFullYear();
    
    // Exibe período no formato: Set/2025 – Ago/2026
    $('#periodo_grafico').text(`${mesInicio.charAt(0).toUpperCase() + mesInicio.slice(1)}/${anoInicio} – ${mesFim.charAt(0).toUpperCase() + mesFim.slice(1)}/${anoFim}`);
}

// ===========================================
// GRÁFICOS DASHBOARD
// ===========================================

let grafico_pilares_instance = null;
let grafico_topicos_instance = null;

// ===========================================
// 1. CARREGAR PERÍODOS DISPONÍVEIS
// ===========================================
function carregar_periodos_disponiveis() {
    axios.get(app_url + "/usuarios/periodos_disponiveis")
        .then(response => {
            const periodos = response.data;
            
            // ✅ POPULAR AMBOS OS SELECTS
            const select_pilares = $("#select_periodo_pilares");
            const select_topicos = $("#select_periodo_topicos");
            
            select_pilares.empty();
            select_topicos.empty();
            
            // Adicionar opções em ambos os selects
            periodos.forEach((periodo, index) => {
                const option = `<option value="${periodo.valor}" ${index === 0 ? 'selected' : ''}>${periodo.label}</option>`;
                select_pilares.append(option);
                select_topicos.append(option);
            });
            
            if (periodos.length > 0) {
                const primeiro_periodo = periodos[0].valor;
                
                if (primeiro_periodo === 'todos') {
                    // Carregar "Todos" para ambos
                    carregar_grafico_pilares('todos', 'todos');
                    carregar_grafico_topicos('todos', 'todos');
                } else {
                    // Carregar primeiro mês para ambos
                    const [ano, mes] = primeiro_periodo.split('-');
                    carregar_grafico_pilares(mes, ano);
                    carregar_grafico_topicos(mes, ano);
                }
            }
        })
        .catch(error => {
            console.error("Erro ao carregar períodos:", error);
        });
}

// ===========================================
// 2. EVENTO: MUDANÇA DE PERÍODO
// ===========================================
$(document).on('change', '#select_periodo_pilares', function() {
    const valor = $(this).val();
    
    // Mostrar spinner
    $("#grafico_pilares_spinner").show();
    $("#container_grafico_pilares").addClass('hidden');
    
    if (valor === 'todos') {
        carregar_grafico_pilares('todos', 'todos');
    } else {
        const [ano, mes] = valor.split('-');
        carregar_grafico_pilares(mes, ano);
    }
});

// Evento para o SELECT DE TÓPICOS
$(document).on('change', '#select_periodo_topicos', function() {
    const valor = $(this).val();
    
    // Mostrar spinner
    $("#grafico_topicos_spinner").show();
    $("#container_grafico_topicos").addClass('hidden');
    
    if (valor === 'todos') {
        carregar_grafico_topicos('todos', 'todos');
    } else {
        const [ano, mes] = valor.split('-');
        carregar_grafico_topicos(mes, ano);
    }
});
// ===========================================
// 3. CARREGAR DADOS DOS GRÁFICOS
// ===========================================
function carregar_grafico_pilares(mes, ano) {
    axios.post(app_url + "/usuarios/estatisticas_por_periodo", {
        mes: mes,
        ano: ano
    })
    .then(response => {
        const dados = response.data;
        
        renderizar_grafico_pilares_moderno(
            dados.grafico_pilares.pilares,
            dados.grafico_pilares.conformidade
        );
        
        // Ocultar spinner e mostrar gráfico
        $("#grafico_pilares_spinner").hide();
        $("#container_grafico_pilares").removeClass('hidden');
    })
    .catch(error => {
        console.error("Erro ao carregar gráfico de pilares:", error);
        erro(error);
        $("#grafico_pilares_spinner").hide();
    });
}

// Função para carregar APENAS o gráfico de TÓPICOS
function carregar_grafico_topicos(mes, ano) {
    axios.post(app_url + "/usuarios/estatisticas_por_periodo", {
        mes: mes,
        ano: ano
    })
    .then(response => {
        const dados = response.data;
        
        // Renderizar APENAS gráfico de tópicos
        renderizar_grafico_topicos_moderno(
            dados.grafico_topicos.topicos,
            dados.grafico_topicos.quantidade
        );
        
        // Ocultar spinner e mostrar gráfico
        $("#grafico_topicos_spinner").hide();
        $("#container_grafico_topicos").removeClass('hidden');
    })
    .catch(error => {
        console.error("Erro ao carregar gráfico de tópicos:", error);
        erro(error);
        $("#grafico_topicos_spinner").hide();
    });
}
// ===========================================
// 4. RENDERIZAR GRÁFICO DE PILARES 
// ===========================================
function renderizar_grafico_pilares_moderno(pilares, conformidade) {
    const ctx = document.getElementById('grafico_pilares').getContext('2d');

    if (grafico_pilares_instance) {
        grafico_pilares_instance.destroy();
    }

    const dadosOrdenados = pilares.map((nome, i) => ({
        nome,
        valor: conformidade[i]
    }))
    .sort((a, b) => b.valor - a.valor);

    const pilaresOrdenados = dadosOrdenados.map(d => d.nome);
    const conformidadeOrdenada = dadosOrdenados.map(d => d.valor);

    function corPorConformidade(valor) {
        if (valor <= 25) return '#191970';
        if (valor <= 50) return '#0404e2';
        if (valor <= 75) return '#0a5cb8';
        if (valor <= 90) return '#3b8eed';
        return '#00BFFF'; 
    }

    const coresDinamicas = conformidadeOrdenada.map(v => corPorConformidade(v));
    // =============================
    // CHART
    // =============================
    grafico_pilares_instance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pilaresOrdenados,
            datasets: [{
                label: 'Conformidade (%)',
                data: conformidadeOrdenada,
                backgroundColor: coresDinamicas,
                borderColor: coresDinamicas,
                borderRadius: 8,
                borderWidth: 0,
                barPercentage: 0.8,
                categoryPercentage: 0.9
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.parsed.x + '%'
                    }
                }
            },

            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: v => v + '%',
                        stepSize: 20
                    },
                    grid: {
                        color: '#f3f4f6'
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        autoSkip: false,
                        font: { size: 13 },
                        color: '#4b5563'
                    }
                }
            }
        }
    });
}

function renderizar_grafico_topicos_moderno(topicos, quantidade) {
    const ctx = document.getElementById('grafico_topicos').getContext('2d');
    
    // Destruir instância anterior se existir
    if (grafico_topicos_instance) {
        grafico_topicos_instance.destroy();
    }
    
const cores = [
    '#191970', 
    '#0404e2', 
    '#0a5cb8', 
    '#3b8eed',
    '#00BFFF'  
];

     const mobile = isMobile();
    
    // Ajustar configurações baseado no tamanho da tela
    const fontSizeLabel = mobile ? 11 : 14;
    const maxCaracteresPorLinha = mobile ? 10 : 12;
    const paddingLabel = mobile ? 8 : 6;
    
    
    grafico_topicos_instance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topicos,
            datasets: [{
                label: 'Quantidade de Riscos',
                data: quantidade,
                backgroundColor: cores,
                borderColor: cores,
                borderWidth: 0,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Riscos: ' + context.parsed.y;
                        }
                    }
                },
                  layout: {
                    padding: {
                        left: mobile ? 5 : 10,
                        right: mobile ? 5 : 10,
                        top: 10,
                        bottom: mobile ? 10 : 5
                    }
    }
                
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6'
                    },
                    ticks: {
                        stepSize: 5,
                        font: {
                            size: 12
                        }
                    }
                },
             x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: false,   
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: fontSizeLabel,         
                            family: 'Archivo'            
                        },
                        color: '#6b7280',
                        align: 'center',   
                        padding: paddingLabel,            
                        
                        callback: function(value, index) {
                            const label = this.getLabelForValue(value);
                            return quebrarTextoEmLinhas(label, maxCaracteresPorLinha);  
                        }
                    }
                }
                
            }
        }
    });
}

// ===========================================
// 6. INICIALIZAR AO CARREGAR PÁGINA
// ===========================================
$(document).ready(function() {
    if ($("#select_periodo_pilares").length > 0) {
        carregar_periodos_disponiveis();
    }
});

// ===========================================
// 7. RESPONSIVIDADE
// ===========================================
window.addEventListener('resize', () => {
    if (grafico_pilares_instance) {
        grafico_pilares_instance.resize();
    }
    if (grafico_topicos_instance) {
        grafico_topicos_instance.resize();
    }
});

function ajustarLarguraCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = 250;
    }
}

window.addEventListener('resize', () => {
    ajustarLarguraCanvas('grafico_pilares');
    ajustarLarguraCanvas('grafico_topicos');
});

// executar após carregamento inicial
ajustarLarguraCanvas('grafico_pilares');
ajustarLarguraCanvas('grafico_topicos');