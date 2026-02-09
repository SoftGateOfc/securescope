// ==========================================
// 1. SMOOTH SCROLL PARA ÂNCORAS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Fechar menu mobile se estiver aberto
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            // Scroll suave com offset para compensar navbar
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 2. MENU MOBILE TOGGLE
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// ==========================================
// 3. FADE IN ON SCROLL (ANIMAÇÕES)
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animação de entrada nas seções (exceto a primeira - hero)
document.querySelectorAll('section').forEach((section, index) => {
    if (index > 0) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    }
});

// ==========================================
// 4. NAVBAR STICKY AO SCROLLAR 
// ==========================================
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 100) {
            nav.classList.add('sticky', 'top-0', 'z-50', 'bg-white/95', 'backdrop-blur-sm', 'shadow-md');
        } else {
            nav.classList.remove('sticky', 'top-0', 'z-50', 'bg-white/95', 'backdrop-blur-sm', 'shadow-md');
        }
    }
});

