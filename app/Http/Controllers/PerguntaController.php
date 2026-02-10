<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PerguntaController extends Controller
{
    use AuthorizesRequests;

    public function __construct(){
        session(["primeira_sessao" => "Perguntas"]);
    }
    
    public function index(){                
        session(["segunda_sessao" => "Visão Geral"]);
        return view('perguntas.index');
    }

    public function lista(){        
        return Models\Pergunta::with(['tematica'])
            ->join('tematicas', 'tematicas.id', '=', 'perguntas.tematica_id')
            ->select('perguntas.*')
            ->orderBy('tematicas.nome', 'asc')
            ->orderBy('perguntas.titulo', 'asc')
            ->orderByDesc('perguntas.ativo')
            ->get();
    }

    public function adicionar(Request $request){                        
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|max:1000',
            'tematica_id' => 'required',
            'tipos_empreendimentos' => 'required',
            'topicos' => 'required',
            'areas' => 'required',
            'tags' => 'required'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 422);
        }
        Models\Auditoria::registrar_atividade('Cadastro de Pergunta');
        Models\Pergunta::adicionar($request);
        return response()->json('Pergunta cadastrada com sucesso!', 200);
    }

    public function editar($tag_id, Request $request){        
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|max:1000',            
            'tematica_id' => 'required',
            'tipos_empreendimentos' => 'required',
            'topicos' => 'required',
            'areas' => 'required',
            'tags' => 'required'            
        ]);
        if($validator->fails()){            
            return response()->json($validator->errors(), 422);
        }        
        Models\Auditoria::registrar_atividade('Edição de Pergunta');
        Models\Pergunta::editar($tag_id, $request);
        return response()->json('Pergunta editada com sucesso!', 200);
    }

    public function detalhes($tag_id){
        return Models\Pergunta::with([
            'tematica',
            'tipos_empreendimentos.tipo_empreendimento',
            'topicos.topico',
            'areas.area',
            'tags.tag',
            'fotos'
        ])->find($tag_id);
    }
}
