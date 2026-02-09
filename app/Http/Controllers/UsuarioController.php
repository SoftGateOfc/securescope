<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use PhpParser\Node\Stmt\Foreach_;
use Carbon\Carbon;

class UsuarioController extends Controller
{
    use AuthorizesRequests;

    public function __construct(){
        session(["primeira_sessao" => "Usuários"]);
    }
    
    public function index(){                
        session(["segunda_sessao" => "Visão Geral"]);
        return view('usuarios.index');
    }

    public function lista(){
        return Models\User::with(['empresa'])->where('atribuicao', '!=', 'administrador')->orderBy('nome', 'asc')->get();
    }

    public function adicionar(Request $request){        
        $validator = Validator::make($request->all(), [
            'nome' => 'required|max:255',
            'cpf_cnpj' => 'required',
            'email' => 'required|max:255',
            'whatsapp' => 'required|max:255',            
            'empresa_id' => 'required',            
            'atribuicao' => 'required'
        ]);
        if($validator->fails()){    
            return response()->json($validator->errors(), 422);
        }        
        if(!validar_cpf_cnpj($request->cpf_cnpj)){
            return response()->json('CPF/CNPJ é inválido!', 422);
        }
        $usuario_com_mesmo_cpf_cnpj = Models\User::where('cpf_cnpj', $request->cpf_cnpj)->first();
        if($usuario_com_mesmo_cpf_cnpj){
            return response()->json("Usuário $usuario_com_mesmo_cpf_cnpj->nome possui este CPF/CNPJ!", 422);
        }
        $usuario_com_mesmo_email = Models\User::where('email', $request->email)->first();
        if($usuario_com_mesmo_email){
            return response()->json("Usuário $usuario_com_mesmo_email->nome possui este email!", 422);
        }        
        Models\Auditoria::registrar_atividade('Cadastro de Usuário');
        Models\User::adicionar($request);
        return response()->json('Usuário cadastrado com sucesso!', 200);
    }

    public function editar($usuario_id, Request $request){        
        $validator = Validator::make($request->all(), [
            'nome' => 'required|max:255',
            'cpf_cnpj' => 'required',
            'email' => 'required|max:255',
            'whatsapp' => 'required|max:255',            
            'empresa_id' => 'required',            
            'atribuicao' => 'required'
        ]);        
        if($validator->fails()){    
            return response()->json($validator->errors(), 422);
        }        
        if(!validar_cpf_cnpj($request->cpf_cnpj)){
            return response()->json('CPF/CNPJ é inválido!', 422);
        }
        $usuario_com_mesmo_cpf_cnpj = Models\User::where('cpf_cnpj', $request->cpf_cnpj)->where('id', '!=', $usuario_id)->first();
        if($usuario_com_mesmo_cpf_cnpj){
            return response()->json("Usuário $usuario_com_mesmo_cpf_cnpj->nome possui este CPF/CNPJ!", 422);
        }
        $usuario_com_mesmo_email = Models\User::where('email', $request->email)->where('id', '!=', $usuario_id)->first();
        if($usuario_com_mesmo_email){
            return response()->json("Usuário $usuario_com_mesmo_email->nome possui este email!", 422);
        }
        if($request->senha){
            if(mb_strlen($request->senha) < 6){
                return response()->json("A senha de usuário deve conter no mínimo 6 caracteres!", 422);
            }
            Models\User::alterar_senha_usuario($usuario_id, $request->senha);
        }
        Models\Auditoria::registrar_atividade('Edição de Usuário');
        Models\User::editar($usuario_id, $request);
        return response()->json('Usuário editado com sucesso!', 200);
    }

    public function pesquisar($parametro, $valor){
        if($parametro == 'ativo'){
            $ativo = $valor == 'true' ? true : false;
            return Models\User::where('ativo', $ativo)->orderBy('nome', 'asc')->get();    
        }
        return Models\User::where($parametro, "like", "%$valor%")->orderBy('nome', 'asc')->get();
    }

    public function detalhes($usuario_id){
        return Models\User::find($usuario_id);
    }

