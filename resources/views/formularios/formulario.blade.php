@extends('estrutura_principal.estrutura')
@section('conteudo')
@vite('resources/css/formulario.css')
<div class="flex justify-center">
    <div id="online" class="p-4 mb-4 text-sm rounded-lg" role="alert">
        <span class="font-medium text-center">ONLINE</span>
    </div>
</div>

<h1 id="nome_formulario">Formulário {{ $formulario->nome }}</h1>
<input id="formulario_id" type="hidden" value="{{ $formulario->id }}">
<h2>{{ count($perguntas) }} perguntas</h2>
<div class="flex justify-center">
    <x-botao id="btn_modal_relatorio" cor="vermelho" label="Relatório"></x-botao>
</div>
@if ($errors->any())
    <div class="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
        <strong>⛔ Ocorreram erros na geração do relatório:</strong>
        <br>
        <strong>Submeta os arquivos novamente!</strong>
        <ul class="mt-2 list-disc list-inside">
            @foreach ($errors->all() as $erro)
                <li>{{ $erro }}</li>
            @endforeach
        </ul>
    </div>
@endif
@foreach($perguntas as $pergunta)
<a class="card-pergunta @if($pergunta->respondido) respondido @endif mb-3 w-full block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100">
    <p class="titulo">{{ $pergunta->titulo }}</p>    
    <div class="flex flex-wrap gap-2">
        <x-badge_adequacao nivel_adequacao="{{ $pergunta->nivel_adequacao }}"></x-badge_adequacao>
        <x-badge_risco_altissimo risco_altissimo="{{ $pergunta->risco_altissimo }}"></x-badge_risco_altissimo>
        <div class="w-full md:w-auto">
            <x-badge_prazo prazo="{{ $pergunta->prazo }}"></x-badge_prazo>
        </div>
    </div>    
        
    @if($pergunta->respondido && $pergunta->recomendacao)
    <div class="mt-4 mb-4">
        <p class=" font-semibold text-black">Recomendação:
           <span class="text-sm text-gray-600 mt-1">{{ $pergunta->recomendacao }}</span> 
        </p>
       
    </div>
    @endif
   
    @if($pergunta->foto)
    <div class="flex justify-center">        
        <img class="foto" src="{{ getenv('APP_URL')."/arquivos/exibir/".$pergunta->foto }}" alt="">
    </div>
    @endif
    <div class="flex justify-center">
        <button pergunta="{{ $pergunta->id }}" class="responder-pergunta relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200">
            <span class="relative px-5 py-1.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-transparent">
                Responder
            </span>
        </button>
    </div>    
</a>
@endforeach
@include('formularios.modais.dados-formulario')
@include('formularios.modais.relatorio')
@endsection