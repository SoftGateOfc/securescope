import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/login.css',
                'resources/css/formulario.css',




                'resources/js/app.js',
                'resources/js/login/login.js',
                'resources/js/login/recuperar_senha.js',
                'resources/js/estrutura/cabecalho.js',
                'resources/js/estrutura/redefinir_senha.js',
                'resources/js/estrutura/trocar_empresa.js',
                //USUÁRIOS
                'resources/js/usuarios/index.js',
                'resources/js/usuarios/funcoes.js',
                'resources/js/usuarios/adicionar.js',
                'resources/js/usuarios/editar.js',
                'resources/js/usuarios/estatisticas.js',
                //FUNCIONÁRIOS
                'resources/js/funcionarios/index.js',
                'resources/js/funcionarios/funcoes.js',
                'resources/js/funcionarios/adicionar.js',
                'resources/js/funcionarios/editar.js',
                //EMPRESAS
                'resources/js/empresas/index.js',
                'resources/js/empresas/funcoes.js',
                'resources/js/empresas/adicionar.js',
                'resources/js/empresas/editar.js',
                //TIPOS DE EMPREENDIMENTOS
                'resources/js/tipos_empreendimentos/index.js',
                'resources/js/tipos_empreendimentos/funcoes.js',
                'resources/js/tipos_empreendimentos/adicionar.js',
                'resources/js/tipos_empreendimentos/editar.js',
                //TÓPICOS
                'resources/js/topicos/index.js',
                'resources/js/topicos/funcoes.js',
                'resources/js/topicos/adicionar.js',
                'resources/js/topicos/editar.js',
                //ÁREAS
                'resources/js/areas/index.js',
                'resources/js/areas/funcoes.js',
                'resources/js/areas/adicionar.js',
                'resources/js/areas/editar.js',
                //TEMÁTICAS
                'resources/js/tematicas/index.js',
                'resources/js/tematicas/funcoes.js',
                'resources/js/tematicas/adicionar.js',
                'resources/js/tematicas/editar.js',
                //TAGS
                'resources/js/tags/index.js',
                'resources/js/tags/funcoes.js',
                'resources/js/tags/adicionar.js',
                'resources/js/tags/editar.js',
                //PERGUNTAS
                'resources/js/perguntas/index.js',
                'resources/js/perguntas/funcoes.js',
                'resources/js/perguntas/adicionar.js',
                'resources/js/perguntas/editar.js',
                'resources/js/perguntas/ver.js',
                //PROJETOS
                'resources/js/projetos/index.js',
                'resources/js/projetos/funcoes.js',
                'resources/js/projetos/adicionar.js',
                'resources/js/projetos/editar.js',
                //CLIENTES
                'resources/js/clientes/index.js',
                'resources/js/clientes/funcoes.js',
                'resources/js/clientes/adicionar.js',
                'resources/js/clientes/editar.js',
                //FORMULÁRIOS
                'resources/js/formularios/index.js',
                'resources/js/formularios/funcoes.js',
                'resources/js/formularios/adicionar.js',
                'resources/js/formularios/editar.js',                
                'resources/js/formularios/interagir.js',                
                'resources/js/formularios/dados-formulario.js',                
                'resources/js/formularios/relatorio.js',                
                //AUDITORIA
                'resources/js/auditoria/index.js'
            ],
            refresh: false,
        }),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
});