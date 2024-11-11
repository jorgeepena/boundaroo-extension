// Variables globales
let token = null;

// Actualizar el estado de autenticación
function updateAuthState() {
    document.getElementById('authSection').style.display = token ? 'none' : 'block';
    document.getElementById('contentSection').style.display = token ? 'block' : 'none';
}

// Iniciar sesión
document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://boundaroo.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
        token = data.token;
        await chrome.storage.sync.set({ token });
        updateAuthState();
    } else {
        alert('Login failed!');
    }
});

// Registrarse
document.getElementById('registerBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://boundaroo.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, password_confirmation: password })
    });

    const data = await response.json();
    if (response.ok) {
        token = data.token;
        await chrome.storage.sync.set({ token });
        updateAuthState();
    } else {
        alert('Registration failed!');
    }
});

// Obtener un sitio aleatorio
document.getElementById('boundBtn').addEventListener('click', async () => {
    const response = await fetch('https://boundaroo.com/api/bound', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
        const data = await response.json();
        chrome.tabs.create({ url: data.url });
    } else {
        alert('Failed to fetch random site.');
    }
});

// Dar "Like" al sitio actual
document.getElementById('likeBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const response = await fetch('https://boundaroo.com/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: tab.url })
    });

    if (response.ok) {
        alert('Site liked!');
    } else {
        alert('Failed to like site.');
    }
});

// Dar "No Like" al sitio actual
document.getElementById('dislikeBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const response = await fetch('https://boundaroo.com/api/dislike', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: tab.url })
    });

    if (response.ok) {
        alert('Site disliked!');
    } else {
        alert('Failed to dislike site.');
    }
});

// Cargar el token almacenado al inicio
chrome.storage.sync.get(['token'], (data) => {
    if (data.token) {
        token = data.token;
    }
    updateAuthState();
});
