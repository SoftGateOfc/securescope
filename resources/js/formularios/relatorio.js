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

    setTimeout(() => {

        axios
            .post("/formularios/gerar-pptx", formData, {
                responseType: "blob",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
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

            })
            .catch((error) => {
                console.error(" Erro ao gerar PPTX:", error);

                if (error.response) {
                    console.error("Status:", error.response.status);
                    console.error("Dados:", error.response.data);
                }

                alert(
                    " Erro ao gerar o Powerpoint. Tente novamente! \nEm caso de persistencia, informe-nos."
                );
            });
    }, 3000); 
});
