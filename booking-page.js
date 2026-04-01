// booking-page.js
import { auth, db } from "./firebase.js";
import { dataManager } from "./data-manager.js";
import { collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;

// Check user authentication
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    currentUser = user;
    loadBookingPage();
});

async function loadBookingPage() {
    await dataManager.init();
    
    loadDropdowns();
    loadUserBookings();
}

function loadDropdowns() {
    // Load subjects
    const subjects = dataManager.getSubjects();
    const subjectSelect = document.getElementById("subject");
    subjectSelect.innerHTML = '<option value="">Choose a subject...</option>' + 
        subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    // Load trainers
    const trainers = dataManager.getTrainers();
    const trainerSelect = document.getElementById("trainer");
    trainerSelect.innerHTML = '<option value="">Choose a trainer...</option>' + 
        trainers.map(t => `<option value="${t.id}">${t.name} - ${t.specialty}</option>`).join('');

    // Load packages
    const packages = dataManager.getPackages();
    const packageSelect = document.getElementById("package");
    packageSelect.innerHTML = '<option value="">Choose a package...</option>' + 
        packages.map(p => `<option value="${p.id}">$${p.price} - ${p.name} (${p.duration})</option>`).join('');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("date").min = today;
}

async function loadUserBookings() {
    try {
        const q = query(collection(db, "bookings"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);
        
        const bookingsList = document.getElementById("bookingsList");
        
        if (querySnapshot.empty) {
            bookingsList.innerHTML = '<p class="empty-state">No bookings yet. Create one to get started! 🚀</p>';
            return;
        }

        const bookings = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() });
        });

        const trainersMap = Object.fromEntries(dataManager.getTrainers().map(t => [t.id, t.name]));
        const packagesMap = Object.fromEntries(dataManager.getPackages().map(p => [p.id, p.name]));
        const subjectsMap = Object.fromEntries(dataManager.getSubjects().map(s => [s.id, s.name]));

        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-item">
                <div class="booking-header">
                    <h3>${subjectsMap[booking.subject] || booking.subject}</h3>
                    <span class="booking-status">✅ Confirmed</span>
                </div>
                <div class="booking-details">
                    <p><strong>Trainer:</strong> ${trainersMap[booking.trainer] || booking.trainer}</p>
                    <p><strong>Package:</strong> ${packagesMap[booking.package] || booking.package}</p>
                    <p><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</p>
                    ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
                </div>
                <button onclick="deleteBooking('${booking.id}')" class="btn btn-danger btn-small">Cancel</button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading bookings:", error);
    }
}

window.bookTrainer = async function() {
    if (!currentUser) {
        alert("Please login first");
        return;
    }

    const subject = document.getElementById("subject").value;
    const trainer = document.getElementById("trainer").value;
    const packageType = document.getElementById("package").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const notes = document.getElementById("notes").value;

    if (!subject || !trainer || !packageType || !date || !time) {
        alert("Please fill in all required fields");
        return;
    }

    try {
        await addDoc(collection(db, "bookings"), {
            email: currentUser.email,
            userId: currentUser.uid,
            subject: subject,
            trainer: trainer,
            package: packageType,
            date: date,
            time: time,
            notes: notes,
            timestamp: new Date(),
            status: "confirmed"
        });

        alert("✅ Booking Successful! Check your bookings below.");
        
        document.getElementById("bookingForm").reset();
        loadUserBookings();
    } catch (error) {
        alert("Booking failed: " + error.message);
    }
};

window.deleteBooking = async function(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
        const { deleteDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        await deleteDoc(doc(db, "bookings", bookingId));
        alert("Booking cancelled");
        loadUserBookings();
    } catch (error) {
        alert("Error cancelling booking: " + error.message);
    }
};

window.logout = function() {
    auth.signOut().then(() => {
        window.location.href = "login.html";
    });
};
