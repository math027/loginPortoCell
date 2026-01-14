const authForm = document.getElementById('auth-form');
const mainBtn = document.getElementById('main-btn');
const toggleFormBtn = document.getElementById('toggle-form');
const nameGroup = document.getElementById('name-group');
const formTitle = document.getElementById('form-title');
const switchText = document.getElementById('switch-text');

let isLogin = true;

// Verifica se já está logado
if(localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        'success': 'check-circle',
        'warning': 'exclamation-circle',
        'error': 'times-circle',
        'info': 'info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icons[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

toggleFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    
    // Limpa campos ao trocar
    document.getElementById('auth-form').reset();

    if (isLogin) {
        formTitle.innerHTML = "PortoCell <span>Finance</span>";
        nameGroup.style.display = "none";
        document.getElementById('nome').removeAttribute('required');
        mainBtn.innerText = "Entrar";
        switchText.innerText = "Não tem uma conta?";
        toggleFormBtn.innerText = "Cadastre-se";
    } else {
        formTitle.innerHTML = "Criar <span>Conta</span>";
        nameGroup.style.display = "block";
        document.getElementById('nome').setAttribute('required', 'true');
        mainBtn.innerText = "Cadastrar";
        switchText.innerText = "Já possui conta?";
        toggleFormBtn.innerText = "Faça Login";
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const nome = document.getElementById('nome').value;

    const endpoint = isLogin ? '/login' : '/cadastrar';
    const payload = isLogin ? { email, senha } : { nome, email, senha };

    mainBtn.innerText = "Processando...";
    mainBtn.disabled = true;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification(result.message, 'success');
            
            if (isLogin) {
                // Salva o token e redireciona
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', result.user);
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            } else {
                setTimeout(() => toggleFormBtn.click(), 1000);
            }
        } else {
            showNotification(result.error || "Erro desconhecido", 'error');
        }
    } catch (err) {
        showNotification("Erro de conexão com o servidor.", 'error');
    } finally {
        mainBtn.innerText = isLogin ? "Entrar" : "Cadastrar";
        mainBtn.disabled = false;
    }
});

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
    this.classList.toggle('fa-eye');
});