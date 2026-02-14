<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContatoController extends Controller
{
    public function enviar(Request $request)
    {
        //  PROTEÇÃO HONEYPOT - campo invisível
        if ($request->filled('website')) {
            return response()->json([
                'success' => false,
                'message' => 'Solicitação inválida.'
            ], 422);
        }

        //  VALIDAÇÃO DOS DADOS
        $validator = Validator::make($request->all(), [
            'nome'     => 'required|string|min:3|max:100',
            'empresa'  => 'required|string|min:2|max:100',
            'email'    => 'required|email|max:100',
            'telefone' => 'required|string|min:14|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $dados = $validator->validated();

        // ENVIAR EMAIL VIA PHPMAILER 
        $enviado = enviar_email_solicitacao_acesso($dados);

        if (!$enviado) {
            return response()->json([
                'success' => false,
                'message' => 'Não foi possível enviar sua solicitação. Tente novamente mais tarde.'
            ], 503);
        }

        return response()->json([
            'success' => true,
            'message' => 'Solicitação enviada com sucesso! Nossa equipe entrará em contato em breve.'
        ]);
    }
}