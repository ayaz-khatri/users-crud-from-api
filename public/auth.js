const API_URL = `http://localhost:3000/api/users`;

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

if(registerForm){
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.querySelector('#registerUsername').value;
        const email = document.querySelector('#registerEmail').value;
        const password = document.querySelector('#registerPassword').value;

        const result = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, email, password})
        });

        const data = await result.json();

        if(result.ok){
            alert("Registration Successful.");
            window.location.href = 'login.html';
        }else{
            alert(data.message || "Registration Failed.");
        }
    })
}

if(loginForm){
        loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#loginEmail').value;
        const password = document.querySelector('#loginPassword').value;

        const result = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        const data = await result.json();

        if(result.ok){
            localStorage.setItem('token', data.token)
            window.location.href = 'students.html';
        }else{
            alert(data.message || "Login Failed.");
        }
    })
}
