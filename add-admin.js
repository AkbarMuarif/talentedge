// add-admin.js - Script to add admin user to database
import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Note: This script needs to be run manually to add the admin user
// Since Firebase Auth requires creating user through Auth, but for demo purposes,
// we'll add the user document. In production, create the user through Firebase Auth first.

async function addAdminUser() {
    try {
        // This assumes the admin user is already created in Firebase Auth with email admin@admin.com
        // For now, we'll add the document with a placeholder UID
        // In real scenario, get the UID from Auth
        const adminUID = "admin-uid-placeholder"; // Replace with actual UID after creating in Auth
        
        await setDoc(doc(db, "users", adminUID), {
            email: "admin@admin.com",
            username: "admin",
            role: "admin",
            createdAt: new Date()
        });
        
        console.log("Admin user added to database");
    } catch (error) {
        console.error("Error adding admin user:", error);
    }
}

// Uncomment to run
// addAdminUser();