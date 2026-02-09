<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Projeto;
use App\Models\Formulario;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('projetos:recalcular-estatisticas', function () {
    $this->info('🔄 Iniciando recálculo das estatísticas dos projetos...');
    
    $projetos = Projeto::all();
    $total = $projetos->count();
    
    $bar = $this->output->createProgressBar($total);
    
    foreach ($projetos as $projeto) {
        // Calcular totais agregados
        $total_perguntas = Formulario::where('projeto_id', $projeto->id)->sum('total_perguntas');
        $total_perguntas_respondidas = Formulario::where('projeto_id', $projeto->id)->sum('total_perguntas_respondidas');
        
        // Calcular porcentagem CORRETA
        $porcentagem_preenchimento = $total_perguntas > 0 
            ? ($total_perguntas_respondidas / $total_perguntas) * 100 
            : 0;
        
        // Atualizar projeto
        $projeto->update([
            'total_perguntas' => $total_perguntas,
            'total_perguntas_respondidas' => $total_perguntas_respondidas,
            'porcentagem_preenchimento' => $porcentagem_preenchimento,
            'total_vulnerabilidades' => Formulario::where('projeto_id', $projeto->id)->sum('total_vulnerabilidades'),
            'total_riscos_altissimos' => Formulario::where('projeto_id', $projeto->id)->sum('total_riscos_altissimos'),
            'total_recomendacoes' => Formulario::where('projeto_id', $projeto->id)->sum('total_recomendacoes')
        ]);
        
        $bar->advance();
    }
    
    $bar->finish();
    $this->newLine();
    $this->info("✅ {$total} projetos recalculados com sucesso!");
})->purpose('Recalcula as estatísticas de todos os projetos');