import axios from "axios";
import { abrir_modal, erro, fechar_modal, habilitar_botao, sucesso } from "../app";

$(".responder-pergunta").click(function () {
    let pergunta = $(this).attr('pergunta');
    $("#btn_salvar_respostas").attr('pergunta', pergunta);
    let formulario = $("#formulario_id").val();
    if(online == false){
        badge_adequacao(false);
        badge_prazo(false);
        badge_risco_altissimo(false);
        $("input[name='adequacao']").prop('checked', false);
        $("input[name='probabilidade']").prop('checked', false);
        $("input[name='impacto']").prop('checked', false);
        $("input[name='esforco']").prop('checked', false);
        $("input[name='valor']").prop('checked', false);
        $("#resposta").val("");
        abrir_modal("modal_dados_formulario");
        return;
    }
    axios.get(`${app_url}/respostas/detalhes_resposta/${formulario}/${pergunta}`)
        .then(response => {
            let pergunta = response.data.pergunta;
            let resposta = response.data.resposta;
            $("#titulo_pergunta").html(pergunta.titulo);
            if (resposta == null) {
                badge_adequacao(false);
                badge_prazo(false);
                badge_risco_altissimo(false);
                $("input[name='adequacao']").prop('checked', false);
                $("input[name='probabilidade']").prop('checked', false);
                $("input[name='impacto']").prop('checked', false);
                $("input[name='esforco']").prop('checked', false);
                $("input[name='valor']").prop('checked', false);
                $("#resposta").val("");
            } else {
                $(`input[name='adequacao'][value='${resposta.nivel_adequacao}']`).prop("checked", true);
                badge_adequacao();
                $(`input[name='probabilidade'][value='${resposta.nivel_probabilidade}']`).prop("checked", true);
                $(`input[name='impacto'][value='${resposta.nivel_impacto}']`).prop("checked", true);
                badge_risco_altissimo();
                $(`input[name='esforco'][value='${resposta.nivel_esforco}']`).prop("checked", true);
                $(`input[name='valor'][value='${resposta.nivel_valor}']`).prop("checked", true);
                badge_prazo();
                $("#resposta").val(resposta.resposta);
            }
            abrir_modal("modal_dados_formulario");            
        })
        .catch(error => {
            erro(error);
        })
});

function badge_adequacao(mostrar = true) {
    if (!mostrar) {
        $("#adequado").hide();
        $("#vulneravel").hide();
        return;
    }
    let nivel = $("input[name='adequacao']:checked").val();     
    if (nivel >= vulnerabilidade) {
        $("#adequado").hide();
        $("#vulneravel").show();
    } else {
        $("#adequado").show();
        $("#vulneravel").hide();
    }
}

$("input[name='adequacao']").on('click', function () {
    badge_adequacao();
});

$("input[name='probabilidade']").on('click', function () {
    badge_risco_altissimo();
});

$("input[name='impacto']").on('click', function () {
    badge_risco_altissimo();
});

function badge_risco_altissimo(mostrar = true) {
    if (!mostrar) {
        $("#risco_altissimo").hide();
        return;
    }
    let probabilidade = $("input[name='probabilidade']:checked").val();
    let impacto = $("input[name='impacto']:checked").val();
    let multiplicacao = probabilidade * impacto;
    if (multiplicacao >= risco_altissimo) {
        $("#risco_altissimo").show();
    } else {
        $("#risco_altissimo").hide();
    }
}

$("input[name='esforco']").on('click', function () {
    badge_prazo();
});

$("input[name='valor']").on('click', function () {
    badge_prazo();
});

function badge_prazo(mostrar = true) {
    if (!mostrar) {
        $("#curto_prazo").hide();
        $("#medio_prazo").hide();
        $("#longo_prazo").hide();
        return;
    }
    let esforco = $("input[name='esforco']:checked").val();
    let valor = $("input[name='valor']:checked").val();
    let multiplicacao = esforco * valor;
    if (multiplicacao >= curto_prazo_minimo && multiplicacao <= curto_prazo_maximo) {
        $("#curto_prazo").show();
        $("#medio_prazo").hide();
        $("#longo_prazo").hide();
    }
    if (multiplicacao >= medio_prazo_minimo && multiplicacao <= medio_prazo_maximo) {
        $("#curto_prazo").hide();
        $("#medio_prazo").show();
        $("#longo_prazo").hide();
    }
    if (multiplicacao >= longo_prazo_minimo && multiplicacao <= longo_prazo_maximo) {
        $("#curto_prazo").hide();
        $("#medio_prazo").hide();
        $("#longo_prazo").show();
    }

}

