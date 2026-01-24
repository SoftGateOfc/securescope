const express = require("express");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

// ===============================
// IMPORTS DE UTILIDADES
// ===============================
const {
    calcularPaginasSumario,
    mostrarDetalhamento,
} = require("./utils/paginacao");

const {
    processarNaoConformidadesParaRelatorio,
    processarRecomendacoesParaRelatorio,
} = require("./utils/lista-paginada");

// ===============================
// MIDDLEWARES
// ===============================
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(express.static("assets"));
app.use("/imagens", express.static(path.join(__dirname, "imagens")));

// ===============================
// EJS
// ===============================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

// ===============================
// ROTA DE TESTE
// ===============================
app.get("/", (req, res) => {
    res.json({
        status: "PDF Generator Online",
        timestamp: moment().format("DD/MM/YYYY HH:mm:ss"),
    });
});

// ===============================
// FUNÇÕES AUXILIARES
// ===============================
function imageToBase64(imagePath) {
    try {
        if (fs.existsSync(imagePath)) {
            const imageData = fs.readFileSync(imagePath);
            const base64 = Buffer.from(imageData).toString("base64");
            const ext = path.extname(imagePath).toLowerCase();

            let mimeType = "image/jpeg";
            if (ext === ".png") mimeType = "image/png";
            else if (ext === ".gif") mimeType = "image/gif";
            else if (ext === ".webp") mimeType = "image/webp";

            return `data:${mimeType};base64,${base64}`;
        }
        return null;
    } catch (err) {
        console.error("❌ Erro ao converter imagem:", err);
        return null;
    }
}

// ⚠️ Mantido base64 por enquanto (igual ao exemplo)
function carregarImagensEstaticas(dados) {
    if (!dados.imagens) dados.imagens = {};

    const imagensEstaticas = {
        cidade: ["cidade.jpg", "cidade.jpeg", "cidade.png"],
        pilares: ["pilares.jpg", "pilares.jpeg", "pilares.png"],
        pessoas: ["pessoas.jpg", "pessoas.jpeg", "pessoas.png"],
        tecnologia: ["tecnologia.jpg", "tecnologia.jpeg", "tecnologia.png"],
        gestao: ["gestao.jpg", "gestao.jpeg", "gestao.png"],
        informacoes: ["informacoes.jpg", "informacoes.jpeg", "informacoes.png"],
        processos: ["processos.jpg", "processos.jpeg", "processos.png"],
        logo_empresa: ["logo.png", "logo.jpg", "logo.jpeg"],
    };

    for (const [nomeImagem, arquivos] of Object.entries(imagensEstaticas)) {
        // ✅ SÓ CARREGA SE A IMAGEM NÃO EXISTIR (ou for null)
        if (dados.imagens[nomeImagem]) {
            console.log(`✅ ${nomeImagem} já existe (vinda do Laravel)`);
            continue;
        }

        let encontrado = false;

        for (const arquivo of arquivos) {
            const caminho = path.join(__dirname, "imagens", arquivo);

            if (fs.existsSync(caminho)) {
                console.log(`✅ ${nomeImagem} carregada da pasta local`);
                dados.imagens[nomeImagem] = imageToBase64(caminho);
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            console.warn(`⚠️ ${nomeImagem} não encontrada em lugar nenhum`);
            dados.imagens[nomeImagem] = null;
        }
    }

    return dados;
}

// ===============================
// ROTA PRINCIPAL - GERAR PDF
// ===============================
app.post("/generate-pdf", async (req, res) => {
    let browser;

    try {
        console.log("📨 Recebendo dados para PDF...");
        const dados = req.body;

        carregarImagensEstaticas(dados);

        const numeroPaginas = calcularPaginasSumario(
            dados.dados,
            dados.dados_modelo
        );

        const dadosLista = processarNaoConformidadesParaRelatorio({
            ...dados,
            numeroPaginas,
        });

        const dadosListaRecomendacoes =
            processarRecomendacoesParaRelatorio({
                ...dados,
                numeroPaginas,
            });

        const dadosProcessados = {
            ...dados,
            numeroPaginas,
            dadosLista,
            dadosListaRecomendacoes,
            dataGeracao: moment().format("DD/MM/YYYY HH:mm:ss"),
            timestamp: Date.now(),
        };

        // Renderizar HTML
        const html = await ejs.renderFile(
            path.join(__dirname, "templates", "relatorio.ejs"),
            dadosProcessados
        );

        // Pasta temporária
        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const outputPath = path.join(
            tempDir,
            `relatorio-${Date.now()}.pdf`
        );

        // Puppeteer
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                "--disable-features=VizDisplayCompositor",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: "networkidle0",
            timeout: 60000,
        });

        // ✅ GERAR PDF EM ARQUIVO
        await page.pdf({
            path: outputPath,
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

        console.log("✅ PDF gerado:", outputPath);

        // Download
        res.download(outputPath, "relatorio.pdf", (err) => {
            if (err) {
                console.error("❌ Erro no download:", err);
            }

            // Cleanup
            fs.unlink(outputPath, () => {});
        });
    } catch (error) {
        if (browser) await browser.close();

        console.error("❌ Erro ao gerar PDF:", error);
        res.status(500).json({
            error: "Erro ao gerar PDF",
            message: error.message,
        });
    }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
});

module.exports = app;
