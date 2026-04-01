// landing.js
import { dataManager } from "./data-manager.js";

async function loadLandingData() {
    await dataManager.init();
    
    loadTrainers();
    loadPackages();
}

function loadTrainers() {
    const trainers = dataManager.getTrainers();
    const trainersList = document.getElementById("trainers-list");
    
    trainersList.innerHTML = trainers.map(trainer => `
        <div class="trainer-card">
            <div class="trainer-avatar">${trainer.image || '👨‍💼'}</div>
            <h3>${trainer.name}</h3>
            <p class="trainer-specialty">${trainer.specialty}</p>
            <p class="trainer-bio">${trainer.bio || ''}</p>
            <div class="trainer-rating">⭐ ${trainer.rating || 5}/5</div>
        </div>
    `).join('');
}

function loadPackages() {
    const packages = dataManager.getPackages();
    const packagesList = document.getElementById("packages-list");
    
    packagesList.innerHTML = packages.map(pkg => `
        <div class="package-card">
            <div class="package-header">
                <h3>${pkg.name}</h3>
                <div class="package-price">$${pkg.price}</div>
            </div>
            <p class="package-description">${pkg.description}</p>
            <ul class="package-features">
                <li>⏱️ ${pkg.duration}</li>
                <li>📚 ${pkg.sessions} Sessions</li>
            </ul>
            <a href="register.html" class="btn btn-secondary btn-small">Choose Plan</a>
        </div>
    `).join('');
}

document.addEventListener("DOMContentLoaded", loadLandingData);