// 1. Inicializar ou abrir o IndexedDB
let db;
let request = indexedDB.open("FormulariosDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("respostas")) {
        db.createObjectStore("respostas", { keyPath: "id", autoIncrement: true });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
};

request.onerror = function (event) {
    console.error("Erro ao abrir o IndexedDB", event);
};

/* $("#btn_salvar_respostas").click(async function () {
    habilitar_botao('btn_salvar_respostas', false);    
    if(online == false){
        let pergunta = $(this).attr('pergunta');
        let adequacao = $("input[name='adequacao']:checked").val() || 1;
        let probabilidade = $("input[name='probabilidade']:checked").val() || 1;
        let impacto = $("input[name='impacto']:checked").val() || 1;
        let esforco = $("input[name='esforco']:checked").val() || 1;
        let valor = $("input[name='valor']:checked").val() || 1;
        let resposta = $("#resposta").val();
        let formulario_id = $("#formulario_id").val();
        let fotoInput = document.getElementById("foto");
        let foto = fotoInput.files && fotoInput.files[0];

        // Converte a imagem para base64 (ou null)
        let fotoBase64 = await toBase64(foto);

        // 1. Salva localmente no IndexedDB
        let dadosResposta = {
            timestamp: new Date().toISOString(),
            formulario_id,
            pergunta_id: pergunta,
            adequacao,
            probabilidade,
            impacto,
            esforco,
            valor,
            resposta,
            fotoBase64
        };

        try {
            let tx = db.transaction(["respostas"], "readwrite");
            let store = tx.objectStore("respostas");
            store.add(dadosResposta);

            tx.oncomplete = function () {            
                sucesso("Resposta salva localmente!");
            };

            tx.onerror = function (event) {
                erro("Erro ao salvar localmente");
                console.error("Erro ao salvar no IndexedDB:", event);
            };
        } catch (e) {
            erro("Erro ao salvar localmente");
            console.error("Erro inesperado com IndexedDB:", e);
        }
        finally{
            habilitar_botao('btn_salvar_respostas', true);
        }
        return;
    }
    let pergunta = $(this).attr('pergunta');
    let adequacao = $("input[name='adequacao']:checked").val();
    adequacao = adequacao == undefined ? 1 : adequacao;
    let probabilidade = $("input[name='probabilidade']:checked").val();
    probabilidade = probabilidade == undefined ? 1 : probabilidade;
    let impacto = $("input[name='impacto']:checked").val();
    impacto = impacto == undefined ? 1 : impacto;
    let esforco = $("input[name='esforco']:checked").val();
    esforco = esforco == undefined ? 1 : esforco;
    let valor = $("input[name='valor']:checked").val();
    valor = valor == undefined ? 1 : valor;
    let resposta = $("#resposta").val();
    let form = new FormData();
    form.append('formulario_id', $("#formulario_id").val());
    form.append('pergunta_id', pergunta);
    form.append("adequacao", adequacao);
    form.append("probabilidade", probabilidade);
    form.append("impacto", impacto);
    form.append("esforco", esforco);
    form.append("valor", valor);
    form.append("resposta", resposta);
    form.append("foto", document.getElementById("foto").files[0]);    
    axios.post("/formularios/responder_pergunta", form)
        .then(response => {
            sucesso(response.data.mensagem);
            fechar_modal("modal_dados_formulario");
            location.reload();
        })
        .catch(error => { erro(error); })
        .finally(() => {
            habilitar_botao('btn_salvar_respostas', true);
        });
});

async function toBase64(file) {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob)) {
            return resolve(null); // ignora se não for imagem
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
} */

