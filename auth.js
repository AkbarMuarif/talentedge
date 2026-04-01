import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.register = function() {
    let name = document.getElementById("name")?.value || "User";
    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let email = username + "@talentedge.com";

    if (!username || !password) {
        alert("Please fill in all fields");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        // Add user to Firestore with role 'user'
        await setDoc(doc(db, "users", userCredential.user.uid), {
            username: username,
            email: email,
            role: "user",
            name: name,
            createdAt: new Date()
        });
        alert("✅ Account created! Welcome to TalentEdge!");
        window.location.href = "booking.html";
    })
    .catch(error => {
        console.error(error);
        if (error.code === 'auth/email-already-in-use') {
            alert("This username is already taken");
        } else if (error.code === 'auth/weak-password') {
            alert("Password is too weak. Use at least 6 characters");
        } else {
            alert("Registration failed: " + error.message);
        }
    });
}

window.login = function() {
    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Special case for admin
    if (username === "admin" && password === "admin") {
        window.location.href = "admin.html";
        alert("✅ Welcome Admin!");
        return;
    }

    let email = username + "@talentedge.com";

    if (!username || !password) {
        alert("Please fill in all fields");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "booking.html";
            }
        } else {
            // Fallback if no role found
            window.location.href = "booking.html";
        }
        alert("✅ Welcome back!");
    })
    .catch(error => {
        console.error(error);
        if (error.code === 'auth/user-not-found') {
            alert("Username not found. Try registering first");
        } else if (error.code === 'auth/wrong-password') {
            alert("Wrong password");
        } else {
            alert("Login failed: " + error.message);
        }
    });
}