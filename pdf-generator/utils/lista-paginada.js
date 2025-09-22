class ListaPaginada {
    constructor() {
        this.config = {
            itensPorPagina: 8,
        };
    }

    /**
     * Função principal: pagina um vetor
     */
    paginarVetor(vetor, itensPorPagina = 8, paginaInicial = 8) {
        if (!Array.isArray(vetor) || vetor.length === 0) {
            return [];
        }

        const paginas = [];
        const totalPaginas = Math.ceil(vetor.length / itensPorPagina);

        for (let i = 0; i < vetor.length; i += itensPorPagina) {
            const paginaAtual = Math.floor(i / itensPorPagina);
            const numeroPaginaReal = paginaInicial + paginaAtual;

            paginas.push({
                itens: vetor.slice(i, i + itensPorPagina),
                numeroPagina: paginaAtual + 1,
                numeroPaginaReal: numeroPaginaReal,
                numeroPaginaExibicao: numeroPaginaReal,
                totalPaginas: totalPaginas,
                indiceInicio: i + 1,
                indiceFim: Math.min(i + itensPorPagina, vetor.length),
                totalItens: vetor.length,
                ehPrimeiraPagina: paginaAtual === 0,
                ehUltimaPagina: paginaAtual === totalPaginas - 1,
            });
        }

        return paginas;
    }

    /**
     * @param {number|string} vulnerabilidade - Nível de vulnerabilidade
     * @returns {string} Nome descritivo do nível de vulnerabilidade como está no formulario
     */
    nomearNivelVulnerabilidade(vulnerabilidade) {
        const nivel = parseInt(vulnerabilidade);

        switch (nivel) {
            case 2:
                return "Atende após ajustes";
            case 3:
                return "Atende após ajustes médios";
            case 4:
                return "Não atende";
            case 5:
                return "Não existe";
            default:
                return `nível ${vulnerabilidade}`;
        }
    }

    /**
     * Processa não conformidades que JÁ VEM processadas do Laravel
     * Filtra, ordena por criticidade e renumera sequencialmente
     * @param {Array} respostas - Array de respostas do Laravel (já processadas)
     * @returns {Array} Array de não conformidades paginadas
     */
    processarNaoConformidades(respostas) {
        if (!Array.isArray(respostas) || respostas.length === 0) {
            console.log("📋 Sem respostas para processar não conformidades");
            return [];
        }

        console.log(
            `📋 Processando ${respostas.length} respostas do Laravel...`
        );

        // PASSO 1: Filtrar só não conformidades (vulnerabilidade > 1)
        const naoConformidades = respostas.filter((resposta) => {
            const vulnerabilidade = parseInt(resposta.vulnerabilidade);
            return vulnerabilidade > 1;
        });

        console.log(
            `📋 Filtradas ${naoConformidades.length} não conformidades (vulnerabilidade > 1)`
        );

        // DEBUG: Mostrar todas as criticidades encontradas
        const criticidadesEncontradas = [
            ...new Set(naoConformidades.map((item) => item.criticidade)),
        ];
        console.log(
            `📋 Criticidades encontradas: ${criticidadesEncontradas.join(", ")}`
        );

        if (naoConformidades.length === 0) {
            return [];
        }

        // PASSO 2: Ordenar por criticidade
        const ordemCriticidade = {
            "vermelho-escuro": 5,
            laranja: 4,
            amarelo: 3,
            "verde-escuro": 2,
            "verde-claro": 1,
        };

        const naoConformidadesOrdenadas = naoConformidades.sort((a, b) => {
            const criticidadeA = ordemCriticidade[a.criticidade] || 0;
            const criticidadeB = ordemCriticidade[b.criticidade] || 0;

            // Se alguma criticidade não foi encontrada no mapeamento, avisar
            if (criticidadeA === 0) {
                console.log(`⚠️  Criticidade não mapeada: "${a.criticidade}"`);
            }
            if (criticidadeB === 0) {
                console.log(`⚠️  Criticidade não mapeada: "${b.criticidade}"`);
            }

            return criticidadeB - criticidadeA; // Maior criticidade primeiro
        });

        console.log(`📋 Ordenação por criticidade aplicada:`);
        naoConformidadesOrdenadas.slice(0, 5).forEach((item, index) => {
            console.log(
                `   ${index + 1}. ${item.criticidade} - ${item.topicos}`
            );
        });
        if (naoConformidadesOrdenadas.length > 5) {
            console.log(
                `   ... e mais ${naoConformidadesOrdenadas.length - 5} itens`
            );
        }

        // PASSO 3: RENUMERAR sequencialmente após ordenação
        const naoConformidadesProcessadas = naoConformidadesOrdenadas.map(
            (item, indice) => {
                return {
                    // === DADOS QUE O LARAVEL JÁ ENVIA ===
                    pilar: item.pilar,
                    vulnerabilidade: item.vulnerabilidade,
                    topicos: item.topicos,
                    criticidade: item.criticidade,
                    recomendacao: item.recomendacao,
                    prioridade: item.prioridade,

                    // === DADOS PROCESSADOS PARA O TEMPLATE ===
                    nc: String(indice + 1).padStart(3, "0"), // NC sequencial após ordenação: 001, 002, 003...
                    naoConformidadeTexto: `${
                        item.topicos
                    } - ${this.nomearNivelVulnerabilidade(
                        item.vulnerabilidade
                    )}`,

                    // === DADOS EXTRAS PARA DEBUG ===
                    ncOriginal: item.nc, // NC original do Laravel
                    indiceOrdenado: indice,
                    posicaoOriginal: respostas.findIndex(
                        (r) =>
                            r.topicos === item.topicos &&
                            r.vulnerabilidade === item.vulnerabilidade
                    ), // Para debug: onde estava originalmente
                };
            }
        );

        // Debug: mostrar estatísticas detalhadas
        console.log(`📋 Não conformidades processadas e renumeradas:`);
        console.log(`   - Total: ${naoConformidadesProcessadas.length}`);

        const contagemCriticidade = {};
        naoConformidadesProcessadas.forEach((item) => {
            contagemCriticidade[item.criticidade] =
                (contagemCriticidade[item.criticidade] || 0) + 1;
        });

        // Mostrar contagem na ordem de criticidade
        const ordemExibicao = [
            "Extremo",
            "Alto",
            "Médio",
            "Baixo",
            "Muito Baixo",
        ];
        ordemExibicao.forEach((criticidade) => {
            if (contagemCriticidade[criticidade]) {
                console.log(
                    `   - ${criticidade}: ${contagemCriticidade[criticidade]} itens`
                );
            }
        });

        // Debug: mostrar primeiros 3 NCs atribuídos
        console.log(`📋 Exemplo de NCs atribuídos:`);
        naoConformidadesProcessadas.slice(0, 3).forEach((item) => {
            console.log(
                `   NC ${item.nc}: ${item.criticidade} - ${item.topicos}`
            );
        });

        return naoConformidadesProcessadas;
    }

    /**
     * Calcular qual página começa a lista baseado nas páginas existentes
     */
    calcularPaginaInicialLista(numeroPaginas) {
        const paginas = [
            numeroPaginas.capa || 1,
            numeroPaginas.sumario || 2,
            numeroPaginas.objetivo || 3,
            numeroPaginas.metodologia || 4,
            numeroPaginas.panorama || 5,
            numeroPaginas.resumoExecutivo || 7,
        ];

        const ultimaPagina = Math.max(...paginas.filter((p) => p > 0));
        return ultimaPagina + 1;
    }

    /**
     * Função principal para processar não conformidades do Laravel para o relatório
     */
    processarNaoConformidadesParaRelatorio(dadosRecebidos) {
        console.log("📋 Processando não conformidades para relatório...");

        // Pegar respostas que JÁ VEM processadas do Laravel
        const respostas = dadosRecebidos.dados_modelo?.respostas || [];

        if (respostas.length === 0) {
            console.log("📋 Sem respostas encontradas nos dados recebidos");
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "vazio",
            };
        }

        // Processar não conformidades (filtrar + ordenar + renumerar)
        const naoConformidades = this.processarNaoConformidades(respostas);

        if (naoConformidades.length === 0) {
            console.log(
                "📋 Nenhuma não conformidade encontrada (todas são nível 1)"
            );
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "sem_nao_conformidades",
            };
        }

        // Calcular paginação
        const numeroPaginas = dadosRecebidos.numeroPaginas || {};
        const paginaInicial = this.calcularPaginaInicialLista(numeroPaginas);
        const paginasLista = this.paginarVetor(
            naoConformidades,
            this.config.itensPorPagina,
            paginaInicial
        );

        console.log(`📋 Não conformidades paginadas:`);
        console.log(`   - ${naoConformidades.length} itens no total`);
        console.log(`   - ${paginasLista.length} páginas geradas`);
        console.log(`   - Começa na página ${paginaInicial}`);
        console.log(
            `   - Primeira página contém NCs: ${
                paginasLista[0]?.itens.map((item) => item.nc).join(", ") ||
                "nenhum"
            }`
        );

        return {
            paginasLista: paginasLista,
            totalItens: naoConformidades.length,
            totalPaginas: paginasLista.length,
            paginaInicial: paginaInicial,
            temLista: true,
            tipoLista: "naoConformidades",
        };
    }

    /**
     * Processa recomendações usando a ordenação já estabelecida pelas não conformidades
     * Filtra itens com recomendação preenchida e mantém a ordem dos NCs
     * @param {Array} naoConformidadesProcessadas - Array já processado e ordenado por criticidade
     * @returns {Array} Array de recomendações ordenadas pelos NCs
     */
    processarRecomendacoes(naoConformidadesProcessadas) {
        if (
            !Array.isArray(naoConformidadesProcessadas) ||
            naoConformidadesProcessadas.length === 0
        ) {
            console.log(
                "📋 Sem não conformidades processadas para extrair recomendações"
            );
            return [];
        }

        console.log(
            `📋 Processando recomendações baseado em ${naoConformidadesProcessadas.length} não conformidades...`
        );

        // PASSO 1: Filtrar só itens com recomendação preenchida
        const recomendacoes = naoConformidadesProcessadas.map((item) => {
            // Se não tem recomendação ou está vazia, usar texto padrão
            if (
                !item.recomendacao ||
                typeof item.recomendacao !== "string" ||
                item.recomendacao.trim() === ""
            ) {
                return {
                    ...item,
                    recomendacao: "Sem recomendação prevista",
                    recomendacaoTexto: "Sem recomendação prevista",
                };
            }

            return item;
        });

        console.log(
            `📋 Filtradas ${recomendacoes.length} recomendações (com texto preenchido)`
        );

        if (recomendacoes.length === 0) {
            return [];
        }

        // PASSO 2: Processar recomendações mantendo ordem dos NCs
        const recomendacoesProcessadas = recomendacoes.map((item) => {
            return {
                // === DADOS QUE O LARAVEL JÁ ENVIA ===
                pilar: item.pilar,
                vulnerabilidade: item.vulnerabilidade,
                topicos: item.topicos,
                recomendacao: item.recomendacao || "",
                criticidade: item.criticidade,
                prioridade: item.prioridade,

                // === DADOS PROCESSADOS PARA O TEMPLATE ===
                nc: item.nc,
                recomendacaoTexto: (item.recomendacao || "").trim(),

                // === DADOS EXTRAS PARA DEBUG ===
                ncOriginal: item.ncOriginal,
                indiceOrdenado: item.indiceOrdenado,
                posicaoOriginal: item.posicaoOriginal,
            };
        });

        // Debug: mostrar estatísticas detalhadas
        console.log(`📋 Recomendações processadas:`);
        console.log(`   - Total: ${recomendacoesProcessadas.length}`);

        const contagemPrioridade = {};
        recomendacoesProcessadas.forEach((item) => {
            contagemPrioridade[item.prioridadeTexto] =
                (contagemPrioridade[item.prioridadeTexto] || 0) + 1;
        });

        // Mostrar contagem na ordem de prioridade
        const ordemExibicao = ["Curto Prazo", "Médio Prazo", "Longo Prazo"];
        ordemExibicao.forEach((prioridade) => {
            if (contagemPrioridade[prioridade]) {
                console.log(
                    `   - ${prioridade}: ${contagemPrioridade[prioridade]} itens`
                );
            }
        });

        // Debug: mostrar primeiros 3 NCs e suas prioridades
        console.log(`📋 Exemplo de Recomendações com prioridades:`);
        recomendacoesProcessadas.slice(0, 3).forEach((item) => {
            console.log(
                `   NC ${item.nc}: ${item.prioridadeBadge} (${item.prioridadeTexto}) - ${item.topicos}`
            );
        });

        return recomendacoesProcessadas;
    }

    /**
     * Função principal para processar recomendações do Laravel para o relatório
     */
    processarRecomendacoesParaRelatorio(dadosRecebidos) {
        console.log("📋 Processando recomendações para relatório...");

        // PASSO 1: Primeiro processar não conformidades (para ter a ordenação)
        const respostas = dadosRecebidos.dados_modelo?.respostas || [];

        if (respostas.length === 0) {
            console.log("📋 Sem respostas encontradas nos dados recebidos");
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "vazio",
            };
        }

        // Processar não conformidades primeiro (para obter a ordenação)
        const naoConformidadesProcessadas =
            this.processarNaoConformidades(respostas);

        if (naoConformidadesProcessadas.length === 0) {
            console.log(
                "📋 Nenhuma não conformidade encontrada para extrair recomendações"
            );
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "sem_nao_conformidades",
            };
        }

        // PASSO 2: Processar recomendações baseado na ordenação das não conformidades
        const recomendacoes = this.processarRecomendacoes(
            naoConformidadesProcessadas
        );

        if (recomendacoes.length === 0) {
            console.log(
                "📋 Nenhuma recomendação encontrada (nenhum item tem recomendação preenchida)"
            );
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "sem_recomendacoes",
            };
        }

        // PASSO 3: Calcular paginação
        const numeroPaginas = dadosRecebidos.numeroPaginas || {};
        const paginaInicialNaoConformidades =
            this.calcularPaginaInicialLista(numeroPaginas);

        // Calcular quantas páginas as não conformidades ocuparam
        const totalPaginasNaoConformidades = Math.ceil(
            naoConformidadesProcessadas.length / this.config.itensPorPagina
        );

        // Recomendações começam onde não conformidades terminaram
        const paginaInicial =
            paginaInicialNaoConformidades + totalPaginasNaoConformidades;

        const paginasLista = this.paginarVetor(
            recomendacoes,
            this.config.itensPorPagina,
            paginaInicial
        );

        console.log(`📋 Recomendações paginadas:`);
        console.log(`   - ${recomendacoes.length} itens no total`);
        console.log(`   - ${paginasLista.length} páginas geradas`);
        console.log(`   - Começa na página ${paginaInicial}`);
        console.log(
            `   - Primeira página contém NCs: ${
                paginasLista[0]?.itens.map((item) => item.nc).join(", ") ||
                "nenhum"
            }`
        );

        return {
            paginasLista: paginasLista,
            totalItens: recomendacoes.length,
            totalPaginas: paginasLista.length,
            paginaInicial: paginaInicial,
            temLista: true,
            tipoLista: "recomendacoes",
        };
    }
}

// Exportar uma instância única
const listaPaginada = new ListaPaginada();

module.exports = {
    ListaPaginada,
    processarNaoConformidadesParaRelatorio: (dadosRecebidos) =>
        listaPaginada.processarNaoConformidadesParaRelatorio(dadosRecebidos),
    processarRecomendacoesParaRelatorio: (dadosRecebidos) =>
        listaPaginada.processarRecomendacoesParaRelatorio(dadosRecebidos),
};
