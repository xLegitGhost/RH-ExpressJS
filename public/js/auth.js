document.addEventListener('DOMContentLoaded', () => {
    // Si ya hay token, redirigir al dashboard
    if (localStorage.getItem('jwt_token')) {
        window.location.href = '/dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando...';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Guardar JWT
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirigir al dashboard
            window.location.href = '/dashboard.html';

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Sesión';
        }
    });
});
