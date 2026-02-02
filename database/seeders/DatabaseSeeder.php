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
            'nome' => 'administrador',
            'atribuicao' => 'administrador',
            'cpf_cnpj' => '145.475.167-31',
            'email' => 'admin@mail.com',
            'whatsapp' => '21981672720',
            'password' => bcrypt('123123'),
            'ativo' => true            
        ]);
    }
}
