const express = require("express");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.static("assets"));

// Configurar EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

// Rota de teste
app.get("/", (req, res) => {
    res.json({
        status: "PDF Generator Online",
        timestamp: moment().format("DD/MM/YYYY HH:mm:ss"),
    });
});

// Rota principal para gerar PDF
app.post("/generate-pdf", async (req, res) => {
    try {
        console.log("📨 Recebendo dados para PDF...");

        const dados = req.body;

        // Processar dados (por enquanto só passamos direto)
        const dadosProcessados = {
            ...dados,
            dataGeracao: moment().format("DD/MM/YYYY HH:mm:ss"),
            timestamp: Date.now(),
        };

        console.log("🎨 Renderizando template EJS...");

        // Renderizar template EJS
        const html = await ejs.renderFile(
            path.join(__dirname, "templates", "relatorio.ejs"),
            dadosProcessados
        );

        console.log("📄 Gerando PDF com Puppeteer...");

        // Gerar PDF com Puppeteer
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // Configurar página para PDF
        await page.setContent(html, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        // Gerar PDF
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "1cm",
                right: "1cm",
                bottom: "1cm",
                left: "1cm",
            },
        });

        await browser.close();

        console.log("✅ PDF gerado com sucesso!");

        // Retornar PDF
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="relatorio.pdf"',
            "Content-Length": pdf.length,
        });

        res.send(pdf);
    } catch (error) {
        console.error("❌ Erro ao gerar PDF:", error);
        res.status(500).json({
            error: "Erro ao gerar PDF",
            details: error.message,
        });
    }
});

// Rota de teste com dados mock
app.get("/test-pdf", async (req, res) => {
    try {
        console.log("🧪 Iniciando teste de PDF...");

        // Dados de teste simulando o que vem do Laravel
        const dadosMock = {
            dados: {
                nome_empresa: "Empresa Teste LTDA",
                nome_cliente: "Cliente Exemplo",
                objetivo: "Análise de segurança do ambiente",
                observacoes: "Observações importantes sobre o projeto",
                localizacao_analise: "São Paulo, SP - Brasil",
                referencias_proximas: "Centro da cidade, próximo ao shopping",
                panorama: "Situação de risco médio identificada",
            },
            dados_modelo: {
                total_perguntas_respondidas: 25,
                total_pilares: {
                    Pessoas: 5,
                    Tecnologia: 8,
                    Processos: 4,
                    Informação: 3,
                    Gestão: 5,
                },
                porcentagem_pilar: {
                    Pessoas: 20,
                    Tecnologia: 32,
                    Processos: 16,
                    Informação: 12,
                    Gestão: 20,
                },
            },
            imagens: {
                logo_empresa:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
                logo_cliente:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
                imagem_area:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
            },
        };

        // Processar dados
        const dadosProcessados = {
            ...dadosMock,
            dataGeracao: moment().format("DD/MM/YYYY HH:mm:ss"),
            timestamp: Date.now(),
        };

        console.log("🎨 Renderizando template EJS...");

        // Renderizar template EJS
        const html = await ejs.renderFile(
            path.join(__dirname, "templates", "relatorio.ejs"),
            dadosProcessados
        );

        console.log("📄 Gerando PDF com Puppeteer...");

        // Gerar PDF com Puppeteer
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // Configurar página para PDF
        await page.setContent(html, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

        // Gerar PDF
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "1cm",
                right: "1cm",
                bottom: "1cm",
                left: "1cm",
            },
        });

        await browser.close();

        console.log("✅ PDF gerado com sucesso!");

        // Retornar PDF
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="teste-relatorio.pdf"',
            "Content-Length": pdf.length,
        });

        res.send(pdf);
    } catch (error) {
        console.error("❌ Erro no teste:", error);
        res.status(500).json({
            error: "Erro no teste de PDF",
            details: error.message,
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 PDF Generator rodando em http://localhost:${PORT}`);
    console.log(`📄 Teste: http://localhost:${PORT}/test-pdf`);
});

module.exports = app;
