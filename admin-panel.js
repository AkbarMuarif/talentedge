// admin-panel.js
import { db } from "./firebase.js";
import { dataManager } from "./data-manager.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentEditingId = null;
let currentEditingType = null;

async function initAdmin() {
    await dataManager.init();
    showTab("dashboard");
    updateDashboard();
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll(".admin-tab").forEach(tab => {
        tab.classList.remove("active");
    });
    
    // Remove active from all sidebar buttons
    document.querySelectorAll(".sidebar-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add("active");
    
    // Add active to clicked button
    event.target.classList.add("active");
    
    // Load content
    if (tabName === "trainers") loadTrainers();
    else if (tabName === "packages") loadPackages();
    else if (tabName === "subjects") loadSubjects();
    else if (tabName === "bookings") loadBookings();
}

function updateDashboard() {
    document.getElementById("totalTrainers").textContent = dataManager.getTrainers().length;
    document.getElementById("totalPackages").textContent = dataManager.getPackages().length;
    document.getElementById("totalSubjects").textContent = dataManager.getSubjects().length;
    loadBookingsCount();
}

async function loadBookingsCount() {
    try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        document.getElementById("totalBookings").textContent = querySnapshot.size;
    } catch (error) {
        console.error("Error loading bookings count:", error);
    }
}

