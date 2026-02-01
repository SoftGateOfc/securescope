<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projetos', function (Blueprint $table) {
            $table->id();            
            $table->string("nome");

            $table->date('data_inicio');
            $table->date('data_conclusao');
            $table->unsignedBigInteger("usuario_criador_projeto_id");
            $table->foreign("usuario_criador_projeto_id")->references("id")->on("users");
            $table->unsignedBigInteger("cliente_id");
            $table->foreign("cliente_id")->references("id")->on("clientes");
            $table->string('status')->default("Em andamento");
            $table->integer('total_perguntas')->default(0);
            $table->integer('total_perguntas_respondidas')->default(0);
            $table->double('porcentagem_preenchimento')->default(0);
            $table->integer('total_vulnerabilidades')->default(0);
            $table->integer('total_riscos_altissimos')->default(0);
            $table->integer('total_recomendacoes')->default(0);

            $table->dateTime('data_cadastro')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->unsignedBigInteger("empresa_id");
            $table->foreign("empresa_id")->references("id")->on("empresas");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projetos');
    }
};
