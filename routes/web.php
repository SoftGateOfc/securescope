<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

// Rota raiz 
Route::get('/', function(){
    if(Auth::check()){        
        return view('home'); 
    }else{        
        return view('landing'); 
    }
})->name('home');

Route::get('/fale-conosco', function(){
    return view('fale-conosco');
})->name('fale-conosco');

// Rota de login 
Route::get('/login', function(){
    if(Auth::check()){
        return redirect('/'); 
    }
    return view('login.login');
})->name('login');

Route::post('verificar_login', [Controllers\LoginController::class, 'verificar_login']);

Route::controller(Controllers\RecuperacaoSenhaController::class)->group(function(){
    Route::prefix('recuperacao_senha')->group(function(){
        Route::post('solicitar', 'solicitar');
        Route::get('formulario/{token}', 'formulario');
        Route::put('efetivar', 'efetivar');
    });
});

require('auth.php');