function loadTrainers() {
    const trainers = dataManager.getTrainers();
    const trainersList = document.getElementById("trainersList");
    
    trainersList.innerHTML = trainers.map(trainer => `
        <div class="admin-item-card">
            <div class="item-avatar">${trainer.image || '👨‍🏫'}</div>
            <h3>${trainer.name}</h3>
            <p class="item-subtitle">${trainer.specialty}</p>
            <p class="item-bio">${trainer.bio || ''}</p>
            <div class="item-rating">⭐ ${trainer.rating || 5}/5</div>
            <div class="item-actions">
                <button onclick="editTrainer('${trainer.id}')" class="btn btn-secondary btn-small">Edit</button>
                <button onclick="deleteTrainer('${trainer.id}')" class="btn btn-danger btn-small">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadPackages() {
    const packages = dataManager.getPackages();
    const packagesList = document.getElementById("packagesList");
    
    packagesList.innerHTML = packages.map(pkg => `
        <div class="admin-item-card">
            <h3>$${pkg.price}</h3>
            <p class="item-title">${pkg.name}</p>
            <p class="item-subtitle">${pkg.duration}</p>
            <p class="item-bio">${pkg.description}</p>
            <p>📚 ${pkg.sessions} Sessions</p>
            <div class="item-actions">
                <button onclick="editPackage('${pkg.id}')" class="btn btn-secondary btn-small">Edit</button>
                <button onclick="deletePackage('${pkg.id}')" class="btn btn-danger btn-small">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadSubjects() {
    const subjects = dataManager.getSubjects();
    const subjectsList = document.getElementById("subjectsList");
    
    subjectsList.innerHTML = subjects.map(subject => `
        <div class="admin-item-card">
            <div class="item-avatar">${subject.icon || '📚'}</div>
            <h3>${subject.name}</h3>
            <p class="item-bio">${subject.description}</p>
            <div class="item-actions">
                <button onclick="editSubject('${subject.id}')" class="btn btn-secondary btn-small">Edit</button>
                <button onclick="deleteSubject('${subject.id}')" class="btn btn-danger btn-small">Delete</button>
            </div>
        </div>
    `).join('');
}

async function loadBookings() {
    try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const bookingsList = document.getElementById("bookingsList");
        
        if (querySnapshot.empty) {
            bookingsList.innerHTML = '<p class="no-data">No bookings yet</p>';
            return;
        }
        
        const trainersMap = Object.fromEntries(dataManager.getTrainers().map(t => [t.id, t.name]));
        const packagesMap = Object.fromEntries(dataManager.getPackages().map(p => [p.id, p.name]));
        const subjectsMap = Object.fromEntries(dataManager.getSubjects().map(s => [s.id, s.name]));
        
        let html = '<table class="admin-table"><thead><tr><th>User Email</th><th>Subject</th><th>Trainer</th><th>Package</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>';
        
        querySnapshot.forEach((doc) => {
            const booking = doc.data();
            html += `
                <tr>
                    <td>${booking.email}</td>
                    <td>${subjectsMap[booking.subject] || booking.subject}</td>
                    <td>${trainersMap[booking.trainer] || booking.trainer}</td>
                    <td>${packagesMap[booking.package] || booking.package}</td>
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td><span class="status-badge">${booking.status || 'pending'}</span></td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        bookingsList.innerHTML = html;
    } catch (error) {
        console.error("Error loading bookings:", error);
        document.getElementById("bookingsList").innerHTML = '<p class="error">Error loading bookings</p>';
    }
}

// TRAINER MODALS
window.openTrainerModal = function() {
    currentEditingId = null;
    currentEditingType = 'trainer';
    document.getElementById("trainerModalTitle").textContent = "Add Trainer";
    document.getElementById("trainerName").value = "";
    document.getElementById("trainerSpecialty").value = "";
    document.getElementById("trainerBio").value = "";
    document.getElementById("trainerImage").value = "👨‍🏫";
    document.getElementById("trainerRating").value = "5";
    document.getElementById("trainerModal").style.display = "block";
};

window.closeTrainerModal = function() {
    document.getElementById("trainerModal").style.display = "none";
};

window.editTrainer = function(id) {
    const trainer = dataManager.getTrainers().find(t => t.id === id);
    if (!trainer) return;
    
    currentEditingId = id;
    currentEditingType = 'trainer';
    document.getElementById("trainerModalTitle").textContent = "Edit Trainer";
    document.getElementById("trainerName").value = trainer.name;
    document.getElementById("trainerSpecialty").value = trainer.specialty;
    document.getElementById("trainerBio").value = trainer.bio || "";
    document.getElementById("trainerImage").value = trainer.image || "👨‍🏫";
    document.getElementById("trainerRating").value = trainer.rating || 5;
    document.getElementById("trainerModal").style.display = "block";
};

window.saveTrainer = async function() {
    const data = {
        name: document.getElementById("trainerName").value,
        specialty: document.getElementById("trainerSpecialty").value,
        bio: document.getElementById("trainerBio").value,
        image: document.getElementById("trainerImage").value,
        rating: parseFloat(document.getElementById("trainerRating").value)
    };
    
    try {
        if (currentEditingId) {
            await dataManager.updateTrainer(currentEditingId, data);
            alert("✅ Trainer updated!");
        } else {
            await dataManager.addTrainer(data);
            alert("✅ Trainer added!");
        }
        closeTrainerModal();
        loadTrainers();
        updateDashboard();
    } catch (error) {
        alert("Error: " + error.message);
    }
};

window.deleteTrainer = function(id) {
    if (!confirm("Are you sure you want to delete this trainer?")) return;
    
    dataManager.deleteTrainer(id).then(() => {
        alert("✅ Trainer deleted");
        loadTrainers();
        updateDashboard();
    }).catch(error => alert("Error: " + error.message));
};

// PACKAGE MODALS
window.openPackageModal = function() {
    currentEditingId = null;
    currentEditingType = 'package';
    document.getElementById("packageModalTitle").textContent = "Add Package";
    document.getElementById("packageName").value = "";
    document.getElementById("packagePrice").value = "";
    document.getElementById("packageDuration").value = "";
    document.getElementById("packageSessions").value = "";
    document.getElementById("packageDescription").value = "";
    document.getElementById("packageModal").style.display = "block";
};

window.closePackageModal = function() {
    document.getElementById("packageModal").style.display = "none";
};

window.editPackage = function(id) {
    const pkg = dataManager.getPackages().find(p => p.id === id);
    if (!pkg) return;
    
    currentEditingId = id;
    currentEditingType = 'package';
    document.getElementById("packageModalTitle").textContent = "Edit Package";
    document.getElementById("packageName").value = pkg.name;
    document.getElementById("packagePrice").value = pkg.price;
    document.getElementById("packageDuration").value = pkg.duration;
    document.getElementById("packageSessions").value = pkg.sessions;
    document.getElementById("packageDescription").value = pkg.description || "";
    document.getElementById("packageModal").style.display = "block";
};

window.savePackage = async function() {
    const data = {
        name: document.getElementById("packageName").value,
        price: parseInt(document.getElementById("packagePrice").value),
        duration: document.getElementById("packageDuration").value,
        sessions: parseInt(document.getElementById("packageSessions").value),
        description: document.getElementById("packageDescription").value
    };
    
    try {
        if (currentEditingId) {
            await dataManager.updatePackage(currentEditingId, data);
            alert("✅ Package updated!");
        } else {
            await dataManager.addPackage(data);
            alert("✅ Package added!");
        }
        closePackageModal();
        loadPackages();
        updateDashboard();
    } catch (error) {
        alert("Error: " + error.message);
    }
};

window.deletePackage = function(id) {
    if (!confirm("Are you sure you want to delete this package?")) return;
    
    dataManager.deletePackage(id).then(() => {
        alert("✅ Package deleted");
        loadPackages();
        updateDashboard();
    }).catch(error => alert("Error: " + error.message));
};

// SUBJECT MODALS
window.openSubjectModal = function() {
    currentEditingId = null;
    currentEditingType = 'subject';
    document.getElementById("subjectModalTitle").textContent = "Add Subject";
    document.getElementById("subjectName").value = "";
    document.getElementById("subjectDescription").value = "";
    document.getElementById("subjectIcon").value = "📚";
    document.getElementById("subjectModal").style.display = "block";
};

window.closeSubjectModal = function() {
    document.getElementById("subjectModal").style.display = "none";
};

window.editSubject = function(id) {
    const subject = dataManager.getSubjects().find(s => s.id === id);
    if (!subject) return;
    
    currentEditingId = id;
    currentEditingType = 'subject';
    document.getElementById("subjectModalTitle").textContent = "Edit Subject";
    document.getElementById("subjectName").value = subject.name;
    document.getElementById("subjectDescription").value = subject.description || "";
    document.getElementById("subjectIcon").value = subject.icon || "📚";
    document.getElementById("subjectModal").style.display = "block";
};

window.saveSubject = async function() {
    const data = {
        name: document.getElementById("subjectName").value,
        description: document.getElementById("subjectDescription").value,
        icon: document.getElementById("subjectIcon").value
    };
    
    try {
        if (currentEditingId) {
            await dataManager.updateSubject(currentEditingId, data);
            alert("✅ Subject updated!");
        } else {
            await dataManager.addSubject(data);
            alert("✅ Subject added!");
        }
        closeSubjectModal();
        loadSubjects();
        updateDashboard();
    } catch (error) {
        alert("Error: " + error.message);
    }
};

window.deleteSubject = function(id) {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    
    dataManager.deleteSubject(id).then(() => {
        alert("✅ Subject deleted");
        loadSubjects();
        updateDashboard();
    }).catch(error => alert("Error: " + error.message));
};

window.logout = function() {
    window.location.href = "index.html";
};

// Close modal when clicking outside
window.onclick = function(event) {
    const trainerModal = document.getElementById("trainerModal");
    const packageModal = document.getElementById("packageModal");
    const subjectModal = document.getElementById("subjectModal");
    
    if (event.target === trainerModal) trainerModal.style.display = "none";
    if (event.target === packageModal) packageModal.style.display = "none";
    if (event.target === subjectModal) subjectModal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", initAdmin);
