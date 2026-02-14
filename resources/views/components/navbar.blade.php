 <!-- NAVBAR -->
<nav id="navbar" class="bg-white fixed top-0 left-0 right-0 z-[9999] w-full transition-shadow duration-300">
    <div class="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <!-- LOGO -->
        <div class="flex items-center">
            <a href="{{ route('home') }}">
            <img 
                src="/imagesHomePage/PNG/Landing/SecureScopeLogo.png"
                alt="Secure Scope"
                class="h-10 w-auto"
            >
            </a>
        </div>

        <!-- LINKS -->
        @if(!Request::routeIs('fale-conosco'))
        <div class="hidden lg:flex items-center gap-10 text-gray-700 font-medium">
            <a href="#segmentos" class="hover:text-sky-500 transition-colors">Segmentos</a>
            <a href="#como-funciona" class="hover:text-sky-500 transition-colors">Plataforma</a>
            <a href="#institucional" class="hover:text-sky-500 transition-colors">Institucional</a>
        </div>
        @endif

        <!-- BOTÕES -->
        <div class="hidden lg:flex items-center gap-4">
            @if(Request::routeIs('fale-conosco'))
            <a href="{{ route('home') }}"
            class="px-5 py-2 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow">
                Home
            </a>
            @else
            <a href="{{ route('fale-conosco') }}"
            class="px-5 py-2 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition shadow">
                Solicitar acesso
            </a>
            @endif
            <a href="{{ route('login') }}"
            class="px-5 py-2 rounded-full border border-sky-500 text-sky-500 font-semibold hover:bg-blue-50 transition">
                Acessar plataforma
            </a>
        </div>

        <!-- MOBILE -->
        <button id="mobile-menu-btn" class="lg:hidden text-gray-700 ml-3 mt-1">
            <img 
                src="/imagesHomePage/PNG/Landing/IconeEditar.png"
                class="w-8 h-8 object-contain">
        </button>
    </div>
    <div class="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400"></div>
    
    <!-- MOBILE MENU -->
    <div id="mobile-menu" class="hidden lg:hidden fixed top-20 left-0 right-0 bg-white rounded-b-xl shadow-2xl p-6 mx-4 z-50 ">
        <div class="flex flex-col gap-4">
            @if(!Request::routeIs('fale-conosco'))
            <a href="#segmentos" class="text-gray-700 hover:text-sky-400 font-medium py-2 border-b border-gray-100">Segmentos</a>
            <a href="#como-funciona" class="text-gray-700 hover:text-sky-400 font-medium py-2 border-b border-gray-100">Plataforma</a>
            <a href="#institucional" class="text-gray-700 hover:text-sky-400 font-medium py-2 border-b border-gray-100">Institucional</a>
            @endif
            @if(Request::routeIs('fale-conosco'))
            <a href="{{ route('home') }}" class="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 font-semibold text-center mt-2">
                Home
            </a>
            @else
            <a href="{{ route('fale-conosco') }}" class="bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 font-semibold text-center mt-2">
                Solicitar acesso
            </a>
            @endif
            <a href="{{ route('login') }}" class="border-2 border-sky-500 text-sky-500 px-6 py-3 rounded-lg hover:bg-blue-50 font-semibold text-center">
                Acessar plataforma
            </a>
        </div>
    </div>
</nav>

