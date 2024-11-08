document.getElementById('likeButton').addEventListener('click', () => handleFeedback(true));
document.getElementById('dislikeButton').addEventListener('click', () => handleFeedback(false));
document.getElementById('boundButton').addEventListener('click', () => boundContent());

function handleFeedback(like) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let currentTab = tabs[0];
        fetch('https://tu-backend.com/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer TOKEN_DE_AUTENTICACION'
            },
            body: JSON.stringify({
                url: currentTab.url,
                title: currentTab.title,
                like: like
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(like ? "¡Te gusta esta página!" : "¡No te gusta esta página!");
        })
        .catch(error => console.error('Error:', error));
    });
}

function boundContent() {
    fetch('https://tu-backend.com/api/bound', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer TOKEN_DE_AUTENTICACION'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Enviar mensaje al `service_worker` para abrir una nueva pestaña
        chrome.runtime.sendMessage({ action: 'openBound', url: data.url });
    })
    .catch(error => console.error('Error:', error));
}
