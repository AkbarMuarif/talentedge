import { db, auth } from "./firebase.js";
import { collection, addDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.bookTrainer = async function() {

    let user = auth.currentUser;

    if(!user){
        alert("Please login first");
        return;
    }

    let trainer = document.getElementById("trainer").value;
    let packageType = document.getElementById("package").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    await addDoc(collection(db, "bookings"), {
        email: user.email,
        trainer: trainer,
        package: packageType,
        date: date,
        time: time
    });

    alert("Booking Successful!");
}