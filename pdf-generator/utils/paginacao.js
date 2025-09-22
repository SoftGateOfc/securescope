/**
 * Sistema de Paginação Automática para PDFs
 *
 * Calcula automaticamente o número de páginas que cada seção ocupará
 * baseado no conteúdo e configurações de layout
 */

class PaginacaoManager {
    constructor() {
        // Configurações base para cálculo de páginas
        this.config = {
            // Linhas por página (considerando A4 com margens)
            linhasPorPagina: 35,

            // Caracteres por linha (aproximado para fonte Arial 12pt)
            caracteresPorLinha: 80,

            // Alturas estimadas em linhas para elementos fixos
            espacoTitulo: 4,
            espacoCabecalho: 3,
            espacoRodape: 2,
            espacoImagem: 8,
            espacoTabela: 2,
        };
    }

    /**
     * Calcula o número de páginas para cada seção
     * @param {Object} dados - Dados do relatório
     * @param {Object} dados_modelo - Dados do modelo/estatísticas
     * @returns {Object} Objeto com páginas de cada seção
     */
    calcularPaginasSumario(dados, dados_modelo) {
        const paginas = {
            capa: 1, // Capa sempre é 1 página
            sumario: 1, // Sumário sempre é 1 página
            objetivo: this.calcularPaginasObjetivo(dados),
            metodologia: this.calcularPaginasMetodologia(),
            panorama: this.calcularPaginasPanorama(dados),
            resumoExecutivo: this.calcularPaginasResumoExecutivo(dados_modelo),
            naoConformidades:
                this.calcularPaginasNaoConformidades(dados_modelo),
            recomendacoes: this.calcularPaginasRecomendacoes(dados_modelo),
        };

        // Calcular números de páginas acumulativos CORRETO
        const numeroPaginas = {};
        let paginaAtual = 1;

        // Capa = página 1
        numeroPaginas.capa = paginaAtual;
        paginaAtual += paginas.capa;

        // Sumário = página 2
        numeroPaginas.sumario = paginaAtual;
        paginaAtual += paginas.sumario;

        // Objetivo = página 3
        numeroPaginas.objetivo = paginaAtual;
        paginaAtual += paginas.objetivo;

        // Metodologia = próxima página
        numeroPaginas.metodologia = paginaAtual;
        paginaAtual += paginas.metodologia;

        // Panorama = próxima página
        numeroPaginas.panorama = paginaAtual;
        paginaAtual += paginas.panorama;

        // Resumo Executivo = próxima página
        numeroPaginas.resumoExecutivo = paginaAtual;
        paginaAtual += paginas.resumoExecutivo;

        // Não Conformidades = próxima página
        numeroPaginas.naoConformidades = paginaAtual;
        paginaAtual += paginas.naoConformidades;

        // Recomendações = próxima página
        numeroPaginas.recomendacoes = paginaAtual;

        return numeroPaginas;
    }

    /**
     * Calcula páginas da seção Objetivo
     */
    calcularPaginasObjetivo(dados) {
        const textoObjetivo = dados?.objetivo || "";
        const textoObservacoes = dados?.observacoes || "";

        const linhasObjetivo = this.calcularLinhasTexto(textoObjetivo);
        const linhasObservacoes = this.calcularLinhasTexto(textoObservacoes);

        const totalLinhas =
            linhasObjetivo +
            linhasObservacoes +
            this.config.espacoTitulo +
            this.config.espacoCabecalho * 2; // 2 seções

        return Math.ceil(totalLinhas / this.config.linhasPorPagina);
    }

    /**
     * Calcula páginas da seção Metodologia
     */
    calcularPaginasMetodologia() {
        // Metodologia tem conteúdo fixo: título + imagem dos pilares + texto explicativo
        const linhasFixas =
            this.config.espacoTitulo + this.config.espacoImagem + 5; // linhas de texto explicativo

        return Math.ceil(linhasFixas / this.config.linhasPorPagina);
    }

