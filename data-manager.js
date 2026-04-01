// data-manager.js - Centralized data management for trainers, packages, and subjects
import { db } from "./firebase.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

class DataManager {
    constructor() {
        this.trainers = [];
        this.packages = [];
        this.subjects = [];
        this.initialized = false;
    }

    // Initialize data - load from Firestore or localStorage
    async init() {
        if (this.initialized) return;
        
        try {
            await Promise.all([
                this.loadTrainers(),
                this.loadPackages(),
                this.loadSubjects()
            ]);
            this.initialized = true;
        } catch (error) {
            console.warn("Error loading from Firestore:", error);
            console.log("Using local storage fallback");
            this.loadFromLocalStorage();
            this.initialized = true;
        }
    }

    // TRAINERS
    async loadTrainers() {
        try {
            const querySnapshot = await getDocs(collection(db, "trainers"));
            this.trainers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            localStorage.setItem("talentedge_trainers", JSON.stringify(this.trainers));
        } catch (error) {
            console.log("Loading trainers from localStorage");
            const saved = localStorage.getItem("talentedge_trainers");
            this.trainers = saved ? JSON.parse(saved) : this.getDefaultTrainers();
        }
    }

    async addTrainer(trainerData) {
        try {
            const docRef = await addDoc(collection(db, "trainers"), trainerData);
            const newTrainer = { id: docRef.id, ...trainerData };
            this.trainers.push(newTrainer);
            localStorage.setItem("talentedge_trainers", JSON.stringify(this.trainers));
            return newTrainer;
        } catch (error) {
            console.error("Error adding trainer:", error);
            throw error;
        }
    }

    async updateTrainer(id, trainerData) {
        try {
            await updateDoc(doc(db, "trainers", id), trainerData);
            this.trainers = this.trainers.map(t => t.id === id ? { ...t, ...trainerData } : t);
            localStorage.setItem("talentedge_trainers", JSON.stringify(this.trainers));
        } catch (error) {
            console.error("Error updating trainer:", error);
            throw error;
        }
    }

    async deleteTrainer(id) {
        try {
            await deleteDoc(doc(db, "trainers", id));
            this.trainers = this.trainers.filter(t => t.id !== id);
            localStorage.setItem("talentedge_trainers", JSON.stringify(this.trainers));
        } catch (error) {
            console.error("Error deleting trainer:", error);
            throw error;
        }
    }

    getDefaultTrainers() {
        return [
            { id: "1", name: "Bobby", specialty: "Data & Excel", bio: "Senior Data Analyst with 8+ years experience", image: "👨‍💼", rating: 4.9 },
            { id: "2", name: "Akbar", specialty: "Career & Interview", bio: "HR Expert & Career Coach", image: "👨‍🏫", rating: 4.8 }
        ];
    }

    //PACKAGES
    async loadPackages() {
        try {
            const querySnapshot = await getDocs(collection(db, "packages"));
            this.packages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            localStorage.setItem("talentedge_packages", JSON.stringify(this.packages));
        } catch (error) {
            console.log("Loading packages from localStorage");
            const saved = localStorage.getItem("talentedge_packages");
            this.packages = saved ? JSON.parse(saved) : this.getDefaultPackages();
        }
    }

    async addPackage(packageData) {
        try {
            const docRef = await addDoc(collection(db, "packages"), packageData);
            const newPackage = { id: docRef.id, ...packageData };
            this.packages.push(newPackage);
            localStorage.setItem("talentedge_packages", JSON.stringify(this.packages));
            return newPackage;
        } catch (error) {
            console.error("Error adding package:", error);
            throw error;
        }
    }

    async updatePackage(id, packageData) {
        try {
            await updateDoc(doc(db, "packages", id), packageData);
            this.packages = this.packages.map(p => p.id === id ? { ...p, ...packageData } : p);
            localStorage.setItem("talentedge_packages", JSON.stringify(this.packages));
        } catch (error) {
            console.error("Error updating package:", error);
            throw error;
        }
    }

    async deletePackage(id) {
        try {
            await deleteDoc(doc(db, "packages", id));
            this.packages = this.packages.filter(p => p.id !== id);
            localStorage.setItem("talentedge_packages", JSON.stringify(this.packages));
        } catch (error) {
            console.error("Error deleting package:", error);
            throw error;
        }
    }

    getDefaultPackages() {
        return [
            { id: "1", name: "Starter", price: 99, duration: "4 weeks", sessions: 8, description: "Perfect for beginners" },
            { id: "2", name: "Professional", price: 199, duration: "8 weeks", sessions: 16, description: "Level up your skills" },
            { id: "3", name: "Elite", price: 399, duration: "12 weeks", sessions: 24, description: "Complete mastery program" }
        ];
    }

    // SUBJECTS
    async loadSubjects() {
        try {
            const querySnapshot = await getDocs(collection(db, "subjects"));
            this.subjects = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            localStorage.setItem("talentedge_subjects", JSON.stringify(this.subjects));
        } catch (error) {
            console.log("Loading subjects from localStorage");
            const saved = localStorage.getItem("talentedge_subjects");
            this.subjects = saved ? JSON.parse(saved) : this.getDefaultSubjects();
        }
    }

    async addSubject(subjectData) {
        try {
            const docRef = await addDoc(collection(db, "subjects"), subjectData);
            const newSubject = { id: docRef.id, ...subjectData };
            this.subjects.push(newSubject);
            localStorage.setItem("talentedge_subjects", JSON.stringify(this.subjects));
            return newSubject;
        } catch (error) {
            console.error("Error adding subject:", error);
            throw error;
        }
    }

    async updateSubject(id, subjectData) {
        try {
            await updateDoc(doc(db, "subjects", id), subjectData);
            this.subjects = this.subjects.map(s => s.id === id ? { ...s, ...subjectData } : s);
            localStorage.setItem("talentedge_subjects", JSON.stringify(this.subjects));
        } catch (error) {
            console.error("Error updating subject:", error);
            throw error;
        }
    }

    async deleteSubject(id) {
        try {
            await deleteDoc(doc(db, "subjects", id));
            this.subjects = this.subjects.filter(s => s.id !== id);
            localStorage.setItem("talentedge_subjects", JSON.stringify(this.subjects));
        } catch (error) {
            console.error("Error deleting subject:", error);
            throw error;
        }
    }

    getDefaultSubjects() {
        return [
            { id: "1", name: "Excel Mastery", description: "Advanced Excel skills", icon: "📊" },
            { id: "2", name: "Data Analytics", description: "Data interpretation", icon: "📈" },
            { id: "3", name: "Communication", description: "Professional communication", icon: "🎤" },
            { id: "4", name: "Interview Prep", description: "Interview techniques", icon: "🤝" }
        ];
    }

    loadFromLocalStorage() {
        this.trainers = JSON.parse(localStorage.getItem("talentedge_trainers")) || this.getDefaultTrainers();
        this.packages = JSON.parse(localStorage.getItem("talentedge_packages")) || this.getDefaultPackages();
        this.subjects = JSON.parse(localStorage.getItem("talentedge_subjects")) || this.getDefaultSubjects();
    }

    getTrainers() { return this.trainers; }
    getPackages() { return this.packages; }
    getSubjects() { return this.subjects; }
}

export const dataManager = new DataManager();
