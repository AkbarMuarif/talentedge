import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.register = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
        alert("Registered!");
        window.location.href = "booking.html";
    })
    .catch(error => alert(error.message));
}

window.login = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        window.location.href = "booking.html";
    })
    .catch(error => alert(error.message));
}