    /**
     * Calcula páginas da seção Panorama
     */
    calcularPaginasPanorama(dados) {
        const textoReferencias = dados?.referencias_proximas || "";
        const textoPanorama = dados?.panorama || "";

        const linhasTexto =
            this.calcularLinhasTexto(textoReferencias) +
            this.calcularLinhasTexto(textoPanorama);

        const totalLinhas =
            linhasTexto +
            this.config.espacoTitulo +
            this.config.espacoImagem + // imagem da área
            this.config.espacoCabecalho * 3; // 3 seções

        return Math.ceil(totalLinhas / this.config.linhasPorPagina);
    }

    /**
     * Calcula páginas do Resumo Executivo
     */
    calcularPaginasResumoExecutivo(dados_modelo) {
        const qtdPilares = Object.keys(
            dados_modelo?.total_pilares || {}
        ).length;

        // Cada pilar ocupa aproximadamente 3 linhas (círculo + texto)
        const linhasPilares = qtdPilares * 3;
        const totalLinhas = linhasPilares + this.config.espacoTitulo + 5; // margem

        return Math.ceil(totalLinhas / this.config.linhasPorPagina);
    }

    /**
     * Calcula páginas de Não Conformidades - VERSÃO REAL
     * Usa a mesma lógica da lista-paginada: 8 itens por página
     */
    calcularPaginasNaoConformidades(dados_modelo) {
        const respostas = dados_modelo?.respostas || [];
        const naoConformidades = respostas.filter(
            (r) => parseInt(r.vulnerabilidade) > 1
        );

        // Usar a mesma lógica da lista-paginada: 8 itens por página
        return Math.ceil(naoConformidades.length / 8);
    }

    /**
     * Calcula páginas de Recomendações - VERSÃO REAL
     * Usa a mesma lógica da lista-paginada: 8 itens por página
     */
    calcularPaginasRecomendacoes(dados_modelo) {
        const respostas = dados_modelo?.respostas || [];
        const naoConformidades = respostas.filter(
            (r) => parseInt(r.vulnerabilidade) > 1
        );
        const recomendacoes = naoConformidades.filter(
            (r) => r.recomendacao && r.recomendacao.trim() !== ""
        );

        // Usar a mesma lógica da lista-paginada: 8 itens por página
        return Math.ceil(recomendacoes.length / 8);
    }

    /**
     * Calcula quantas linhas um texto ocupará
     */
    calcularLinhasTexto(texto) {
        if (!texto || typeof texto !== "string") return 0;

        // Remover tags HTML se houver
        const textoLimpo = texto.replace(/<[^>]*>/g, "");

        // Contar quebras de linha manuais
        const linhasManuais = (textoLimpo.match(/\n/g) || []).length;

        // Contar linhas baseado na largura
        const caracteres = textoLimpo.length;
        const linhasCalculadas = Math.ceil(
            caracteres / this.config.caracteresPorLinha
        );

        return Math.max(linhasManuais + 1, linhasCalculadas);
    }

    /**
     * Função auxiliar para debug - mostra o cálculo detalhado
     */
    mostrarDetalhamento(dados, dados_modelo) {
        console.log("📄 DETALHAMENTO DA PAGINAÇÃO:");
        console.log("================================");

        const numeroPaginas = this.calcularPaginasSumario(dados, dados_modelo);

        Object.entries(numeroPaginas).forEach(([secao, pagina]) => {
            console.log(`${secao.padEnd(20)} : Página ${pagina}`);
        });

        return numeroPaginas;
    }
}

// Exportar uma instância única
const paginacaoManager = new PaginacaoManager();

module.exports = {
    PaginacaoManager,
    calcularPaginasSumario: (dados, dados_modelo) =>
        paginacaoManager.calcularPaginasSumario(dados, dados_modelo),
    mostrarDetalhamento: (dados, dados_modelo) =>
        paginacaoManager.mostrarDetalhamento(dados, dados_modelo),
};
