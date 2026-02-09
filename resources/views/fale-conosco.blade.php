@extends('landing-estrutura')
@section('conteudo')

<!-- HERO SECTION COM FORMULÁRIO -->
<section class="w-full min-h-screen bg-white py-16 px-6">
    <div class="max-w-8xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-10 items-center">
            
            <!-- LADO ESQUERDO - CONTEÚDO -->
            <div class="order-1 lg:order-1 lg:ml-[10%]">
                <h1 class="text-5xl lg:text-6xl  font-semibold text-gray-900 mb-6 leading-tight">
                    Transforme Inspeções em Decisões Técnicas Confiáveis
                </h1>

                <div class="space-y-4 mb-8">
                    <div class="flex items-start gap-3">
                             <img 
                                src="/imagesHomePage/PNG/Fale-Conosco/IconeChecklistSecureScope.png"
                                class="w-7 h-7 object-contain ">
                        <p class="text-2xl text-gray-500">Checklists estruturados e padronizados</p>
                    </div>

                    <div class="flex items-start gap-3">
                             <img 
                                    src="/imagesHomePage/PNG/Fale-Conosco/IconeChecklistSecureScope.png"
                                    class="w-7 h-7 object-contain ">
                        <p class="text-2xl text-gray-500 ">Classificação objetiva de riscos</p>
                    </div>

                    <div class="flex items-start gap-3">
                             <img 
                                src="/imagesHomePage/PNG/Fale-Conosco/IconeChecklistSecureScope.png"
                                class="w-7 h-7 object-contain ">
                        <p class="text-2xl text-gray-500">Relatórios prontos para tomada de decisão</p>
                    </div>
                </div>

               <div class="mt-15 flex justify-center  w-full lg:w-[800px] mx-auto">
                    <img src="/imagesHomePage/PNG/Fale-Conosco/ArteContato.png" 
                        alt="Arte Contato" 
                        class="w-full rounded">
                </div>
            </div>

            <!-- LADO DIREITO - FORMULÁRIO -->
            <div class="order-2 lg:order-2 flex justify-center mr-[8%] lg:mt-20 lg:ml-[25%] ">
                <div class="bg-white rounded-2xl shadow-2xl p-8 lg:p-8 w-96 ">
                    <div class="text-center">
                    <h2 class="text-3xl font-bold text-sky-400 mb-3">Fale Conosco</h2>
                    </div>
                    <p class="text-gray-600 mb-8 text-lg">Preencha os dados abaixo e nossa equipe entrará em contato.</p>

                    <form id="form-contato" novalidate class="space-y-4">
                        @csrf
                        
                        <!-- NOME -->
                        <div>
                            <label for="nome" class="block   mb-2">Nome</label>
                            <input 
                                type="text" 
                                id="nome" 
                                name="nome"
                                placeholder="Nome Completo"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                required
                            >
                        </div>

                        <!-- EMPRESA -->
                        <div>
                            <label for="empresa" class="block mb-2">Empresa</label>
                            <input 
                                type="text" 
                                id="empresa" 
                                name="empresa"
                                placeholder="Empresa ou Organização"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                required
                            >
                        </div>

                        <!-- EMAIL -->
                        <div>
                            <label for="email" class="block  mb-2">Email Corporativo</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                placeholder="nome@empresa.com"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                required
                            >
                        </div>

                        <!-- TELEFONE -->
                        <div>
                            <label for="telefone" class="block mb-2">Telefone</label>
                            <input 
                                type="tel" 
                                id="telefone" 
                                name="telefone"
                                placeholder="+55 021 555555 555"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                required
                            >
                        </div>

                        <!-- BOTÃO -->
                         <div class="items-center justify-center flex ">
                        <button 
                            type="submit"
                            class=" bg-sky-500 text-white w-50  py-2 rounded-lg hover:bg-sky-600 transition-all shadow-lg hover:shadow-xl uppercase tracking-wide"
                        >
                            Solicitar acesso
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>


@vite('resources/js/landing/landing.js')
@vite('resources/js/fale-conosco/validator.js')



@endsection