// Converte imagem em base64 (ou retorna null)
function toBase64(file) {
    return new Promise((resolve, reject) => {
        if (!(file instanceof Blob)) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

$("#btn_salvar_respostas").click(async function () {
    habilitar_botao('btn_salvar_respostas', false);

    // 1. Coleta de dados do formulário
    let pergunta = $(this).attr('pergunta');
    let adequacao = $("input[name='adequacao']:checked").val() || 1;
    let probabilidade = $("input[name='probabilidade']:checked").val() || 1;
    let impacto = $("input[name='impacto']:checked").val() || 1;
    let esforco = $("input[name='esforco']:checked").val() || 1;
    let valor = $("input[name='valor']:checked").val() || 1;
    let resposta = $("#resposta").val();
    let formulario_id = $("#formulario_id").val();
    let fotoInput = document.getElementById("foto");
    let foto = fotoInput.files && fotoInput.files[0];
    let fotoBase64 = await toBase64(foto);

    // Objeto com os dados
    const dadosResposta = {
        timestamp: new Date().toISOString(),
        formulario_id,
        pergunta_id: pergunta,
        adequacao,
        probabilidade,
        impacto,
        esforco,
        valor,
        resposta,
        fotoBase64
    };

    // 2. Se OFFLINE, salva localmente
    if (online === false) {
        try {
            let tx = db.transaction(["respostas"], "readwrite");
            let store = tx.objectStore("respostas");
            store.add(dadosResposta);

            tx.oncomplete = () => sucesso("Resposta salva localmente!");
            tx.onerror = (event) => {
                erro("Erro ao salvar localmente");
                console.error("Erro IndexedDB:", event);
            };
        } catch (e) {
            erro("Erro ao salvar localmente");
            console.error("Erro inesperado:", e);
        } finally {
            habilitar_botao('btn_salvar_respostas', true);
        }
        return;
    }

    // 3. Se ONLINE, envia com Axios
    const form = new FormData();
    form.append("formulario_id", formulario_id);
    form.append("pergunta_id", pergunta);
    form.append("adequacao", adequacao);
    form.append("probabilidade", probabilidade);
    form.append("impacto", impacto);
    form.append("esforco", esforco);
    form.append("valor", valor);
    form.append("resposta", resposta);
    if (foto) form.append("foto", foto);

    axios.post("/formularios/responder_pergunta", form)
        .then(response => {
            sucesso(response.data.mensagem);
            fechar_modal("modal_dados_formulario");
            location.reload();
        })
        .catch(error => {
            erro(error);
            console.error(error);
        })
        .finally(() => {
            habilitar_botao('btn_salvar_respostas', true);
        });
});

var online = true;

function verificarConexao() {
    axios.get(app_url+"/online")
    .then(response => {
        online = true;
        $("#online").removeClass("offline");
        $("#online").addClass("online-ativo");
        $("#online").html("ONLINE");
        sincronizarRespostasOffline();        
    })
    .catch(error => {
        online = false;
        $("#online").removeClass("online-ativo");
        $("#online").addClass("offline");
        $("#online").html("OFFLINE");                
    })    
}


setInterval(function () {
    verificarConexao();
}, 1000);


async function sincronizarRespostasOffline() {
    if (!navigator.onLine) return; // Só executa se estiver online

    const request = indexedDB.open("FormulariosDB", 1);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const tx = db.transaction(["respostas"], "readonly");
        const store = tx.objectStore("respostas");
        const getAll = store.getAll();

        getAll.onsuccess = async function () {
            const respostas = getAll.result;

            for (let resposta of respostas) {
                const form = new FormData();
                form.append("formulario_id", resposta.formulario_id);
                form.append("pergunta_id", resposta.pergunta_id);
                form.append("adequacao", resposta.adequacao);
                form.append("probabilidade", resposta.probabilidade);
                form.append("impacto", resposta.impacto);
                form.append("esforco", resposta.esforco);
                form.append("valor", resposta.valor);
                form.append("resposta", resposta.resposta);

                if (resposta.fotoBase64) {
                    const blob = base64ToBlob(resposta.fotoBase64);
                    form.append("foto", blob);
                }

                try {
                    const response = await axios.post("/formularios/responder_pergunta", form);
                    console.log("Sincronizado:", response.data);
                    $("#online").html("ONLINE, Sincronizando...");                    

                    // Remoção segura com transação separada
                    if ('id' in resposta) {
                        const deleteTx = db.transaction(["respostas"], "readwrite");
                        const deleteStore = deleteTx.objectStore("respostas");
                        const deleteRequest = deleteStore.delete(resposta.id);

                        deleteRequest.onsuccess = () => {
                            console.log("Item excluído do IndexedDB:", resposta.id);
                        };
                        deleteRequest.onerror = () => {
                            console.error("Erro ao excluir item do IndexedDB:", resposta.id);
                            erro("Erro ao excluir resposta sincronizada localmente.");
                        };
                    } else {
                        console.warn("Resposta sem ID. Não foi possível excluir:", resposta);
                    }

                } catch (error) {
                    console.error("Erro ao sincronizar resposta:", error);
                    erro("Erro ao enviar resposta offline para o servidor.");
                }
            }
        };
    };

    request.onerror = function (event) {
        console.error("Erro ao abrir IndexedDB:", event);
        erro("Não foi possível acessar os dados offline.");
    };
}


function base64ToBlob(base64Data) {
    const parts = base64Data.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}