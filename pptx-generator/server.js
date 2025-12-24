const express = require("express");
const path = require("path");
const moment = require("moment");
const { spawn } = require("child_process");

const app = express();
const PORT = 3002;
const HOST = "0.0.0.0";

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.json({
        status: "PPTX Generator Online",
        timestamp: moment().format("DD/MM/YYYY HH:mm:ss"),
    });
});

app.post("/generate-pptx", async (req, res) => {
    try {
        const dados = req.body;

        const pythonScript = path.resolve("./generate_ppt.py");
        const python = spawn("python", [pythonScript], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        let pptxBuffer = Buffer.alloc(0);
        let errorOutput = "";

        python.stdin.write(JSON.stringify(dados), "utf8");
        python.stdin.end();

        python.stdout.on("data", (chunk) => {
            pptxBuffer = Buffer.concat([pptxBuffer, chunk]);
        });

        python.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        python.on("close", (code) => {
            if (code !== 0) {
                console.error("Erro:", errorOutput);
                return res.status(500).json({ error: errorOutput });
            }

            res.set({
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "Content-Disposition": 'inline; filename="relatorio.pptx"',
            });

            res.send(pptxBuffer);
        });

        python.on("error", (error) => {
            console.error("Erro:", error);
            res.status(500).json({ error: error.message });
        });
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, HOST, () => {
});
