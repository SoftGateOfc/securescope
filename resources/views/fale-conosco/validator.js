document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contato");

    const nome = form.nome;
    const empresa = form.empresa;
    const email = form.email;
    const telefone = form.telefone;

 // Mostra erro visual
    const showError = (input, message = null) => {
    input.classList.add("border-red-500");

    
    if (!message) return;

    let error = input.parentNode.querySelector(".error-msg");

    if (!error) {
        error = document.createElement("span");
        error.className =
            "error-msg text-red-500 text-sm mt-1 block transition-opacity duration-300";
        input.parentNode.appendChild(error);
    }

    error.innerText = message;

};
 //valida
    const clearError = (input) => {
        input.classList.remove("border-red-500");

        const error = input.parentNode.querySelector(".error-msg");
        if (error) error.remove();
    };

    const isEmailValid = (value) => {
        // exige @ + domínio + ponto
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    };

    const isPhoneValid = (value) => {
        // (99) 99999-9999 ou (99) 9999-9999
        return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value);
    };

    //ajusta telefone
   telefone.addEventListener("input", (e) => {
    let numbers = e.target.value.replace(/\D/g, "");

    let formatted = "";

    if (numbers.length > 0) {
        formatted = "(" + numbers.substring(0, 2);
    }

    if (numbers.length >= 3) {
        formatted += ") " + numbers.substring(2, 7);
    }

    if (numbers.length >= 8) {
        formatted += "-" + numbers.substring(7, 11);
    }

    e.target.value = formatted;
});


    nome.addEventListener("blur", () => {
        nome.value.length < 3
            ? showError(nome, "Digite nome completo")
            : clearError(nome);
    });

    empresa.addEventListener("blur", () => {
        empresa.value.length < 2
            ? showError(empresa, "Informe a empresa")
            : clearError(empresa);
    });

    email.addEventListener("blur", () => {
        !isEmailValid(email.value)
            ? showError(email, "Email inválido (ex: nome@empresa.com)")
            : clearError(email);
    });

    telefone.addEventListener("blur", () => {
        !isPhoneValid(telefone.value)
            ? showError(telefone, "Formato: (81) 99999-9999")
            : clearError(telefone);
    });

    

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;
    const campos = [nome, empresa, email, telefone];

    campos.forEach(clearError);

    if (nome.value.trim().length < 3) {
        showError(nome);
        valid = false;
    }

    if (empresa.value.trim().length < 2) {
        showError(empresa);
        valid = false;
    }

    if (!isEmailValid(email.value)) {
        showError(email);
        valid = false;
    }

    if (!isPhoneValid(telefone.value)) {
        showError(telefone);
        valid = false;
    }

    if (!valid) return;

    // ENVIAR VIA AJAX
    const btnSubmit = form.querySelector('button[type="submit"]');

    try {
        // Desabilita botão
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Enviando...';

        const response = await axios.post('/fale-conosco/enviar', {
            nome:     nome.value.trim(),
            empresa:  empresa.value.trim(),
            email:    email.value.trim(),
            telefone: telefone.value.trim()
        });

        if (response.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Solicitação Enviada!',
                text: response.data.message,
                confirmButtonColor: '#0ea5e9'
            });
            form.reset();
        }

    } catch (error) {
        let errorMessage = 'Erro ao enviar solicitação. Tente novamente.';

        // Rate limit atingido
        if (error.response?.status === 429) {
            errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        }

        Swal.fire({
            icon: 'error',
            title: 'Ops!',
            text: errorMessage,
            confirmButtonColor: '#ef4444'
        });

    } finally {
        // Cooldown 3 segundos
        setTimeout(() => {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Solicitar acesso';
        }, 3000);
    }
});
});