    public function estatisticas(){
        $atribuicao = Auth::user()->atribuicao;        
        $dataAtual = Carbon::now();
        // Mês e ano atual
        $mes_atual = $dataAtual->format('m');
        $ano_atual = $dataAtual->format('Y');
        // Mês e ano anterior
        $dataAnterior = Carbon::now()->subMonth();
        $mes_anterior = $dataAnterior->format('m');
        $ano_anterior = $dataAnterior->format('Y');
        //PROJETOS
        $quantidade_projetos_criados_mes_vigente = Models\Projeto::whereYear('data_inicio', $ano_atual)
            ->whereMonth('data_inicio', $mes_atual)        
            ->where('empresa_id', session('empresa_id'))
            ->count();        

        $quantidade_projetos_criados_mes_anterior = Models\Projeto::whereYear('data_inicio', $ano_anterior)
            ->whereMonth('data_inicio', $mes_anterior)        
            ->where('empresa_id', session('empresa_id'))
            ->count();

        $total_projetos_criados = Models\Projeto::where('empresa_id', session('empresa_id'))->count();
        //VULNERABILIDADES
        $quantidade_vulnerabilidades_mes_vigente = Models\Projeto::whereYear('data_inicio', $ano_atual)
        ->whereMonth('data_inicio', $mes_atual)        
        ->where('empresa_id', session('empresa_id'))
        ->sum('total_vulnerabilidades');        
        $quantidade_vulnerabilidades_mes_anterior = Models\Projeto::whereYear('data_inicio', $ano_anterior)
        ->whereMonth('data_inicio', $mes_anterior)
        ->whereYear('data_inicio', $ano_atual)
        ->where('empresa_id', session('empresa_id'))
        ->sum('total_vulnerabilidades');    
        $total_vulnerabilidades_geral = Models\Projeto::where('empresa_id', session('empresa_id'))
        ->sum('total_vulnerabilidades');

        //RISCOS ALTÍSSIMOS
        $quantidade_riscos_mes_vigente = Models\Projeto::whereYear('data_inicio', $ano_atual)
        ->whereMonth('data_inicio', $mes_atual)
        ->where('empresa_id', session('empresa_id'))
        ->sum('total_riscos_altissimos');        
        $quantidade_riscos_mes_anterior = Models\Projeto::whereYear('data_inicio', $ano_anterior)
        ->whereMonth('data_inicio', $mes_anterior)
        ->where('empresa_id', session('empresa_id'))
        ->sum('total_riscos_altissimos');       
        $total_riscos_geral = Models\Projeto::where('empresa_id', session('empresa_id'))
        ->sum('total_riscos_altissimos');

        //RECOMENDAÇÕES
        $quantidade_recomendacoes_mes_vigente = Models\Projeto::whereYear('data_inicio', $ano_atual)
        ->whereMonth('data_inicio', $mes_atual)
        ->where('empresa_id', session('empresa_id'))
        ->sum('total_recomendacoes');
        $quantidade_recomendacoes_mes_anterior = Models\Projeto::whereYear('data_inicio', $ano_anterior)
        ->whereMonth('data_inicio', $mes_anterior)
        ->where('empresa_id', session('empresa_id'))
        ->sum('total_recomendacoes');
        // TOTAL GERAL DE RECOMENDAÇÕES 
        $total_recomendacoes_geral = Models\Projeto::where('empresa_id', session('empresa_id'))
        ->sum('total_recomendacoes');

        //DADOS DO MOMENTO VIGENTE
        $datas_do_mes_vigente = datasDoMesVigente();        
        $dias_numericos_mes_vigente = diasNumericosDoMesVigente();                
        $meses_labels = [];
        $quantidade_projetos_por_mes = [];
        $quantidade_riscos_por_mes = [];

        // Array com nomes dos meses em português (abreviados)
        $nomes_meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

        for ($i = -5; $i <= 6; $i++) {
            // Cria uma nova instância Carbon para cada iteração
            $data_referencia = Carbon::now()->addMonths($i);
            $mes = $data_referencia->format('m');
            $ano = $data_referencia->format('Y');
            
            // Nome do mês abreviado usando array
            $mes_index = (int)$mes - 1; // -1 porque array começa em 0
            $mes_nome = $nomes_meses[$mes_index];
            $meses_labels[] = $mes_nome;
            
            // Contar projetos criados neste mês
            $projetos_mes = Models\Projeto::whereYear('data_inicio', $ano)
                ->whereMonth('data_inicio', $mes)
                ->where('empresa_id', session('empresa_id'))
                ->count();
            $quantidade_projetos_por_mes[] = $projetos_mes;
            
            // Contar riscos mapeados neste mês
            $riscos_mes = Models\Projeto::whereYear('data_inicio', $ano)
                ->whereMonth('data_inicio', $mes)
                ->where('empresa_id', session('empresa_id'))
                ->sum('total_riscos_altissimos');
            $quantidade_riscos_por_mes[] = $riscos_mes;
        }

        $dados_grafico_projetos = [
            'meses' => $meses_labels,
            'quantidade' => $quantidade_projetos_por_mes
        ];

        //GRAFICO DE RISCOS - 12 MESES 
        $dados_grafico_riscos = [
            'meses' => $meses_labels,
            'quantidade' => $quantidade_riscos_por_mes
        ];
       //GRÁFICO PILARES
        $pilares = [];
        $todos_pilares = Models\Tematica::get();
        $estatisticas_pilares = [];
        foreach($todos_pilares as $pilar){
            $pilares[] = $pilar->nome;
            $estatisticas_pilares[] = DB::table('respostas')
                ->join('perguntas', "respostas.pergunta_id", "=", "perguntas.id")
                ->join('formularios', 'respostas.formulario_id', '=', 'formularios.id')
                ->join('projetos', 'formularios.projeto_id', '=', 'projetos.id')
                ->whereMonth('projetos.data_inicio', $mes_atual)
                ->whereYear('projetos.data_inicio', $ano_atual)
                ->where('projetos.empresa_id', session('empresa_id'))
                ->where("perguntas.tematica_id", $pilar->id)
                ->count();
        }
                $dados_grafico_pilares = [
            'pilares' => $pilares,
            'estatisticas' => $estatisticas_pilares
        ];
        //GRÁFICO DE TÓPICOS
        $topicos = [];                
        $estatisticas_topicos = [];
            //PEGAR TODAS AS RESPOSTAS DO MES
        $respostas_do_mes = DB::table('respostas')
        ->join('perguntas', "respostas.pergunta_id", "=", "perguntas.id")
        ->join('formularios', 'respostas.formulario_id', '=', 'formularios.id')
        ->join('projetos', 'formularios.projeto_id', '=', 'projetos.id')
        ->whereMonth('projetos.data_inicio', $mes_atual)
        ->whereYear('projetos.data_inicio', $ano_atual)
        ->where('projetos.empresa_id', session('empresa_id'))
        ->where('esta_em_risco_altissimo', true)
        ->select("perguntas.id as pergunta_id")
        ->get();
        foreach($respostas_do_mes as $resposta){
            $topicos_da_resposta = DB::table('pergunta_topico')
            ->join("topicos", "pergunta_topico.topico_id", "=", "topicos.id")
            ->where("pergunta_topico.pergunta_id", $resposta->pergunta_id)
            ->pluck("nome")
            ->toArray();
            foreach($topicos_da_resposta as $topico){
                if(isset($estatisticas_topicos[$topico])){
                    $estatisticas_topicos[$topico]++;
                }else{
                    $estatisticas_topicos[$topico] = 1;
                }
            }            
        }
        arsort($estatisticas_topicos);//ORDENO DO MAIOR PARA O MENOR
        $estatisticas_topicos = array_slice($estatisticas_topicos, 0, 5, true); //PEGO OS CINCO PRIMEIROS
        $topicos = array_keys($estatisticas_topicos);
        $quantidade_topicos = array_values($estatisticas_topicos);        
        $dados_grafico_topicos = [
            'topicos' => $topicos,
            'quantidade' => $quantidade_topicos
        ];
        //5 ULTIMOS PROJETOS
        $lista_projetos = Models\Projeto::with(['usuario_criador'])
        ->where('empresa_id', session('empresa_id'))
        ->orderBy('data_inicio', 'desc')        
        ->limit(5)
        ->get()
        ->map(function ($projeto) {
            return [
                'nome' => $projeto->nome,
                'data_inicio' => $projeto->data_inicio,
                'data_conclusao' => $projeto->data_conclusao,
                'status' => $projeto->status,
                'criador' => $projeto->usuario_criador?->nome,
            ];
        });        
        $dados = [
            'qtd_projetos_mes' => $quantidade_projetos_criados_mes_vigente,
            'percentual_projetos' => percentual($quantidade_projetos_criados_mes_anterior, $quantidade_projetos_criados_mes_vigente),
            'total_projetos_criados' => $total_projetos_criados,
            'qtd_vulnerabilidades_mes' => $quantidade_vulnerabilidades_mes_vigente,
            'percentual_vulnerabilidades' => percentual($quantidade_vulnerabilidades_mes_anterior, $quantidade_vulnerabilidades_mes_vigente),
            'total_vulnerabilidades_geral' => $total_vulnerabilidades_geral,
            'qtd_riscos_mes' => $quantidade_riscos_mes_vigente,
            'percentual_riscos' => percentual($quantidade_riscos_mes_anterior, $quantidade_riscos_mes_vigente),
            'total_riscos_geral' => $total_riscos_geral,
            'qtd_recomendacoes_mes' => $quantidade_recomendacoes_mes_vigente,
            'percentual_recomendacoes' => percentual($quantidade_recomendacoes_mes_anterior, $quantidade_recomendacoes_mes_vigente),
            'total_recomendacoes_geral' => $total_recomendacoes_geral,
            'lista_projetos' => $lista_projetos,
            'grafico_projetos' => $dados_grafico_projetos,
            'grafico_riscos' => $dados_grafico_riscos,
            'grafico_pilares' => $dados_grafico_pilares,
            'grafico_topicos' => $dados_grafico_topicos
        ];
        return response()->json($dados,200);
    }
     public function periodos_disponiveis() {
    $meses = [];
    $nomes_meses = [
        '01' => 'Janeiro', '02' => 'Fevereiro', '03' => 'Março', 
        '04' => 'Abril', '05' => 'Maio', '06' => 'Junho',
        '07' => 'Julho', '08' => 'Agosto', '09' => 'Setembro', 
        '10' => 'Outubro', '11' => 'Novembro', '12' => 'Dezembro'
    ];
    
    $meses[] = [
        'mes' => 'todos',
        'ano' => 'todos',
        'label' => 'Todos os Períodos',
        'valor' => 'todos'
    ];
    
    // Adicionar últimos 6 meses
    for ($i = 0; $i >= -5; $i--) {
        $data = new \DateTime();
        $data->modify("$i months");
        $mes = $data->format('m');
        $ano = $data->format('Y');
        
        $meses[] = [
            'mes' => $mes,
            'ano' => $ano,
            'label' => $nomes_meses[$mes] . '/' . $ano,
            'valor' => $ano . '-' . $mes
        ];
    }
    
    return response()->json($meses, 200);
}

