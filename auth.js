import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.register = function() {
    let name = document.getElementById("name")?.value || "User";
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
        alert("✅ Account created! Welcome to TalentEdge!");
        window.location.href = "booking.html";
    })
    .catch(error => {
        console.error(error);
        if (error.code === 'auth/email-already-in-use') {
            alert("This email is already registered");
        } else if (error.code === 'auth/weak-password') {
            alert("Password is too weak. Use at least 6 characters");
        } else {
            alert("Registration failed: " + error.message);
        }
    });
}

window.login = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        alert("✅ Welcome back!");
        window.location.href = "booking.html";
    })
    .catch(error => {
        console.error(error);
        if (error.code === 'auth/user-not-found') {
            alert("Email not found. Try registering first");
        } else if (error.code === 'auth/wrong-password') {
            alert("Wrong password");
        } else {
            alert("Login failed: " + error.message);
        }
    });
}