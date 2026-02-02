<x-modal id="modal_relatorio" label="Gerar relatório">
    <h1 id="titulo_formulario_relatorio"></h1>
    <p>Para garantirmos a máxima precisão e qualidade na elaboração do seu relatório, precisamos que nos forneça as seguintes informações:</p>
    <form target="_blank" action="{{ getenv('APP_URL').'/formularios/relatorio_personalizado' }}" method="post" enctype="multipart/form-data">
        @csrf
        <x-input type="hidden" name="relatorio_formulario_id"></x-input>
        <x-input label="Nome da sua empresa" name="nome_empresa" value="{{ old('nome_empresa') }}"></x-input>
        <x-input type="file" name="logo_empresa" label="Logo da sua empresa" accept="image/png, image/jpg, image/jpeg"></x-input>
        <x-input label="Nome do cliente" name="nome_cliente" value="{{ old('nome_cliente') }}"></x-input>
        <x-input type="file" name="logo_cliente" label="Logo do cliente" accept="image/png, image/jpg, image/jpeg"></x-input>
        <x-input label="Objetivo" name="objetivo" value="{{ old('objetivo') }}"></x-input>
        <x-input label="Observações" name="observacoes" value="{{ old('observacoes') }}"></x-input>
        <x-input type="file" name="imagem_area" label="Imagens da área" accept="image/png, image/jpg, image/jpeg"></x-input>
        <x-input label="Localização da análise" name="localizacao_analise" value="{{ old('localizacao_analise') }}"></x-input>
        <x-input label="Referências próximas" name="referencias_proximas" value="{{ old('referencias_proximas') }}"></x-input>
        <x-textarea id="panorama" label="Panorama situacional - Exposição ao Risco" name="panorama"></x-textarea>        
        <div class="flex gap-2 mt-3 justify-center">
            <x-botao id="btn_gerar_pdf" type="button" label="Gerar PDF" icon="fas fa-file-pdf" class="flex-1" cor="vermelho"></x-botao>
            <x-botao id="btn_gerar_pptx" type="button" label="Gerar PPTX" icon="fas fa-file-powerpoint" class="flex-1" cor="verde"></x-botao>
        </div>
    </form>
</x-modal>
<script>
    var panorama = '{{ old('panorama') }}';    
</script>
@vite('resources/js/formularios/relatorio.js')