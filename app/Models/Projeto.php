<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use App\Models;

class Projeto extends Model
{
    use SoftDeletes;

    protected $table = 'projetos';

    protected $fillable = [
        'nome',        
        'empresa_id',
        'data_cadastro',
        'data_inicio',
        'data_conclusao',
        'usuario_criador_projeto_id',
        'cliente_id',
        'status',
        'total_perguntas',
        'total_perguntas_respondidas',
        'porcentagem_preenchimento',
        'total_vulnerabilidades',
        'total_riscos_altissimos',
        'total_recomendacoes',
    ];

    public function usuario_criador()
    {
        return $this->belongsTo(User::class, 'usuario_criador_projeto_id');
    }

    public function formularios()
    {
        return $this->hasMany(Formulario::class, 'projeto_id');
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public static function adicionar($dados){        
        $projeto = self::create([
            'nome' => $dados->nome,
            'data_inicio' => $dados->data_inicio,
            'data_conclusao' => $dados->data_conclusao,
            'cliente_id' => $dados->cliente,
            'usuario_criador_projeto_id' => Auth::id(),
            'empresa_id' => session('empresa_id'),            
        ]);
        foreach($dados->tipos_empreendimentos as $t){
            Models\ProjetoTipoEmpreendimento::create([
                'projeto_id' => $projeto->id,
                'tipo_empreendimento_id' => $t
            ]);
        }
        foreach($dados->funcionarios as $f){
            Models\ProjetoUsuario::create([
                'projeto_id' => $projeto->id,
                'usuario_id' => $f
            ]);
        }
        $projeto->update(['total_perguntas' => Models\Formulario::recuperar_total_perguntas_formulario($projeto->id)]);
        return $projeto;
    }

    public static function editar(string $projeto_id, $dados){
        $projeto = self::find($projeto_id)->update([
            'status' => $dados->status,
            'nome' => $dados->nome,
            'data_inicio' => $dados->data_inicio,
            'data_conclusao' => $dados->data_conclusao,
            'cliente_id' => $dados->cliente            
        ]);        
        Models\ProjetoUsuario::where('projeto_id', $projeto_id)->delete();
        foreach($dados->funcionarios as $f){
            Models\ProjetoUsuario::create([
                'projeto_id' => $projeto_id,
                'usuario_id' => $f
            ]);
        }
        return $projeto;
    }

    public static function atualizar_estatisticas_projeto($formulario_id){
        $formulario = Models\Formulario::withTrashed()->find($formulario_id);
        if(!$formulario){
            return;
        }
        $projeto = Models\Projeto::find($formulario->projeto_id);
        if($projeto){
            $projeto_id = $projeto->id;
            $projeto->update([
                'total_perguntas' => Models\Formulario::where('projeto_id', $projeto_id)->sum('total_perguntas'),
                'total_perguntas_respondidas' => Models\Formulario::where('projeto_id', $projeto_id)->sum('total_perguntas_respondidas'),
                'porcentagem_preenchimento' => Models\Formulario::where('projeto_id', $projeto_id)->sum('porcentagem_preenchimento'),
                'total_vulnerabilidades' => Models\Formulario::where('projeto_id', $projeto_id)->sum('total_vulnerabilidades'),
                'total_riscos_altissimos' => Models\Formulario::where('projeto_id', $projeto_id)->sum('total_riscos_altissimos'),
                'total_recomendacoes' => Models\Formulario::where('projeto_id', $projeto_id)->sum('total_recomendacoes')
            ]);
        }
    }

    protected static function booted()
    {
        static::deleting(function ($projeto) {
            if ($projeto->isForceDeleting()) {
                $projeto->formularios()->withTrashed()->forceDelete();
                return;
            }
            $projeto->formularios()->delete();
        });
    }

    public function tipos_empreendimentos()
    {
        return $this->hasMany(ProjetoTipoEmpreendimento::class, 'projeto_id');
    }

    public function usuarios()
    {
        return $this->hasMany(ProjetoUsuario::class, 'projeto_id');
    }
}
