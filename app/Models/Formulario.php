<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use App\Models;
class Formulario extends Model
{
    use SoftDeletes;

    protected $table = 'formularios';

    protected $fillable = [
        'nome',        
        'empresa_id',
        'projeto_id',
        'criado_por_usuario_id',
        'data_cadastro',

        'total_perguntas',
        'total_perguntas_respondidas',
        'porcentagem_preenchimento',
        'total_vulnerabilidades',
        'total_riscos_altissimos',
        'total_recomendacoes',
    ];

    public function projeto(){
        return $this->belongsTo(Projeto::class, 'projeto_id');
    }    

    public function criador(){
        return $this->belongsTo(User::class, 'criado_por_usuario_id');
    }

    public function respostas(){
        return $this->belongsTo(Resposta::class, 'formulario_id');
    }

    public static function adicionar($dados){                
        $formulario = self::create([
            'nome' => $dados->nome,    
            'projeto_id' => $dados->projeto_id,
            'empresa_id' => session('empresa_id'),
            'criado_por_usuario_id' => Auth::id(),
            'data_cadastro' => now(),
            'total_perguntas' => self::recuperar_total_perguntas_formulario($dados->projeto_id)
        ]); 
        Models\Projeto::atualizar_estatisticas_projeto($formulario->id);
    }

    public static function editar(string $tag_id, $dados){
        $formulario = self::find($tag_id)->update([
            'nome' => $dados->nome,            
            'ativo' => $dados->ativo
        ]);
        Models\Projeto::atualizar_estatisticas_projeto($formulario->id);
    }

    public static function recuperar_total_perguntas_formulario($projeto_id){
        $tipos_empreendimento_projeto = ProjetoTipoEmpreendimento::where('projeto_id', $projeto_id)->pluck('tipo_empreendimento_id')->toArray();
        $perguntas_ids = PerguntaTipoEmpreendimento::whereIn('tipo_empreendimento_id', $tipos_empreendimento_projeto)->select('pergunta_id')->groupBy('pergunta_id')->pluck('pergunta_id')->toArray();
        return Pergunta::whereIn('id', $perguntas_ids)->orderBy('data_cadastro', 'desc')->count();
    }
}
