import { abrir_modal } from "../app";

$("#btn_modal_relatorio").click(function () {
    let formulario_id = $("#formulario_id").val();
    $("input[name='relatorio_formulario_id']").val(formulario_id);
    abrir_modal("modal_relatorio");
});

$("#panorama").val(panorama);

$("#modal_relatorio form").on("submit", function (e) {
    // Coletar todos os dados do formulário (incluindo arquivos)
    const formData = new FormData(this);

    console.log(
        "📋 PDF será gerado normalmente. PPTX será gerado em paralelo..."
    );

    setTimeout(() => {
        console.log("📤 Enviando dados para gerar PPTX...");

        axios
            .post("/formularios/gerar-pptx", formData, {
                responseType: "blob",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("✅ PPTX gerado com sucesso!");

                // Criar blob e fazer download automático
                const pptxBlob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                });
                const pptxUrl = window.URL.createObjectURL(pptxBlob);

                // Download automático
                const link = document.createElement("a");
                link.href = pptxUrl;
                link.download = `relatorio-${formData.get(
                    "relatorio_formulario_id"
                )}.pptx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                window.URL.revokeObjectURL(pptxUrl);

                console.log("💾 Download do PPTX iniciado automaticamente!");
            })
            .catch((error) => {
                console.error("❌ Erro ao gerar PPTX:", error);

                if (error.response) {
                    console.error("Status:", error.response.status);
                    console.error("Dados:", error.response.data);
                }

                alert(
                    "⚠️ O PDF foi gerado normalmente, mas houve erro ao gerar o PPTX. Verifique o console."
                );
            });
    }, 3000); // 3 segundos de espera
});
