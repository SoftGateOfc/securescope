import { erro, formatar_data } from '../app';

export function lista_projetos(){
    $("#projetos").empty();
    axios.get(`${app_url}/projetos/lista`)
        .then(response => {
            let projetos = response.data;
            for(let i in projetos){
                let funcionarios = projetos[i].usuarios;
                let tp = projetos[i].tipos_empreendimentos.map(te => `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">${te.tipo_empreendimento.nome}</span>`).join("");
                
                
                let formularios_texto = "";
                if(projetos[i].formularios && projetos[i].formularios.length > 0){
                    let nomes_formularios = projetos[i].formularios.map(f => f.nome).join(", ");
                    formularios_texto = `<p class="font-normal text-gray-700 mb-2">
                                            <span >Formulários:</span> ${nomes_formularios}
                                         </p>`;
                } else {
                    formularios_texto = `<p class="font-normal text-gray-500 mb-2 italic">Nenhum formulário cadastrado</p>`;
                }
                
                let badge_status = "";
                switch(projetos[i].status){
                    case "Completo": badge_status = `<div class="completo">${projetos[i].status}</div>`; break;
                    case "Em andamento": badge_status = `<div class="andamento">${projetos[i].status}</div>`; break;
                }
                
                let editar = "";
                if(atribuicao == 'administrador' || atribuicao == 'gerente' || atribuicao == 'rh'){
                    editar = `editar`;
                }
                
                let projeto = `  <div projeto="${projetos[i].id}" class="${editar} w-full mb-3 block p-6 bg-white border border-black-800 rounded-lg shadow-sm hover:bg-gray-100 ">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">${projetos[i].nome} - ${projetos[i].cliente.nome}</h5>
                                    <p class="font-normal text-gray-700 mb-2 ">Responsável: ${projetos[i].usuario_criador.nome}</p>
                                    
                                    ${formularios_texto}
                                    
                                   <div class="flex justify-between items-center text-gray-700 w-full mb-3">
                                        <p>Data de início: ${formatar_data(projetos[i].data_inicio, false)}</p>
                                        <p>Data de conclusão: ${formatar_data(projetos[i].data_conclusao, false)}</p>
                                    </div>                                                                                
                                    <div class="flex flex-wrap gap-2 text-gray-500 text-sm my-2 mb-3">
                                       <span class="text-gray-700 text-base"> Funcionários Envolvidos:</span> ${funcionarios.map(f => `<span class="px-2 py-1 bg-gray-100 rounded">${f.usuario.nome}</span>`).join("")}
                                    </div>
                                    <div class="flex flex-wrap gap-2 mb-7">
                                       <span class="text-gray-700"> Tipo de Empreendimento:</span> ${tp}
                                    </div>
                                    <div class="flex justify-center mb-5">
                                        ${badge_status}
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5 ">
                                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${projetos[i].porcentagem_preenchimento}%"></div>
                                    </div>
                                    <div class="flex justify-between mb-3">
                                        <p><span>${projetos[i].total_perguntas_respondidas}/${projetos[i].total_perguntas} </span> Perguntas</p>
                                        <p>${projetos[i].porcentagem_preenchimento.toFixed(2)}%</p>
                                    </div>
                                    <!-- MOBILE: -->
                                    <div class="flex md:hidden justify-between gap-2">
                                        <div class="flex flex-col items-center">
                                            <p class="text-xl  text-yellow-500">${projetos[i].total_vulnerabilidades}</p>
                                            <p class="text-xs text-yellow-600 text-center">Vulnerabilidades</p>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            <p class="text-xl  text-red-500">${projetos[i].total_riscos_altissimos}</p>
                                            <p class="text-xs text-red-600 text-center">Riscos Altíssimos</p>
                                        </div>
                                        <div class="flex flex-col items-center">
                                            <p class="text-xl  text-green-500">${projetos[i].total_recomendacoes}</p>
                                            <p class="text-xs text-green-600 text-center">Recomendações</p>
                                        </div>
                                    </div>
                                    
                                    <!-- DESKTOP: -->
                                    <div class="hidden md:flex justify-between">
                                        <p class="text-yellow-500 text-xl">${projetos[i].total_vulnerabilidades} vulnerabilidades</p>
                                        <p class="text-red-500 text-xl">${projetos[i].total_riscos_altissimos} riscos altíssimos</p>
                                        <p class="text-green-500 text-xl">${projetos[i].total_recomendacoes} recomendações</p>
                                    </div>
                                </div>`;                
                $("#projetos").append(projeto);
            }
        })
        .catch(error => {
            erro(error);
        })
        .finally(() => {})
}