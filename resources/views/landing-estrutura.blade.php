<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Secure Scope - Plataforma de Inspeções e Riscos</title>
    <link rel="shortcut icon" href="{{ asset('img/favicon.png') }}" type="image/x-png">

    @vite(['resources/css/app.css', 'resources/css/landing.css'])
</head>

<body class="antialiased overflow-x-hidden">

    @include('components.navbar')

    <main>
        @yield('conteudo')
    </main>

    @include('components.footer')

    @vite('resources/js/app.js')
</body>
</html>
