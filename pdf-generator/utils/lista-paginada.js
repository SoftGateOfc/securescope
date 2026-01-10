class ListaPaginada {
    constructor() {
        this.config = {
            itensPorPagina:7 ,
        };
    }

    /**
     * Função principal: pagina um vetor
     */
    paginarVetor(vetor, itensPorPagina = 7, paginaInicial = 8) {
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
     */
    processarNaoConformidades(respostas) {
        if (!Array.isArray(respostas) || respostas.length === 0) {
            return [];
        }

        // Filtrar só não conformidades (vulnerabilidade > 1)
        const naoConformidades = respostas.filter((resposta) => {
            const vulnerabilidade = parseInt(resposta.vulnerabilidade);
            return vulnerabilidade > 1;
        });

        if (naoConformidades.length === 0) {
            return [];
        }

        // Ordenar por criticidade
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
            return criticidadeB - criticidadeA;
        });

        // Renumerar sequencialmente após ordenação
        const naoConformidadesProcessadas = naoConformidadesOrdenadas.map(
            (item, indice) => {
                return {
                    pilar: item.pilar,
                    vulnerabilidade: item.vulnerabilidade,
                    topicos: item.topicos,
                    criticidade: item.criticidade,
                    recomendacao: item.recomendacao,
                    prioridade: item.prioridade,
                    nc: String(indice + 1).padStart(3, "0"),
                    naoConformidadeTexto: `${
                        item.topicos
                    } - ${this.nomearNivelVulnerabilidade(
                        item.vulnerabilidade
                    )}`,
                    ncOriginal: item.nc,
                    indiceOrdenado: indice,
                    posicaoOriginal: respostas.findIndex(
                        (r) =>
                            r.topicos === item.topicos &&
                            r.vulnerabilidade === item.vulnerabilidade
                    ),
                };
            }
        );

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
        const respostas = dadosRecebidos.dados_modelo?.respostas || [];

        if (respostas.length === 0) {
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "vazio",
            };
        }

        const naoConformidades = this.processarNaoConformidades(respostas);

        if (naoConformidades.length === 0) {
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "sem_nao_conformidades",
            };
        }

        const numeroPaginas = dadosRecebidos.numeroPaginas || {};
        const paginaInicial = this.calcularPaginaInicialLista(numeroPaginas);
        const paginasLista = this.paginarVetor(
            naoConformidades,
            this.config.itensPorPagina,
            paginaInicial
        );

        console.log(
            `📋 ${naoConformidades.length} não conformidades em ${paginasLista.length} páginas`
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
     */
    processarRecomendacoes(naoConformidadesProcessadas) {
        if (
            !Array.isArray(naoConformidadesProcessadas) ||
            naoConformidadesProcessadas.length === 0
        ) {
            return [];
        }

        const recomendacoes = naoConformidadesProcessadas.map((item) => {
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

        if (recomendacoes.length === 0) {
            return [];
        }

        const recomendacoesProcessadas = recomendacoes.map((item) => {
            return {
                pilar: item.pilar,
                vulnerabilidade: item.vulnerabilidade,
                topicos: item.topicos,
                recomendacao: item.recomendacao || "",
                criticidade: item.criticidade,
                prioridade: item.prioridade,
                nc: item.nc,
                recomendacaoTexto: (item.recomendacao || "").trim(),
                ncOriginal: item.ncOriginal,
                indiceOrdenado: item.indiceOrdenado,
                posicaoOriginal: item.posicaoOriginal,
            };
        });

        return recomendacoesProcessadas;
    }

    /**
     * Função principal para processar recomendações do Laravel para o relatório
     */
    processarRecomendacoesParaRelatorio(dadosRecebidos) {
        const respostas = dadosRecebidos.dados_modelo?.respostas || [];

        if (respostas.length === 0) {
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "vazio",
            };
        }

        const naoConformidadesProcessadas =
            this.processarNaoConformidades(respostas);

        if (naoConformidadesProcessadas.length === 0) {
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "sem_nao_conformidades",
            };
        }

        const recomendacoes = this.processarRecomendacoes(
            naoConformidadesProcessadas
        );

        if (recomendacoes.length === 0) {
            return {
                paginasLista: [],
                totalItens: 0,
                totalPaginas: 0,
                paginaInicial: 0,
                temLista: false,
                tipoLista: "sem_recomendacoes",
            };
        }

        const numeroPaginas = dadosRecebidos.numeroPaginas || {};
        const paginaInicialNaoConformidades =
            this.calcularPaginaInicialLista(numeroPaginas);
        const totalPaginasNaoConformidades = Math.ceil(
            naoConformidadesProcessadas.length / this.config.itensPorPagina
        );
        const paginaInicial =
            paginaInicialNaoConformidades + totalPaginasNaoConformidades;
        const paginasLista = this.paginarVetor(
            recomendacoes,
            this.config.itensPorPagina,
            paginaInicial
        );

        console.log(
            `💡 ${recomendacoes.length} recomendações em ${paginasLista.length} páginas`
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
