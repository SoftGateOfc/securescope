<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'nome' => 'Artur Borges',
            'atribuicao' => 'administrador',
            'cpf_cnpj' => '145.475.167-31',
            'email' => 'arturborges2009@hotmail.com',
            'whatsapp' => '21981672720',            
        ]);
        User::create([
            'nome' => 'Thiago Coutinho',
            'atribuicao' => 'administrador',
            'cpf_cnpj' => '186.762.527-00',
            'email' => 'thiago.ocoutinho@hotmail.com',
            'whatsapp' => '21972757281',            
        ]);
        User::create([
            'nome' => 'Mateus Maldonado',
            'atribuicao' => 'administrador',
            'cpf_cnpj' => '146.647.217-06',
            'email' => 'mateusmald@gmail.com',
            'whatsapp' => '21974679898',            
        ]);
         User::create([
            'nome' => 'Tester',
            'atribuicao' => 'administrador',
            'cpf_cnpj' => '146.647.217-08',
            'email' => 'teste@gmail.com',
            'whatsapp' => '21974679898', 
            'senha' => bcrypt('123123'),         
        ]);
    }
}