    /**
     * Retorna estatísticas de um período específico
     * @param Request $request - deve conter 'mes' e 'ano'
     */
    public function estatisticas_por_periodo(Request $request) {
    $mes_selecionado = $request->input('mes', Carbon::now()->format('m'));
    $ano_selecionado = $request->input('ano', Carbon::now()->format('Y'));
    
   
    $buscar_todos_periodos = ($mes_selecionado === 'todos' && $ano_selecionado === 'todos');
    
   
    if ($buscar_todos_periodos) {
        $projetos_do_periodo = Models\Projeto::where('empresa_id', session('empresa_id'))
            ->pluck('id');
    } else {
        // 🔵 BUSCAR PROJETOS DO MÊS/ANO ESPECÍFICO
        $projetos_do_periodo = Models\Projeto::where('empresa_id', session('empresa_id'))
            ->whereMonth('data_inicio', $mes_selecionado)
            ->whereYear('data_inicio', $ano_selecionado)
            ->pluck('id');
    }

    // ===================================
    // GRÁFICO DE PILARES - GRAU DE CONFORMIDADE
    // ===================================
    $pilares = [];
    $todos_pilares = Models\Tematica::orderBy('nome', 'asc')->get();
    $conformidade_pilares = [];
    
    foreach($todos_pilares as $pilar){
        $pilares[] = $pilar->nome;
        
        // TOTAL de respostas daquele pilar nos projetos do período
        $total_respostas = DB::table('respostas')
            ->join('formularios', 'respostas.formulario_id', '=', 'formularios.id')
            ->join('perguntas', 'respostas.pergunta_id', '=', 'perguntas.id')
            ->whereIn('formularios.projeto_id', $projetos_do_periodo)
            ->where('perguntas.tematica_id', $pilar->id)
            ->count();
        
        // CONFORMES (nivel_adequacao = 1)
        $conformes = DB::table('respostas')
            ->join('formularios', 'respostas.formulario_id', '=', 'formularios.id')
            ->join('perguntas', 'respostas.pergunta_id', '=', 'perguntas.id')
            ->whereIn('formularios.projeto_id', $projetos_do_periodo)
            ->where('perguntas.tematica_id', $pilar->id)
            ->where('respostas.nivel_adequacao', 1)
            ->count();
        
        // Calcular porcentagem de conformidade
        $porcentagem = $total_respostas > 0 ? 
            round(($conformes / $total_respostas) * 100, 1) : 0;
        $conformidade_pilares[] = $porcentagem;
    }
    
    $dados_grafico_pilares = [
        'pilares' => $pilares,
        'conformidade' => $conformidade_pilares
    ];

    // ===================================
    // GRÁFICO DE TÓPICOS - TOP 5 RISCOS
    // ===================================
    $estatisticas_topicos = [];
    
    // PEGAR TODAS AS RESPOSTAS EM RISCO ALTÍSSIMO DOS PROJETOS DO PERÍODO
    $respostas_risco = DB::table('respostas')
        ->join('perguntas', "respostas.pergunta_id", "=", "perguntas.id")
        ->join('formularios', 'respostas.formulario_id', '=', 'formularios.id')
        ->whereIn('formularios.projeto_id', $projetos_do_periodo)
        ->where('respostas.esta_em_risco_altissimo', true)
        ->select("perguntas.id as pergunta_id")
        ->get();
    
    // CONTAR TÓPICOS
    foreach($respostas_risco as $resposta){
        $topicos_da_resposta = DB::table('pergunta_topico')
            ->join("topicos", "pergunta_topico.topico_id", "=", "topicos.id")
            ->where("pergunta_topico.pergunta_id", $resposta->pergunta_id)
            ->pluck("nome")
            ->toArray();
        
        foreach($topicos_da_resposta as $topico){
            if(isset($estatisticas_topicos[$topico])){
                $estatisticas_topicos[$topico]++;
            }else{
                $estatisticas_topicos[$topico] = 1;
            }
        }            
    }
    
    arsort($estatisticas_topicos);
    $estatisticas_topicos = array_slice($estatisticas_topicos, 0, 5, true);
    
    $topicos = array_keys($estatisticas_topicos);
    $quantidade_topicos = array_values($estatisticas_topicos);
    
    $dados_grafico_topicos = [
        'topicos' => $topicos,
        'quantidade' => $quantidade_topicos
    ];

    return response()->json([
        'grafico_pilares' => $dados_grafico_pilares,
        'grafico_topicos' => $dados_grafico_topicos,
        'periodo_selecionado' => [
            'mes' => $mes_selecionado,
            'ano' => $ano_selecionado,
            'todos' => $buscar_todos_periodos 
        ]
    ], 200);
}
}