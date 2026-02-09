<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjetoController extends Controller
{
    use AuthorizesRequests;

    public function __construct(){
        session(["primeira_sessao" => "Projeto"]);
    }
    
    public function index(){                      
        session(["segunda_sessao" => "Visão Geral"]);  
        return view('projetos.index');
    }

    public function lista(){
        return Models\Projeto::with([
            'tipos_empreendimentos.tipo_empreendimento',
            'usuarios.usuario',
            'usuario_criador',
            'cliente',
            'formularios'
        ])
        ->where('empresa_id', session('empresa_id'))
        ->orderBy('data_inicio', 'desc')->get();
    }

    public function adicionar(Request $request){                           
        $validator = Validator::make($request->all(), [
            'nome' => 'required|max:255',
            'data_inicio' => 'required',
            'data_conclusao' => 'required',
            'cliente' => 'required',
            'tipos_empreendimentos' => 'required',
            'funcionarios' => 'required'
        ]);
        if($validator->fails()){    
            return response()->json($validator->errors(), 422);
        }                
        Models\Auditoria::registrar_atividade('Cadastro de Projeto');        
        Models\Projeto::adicionar($request);
        return response()->json('Projeto cadastrado com sucesso!', 200);
    }

    public function editar($projeto_id, Request $request){              
        $validator = Validator::make($request->all(), [
            'nome' => 'required|max:255',            
            'data_inicio' => 'required',
            'data_conclusao' => 'required',
            'cliente' => 'required',            
            'funcionarios' => 'required'
        ]);      
        if($validator->fails()){    
            return response()->json($validator->errors(), 422);
        }                
        Models\Auditoria::registrar_atividade('Edição de Projeto');        
        Models\Projeto::editar($projeto_id, $request);
        return response()->json('Projeto editado com sucesso!', 200);
    }

    public function detalhes($usuario_id){
        return Models\Projeto::with([
            'tipos_empreendimentos.tipo_empreendimento',
            'usuarios.usuario'
        ])
        ->find($usuario_id);
    }
}
