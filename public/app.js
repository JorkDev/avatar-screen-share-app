document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000');
    console.log('Document is ready');

    // Handle Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('Sending registration data:', { email, password });  // Log the data being sent

            try {
                const res = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                console.log('Registration response:', data);  // Log the response from the server
                if (res.ok) {
                    window.location.href = 'login.html';  // Redirect on success
                } else {
                    document.getElementById('registerMessage').textContent = data.message;
                }
            } catch (err) {
                console.error('Error during registration:', err);  // Log any errors
                document.getElementById('registerMessage').textContent = 'Error during registration.';
            }
        });
    }

    // Handle Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log('Sending login data:', { email, password });  // Log the data being sent

            try {
                const res = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                console.log('Login response:', data);  // Log the response from the server
                if (res.ok) {
                    localStorage.setItem('userId', data.userId);  // Save userId to localStorage
                    window.location.href = 'dashboard.html';  // Redirect to dashboard
                } else {
                    document.getElementById('loginMessage').textContent = data.message;
                }
            } catch (err) {
                console.error('Error during login:', err);  // Log any errors
                document.getElementById('loginMessage').textContent = 'Error during login.';
            }
        });
    }

    // Create Room
    const createRoomBtn = document.getElementById('createRoomBtn');
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', async () => {
            const userId = localStorage.getItem('userId');
            const res = await fetch('http://localhost:3000/api/create-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ host_id: userId })
            });

            const data = await res.json();
            if (res.ok) {
                const roomLink = `room.html?roomId=${data.roomId}`;
                window.location.href = roomLink;
            }
        });
    }

    // Chat in Room
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    if (roomId) {
        const chatForm = document.getElementById('chatForm');
        const chatMessages = document.getElementById('chatMessages');

        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = document.getElementById('chatInput').value;
            socket.emit('chatMessage', { roomId, message, user: localStorage.getItem('userId') });
            document.getElementById('chatInput').value = '';
        });

        socket.on('chatMessage', (data) => {
            if (data.roomId === roomId) {
                chatMessages.innerHTML += `<p><strong>${data.user}:</strong> ${data.message}</p>`;
            }
        });
    }
});
