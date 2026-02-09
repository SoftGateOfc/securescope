<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models;

Route::middleware(['auth'])->group(function() {    
    Route::post('logout', [Controllers\LoginController::class, 'logout']);
    Route::post('redefinir_senha', [Controllers\RecuperacaoSenhaController::class,'redefinir_senha']);  
    Route::get('online', function(){
        return response()->json('online', 200);
    });

    
    
    Route::controller(Controllers\EmpresaController::class)->group(function(){
        Route::prefix('empresas')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::put('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
            Route::post('trocar_empresa', 'trocar_empresa')->can('administrador', App\Models\User::class);            
        });
    });

    Route::controller(Controllers\TipoEmpreendimentoController::class)->group(function(){
        Route::prefix('tipos_empreendimentos')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::put('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
            Route::get('pesquisar/{parametro}/{valor}', 'pesquisar');
        });
    });

    Route::controller(Controllers\TopicoController::class)->group(function(){
        Route::prefix('topicos')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::put('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
            Route::get('pesquisar/{parametro}/{valor}', 'pesquisar');
        });
    });

    Route::controller(Controllers\AreaController::class)->group(function(){
        Route::prefix('areas')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::put('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
            Route::get('pesquisar/{parametro}/{valor}', 'pesquisar');
        });
    });

    Route::controller(Controllers\TematicaController::class)->group(function(){
        Route::prefix('tematicas')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::put('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
            Route::get('pesquisar/{parametro}/{valor}', 'pesquisar');
        });
    });    

    Route::controller(Controllers\TagController::class)->group(function(){
        Route::prefix('tags')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::put('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
            Route::get('pesquisar/{parametro}/{valor}', 'pesquisar');
        });
    });

    Route::controller(Controllers\PerguntaController::class)->group(function(){
        Route::prefix('perguntas')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::post('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
        });
    });

    Route::controller(Controllers\ArquivoController::class)->group(function(){
        Route::prefix('arquivos')->group(function(){
            Route::get('/download/{arquivo}', 'download');
            Route::delete('/excluir/{arquivo}', 'excluir');
            Route::get('exibir/{imagem?}', 'exibir');
        });        
    });

    Route::controller(Controllers\UsuarioController::class)->group(function(){
        Route::prefix('usuarios')->group(function(){
            Route::get('/', 'index')->can('administrador', App\Models\User::class);
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar')->can('administrador', App\Models\User::class);
            Route::put('editar/{id}', 'editar')->can('administrador', App\Models\User::class);
            Route::get('detalhes/{id}', 'detalhes')->can('administrador', App\Models\User::class);
            Route::get('estatisticas', 'estatisticas');
            Route::get('periodos_disponiveis', 'periodos_disponiveis');
            Route::post('estatisticas_por_periodo', 'estatisticas_por_periodo');
        });
    });
 
    Route::controller(Controllers\FuncionarioController::class)->group(function(){
        Route::prefix('funcionarios')->group(function(){
            Route::get('/', 'index');
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar');
            Route::put('editar/{id}', 'editar');
            Route::get('detalhes/{id}', 'detalhes');
            Route::get('pesquisar/{parametro}/{valor}', 'pesquisar');
        });
    });

    Route::controller(Controllers\ProjetoController::class)->group(function(){
        Route::prefix('projetos')->group(function(){
            Route::get('/', 'index');
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar');
            Route::put('editar/{id}', 'editar');
            Route::get('detalhes/{id}', 'detalhes');
        });
    });

    Route::controller(Controllers\ClienteController::class)->group(function(){
        Route::prefix('clientes')->group(function(){
            Route::get('/', 'index');
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar');
            Route::put('editar/{id}', 'editar');
            Route::get('detalhes/{id}', 'detalhes');
            Route::get('pesquisar/{parametro}/{valor}', 'pesquisar');
        });
    });

    Route::controller(Controllers\FormularioController::class)->group(function(){
        Route::prefix('formularios')->group(function(){            
            Route::get('/', 'index');
            Route::get('interagir/{id}', 'interagir');
            Route::get('formulario/{id}', 'formulario');
            Route::post('relatorio_personalizado', 'relatorio_personalizado');
            Route::post('gerar-pptx', 'gerar_pptx_isolado');
            Route::post('responder_pergunta', 'responder_pergunta');

            Route::post('registrar_perguntas_em_espera/{id}', 'registrar_perguntas_em_espera');
            Route::get('relatorio/{id}/{formato}', 'relatorio');
            Route::post('registrar', 'registrar');
            Route::get('respostas/formulario/{id}', 'listar_respostas');
            Route::delete('excluir/resposta/{id}', 'excluir_resposta');
            Route::get('lista', 'lista');
            Route::post('adicionar', 'adicionar');
            Route::put('editar/{id}', 'editar');
            Route::get('detalhes/{id}', 'detalhes');
        });
    });

    Route::controller(Controllers\RespostaController::class)->group(function(){
        Route::prefix('respostas')->group(function(){                        
            Route::get('detalhes_resposta/{formulario}/{pergunta}', 'detalhes_resposta');
        });
    });

    Route::controller(Controllers\AuditoriaController::class)->group(function(){
        Route::prefix('auditoria')->group(function(){            
            Route::get('/', 'index');
            Route::get('/relatorio/{formato}/{inicio}/{fim}', 'relatorio');
        });
    });

    /* Route::get('teste', function(){
        return view('formularios.modelos_de_relatorio.modelo1');
    }); */
});