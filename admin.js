import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadBookings() {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    let list = document.getElementById("list");

    querySnapshot.forEach((doc) => {
        let data = doc.data();

        list.innerHTML += `
        <p>
        Email: ${data.email} <br>
        Trainer: ${data.trainer} <br>
        Package: ${data.package} <br>
        Date: ${data.date} <br>
        Time: ${data.time}
        </p>
        <hr>
        `;
    });
}

loadBookings();