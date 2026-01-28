import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCP0aVVyOIJ-VyqKqGj0nrtT2z6LMIIz_k",
  authDomain: "nur-live-app.firebaseapp.com",
  databaseURL: "https://nur-live-app-default-rtdb.firebaseio.com/", 
  projectId: "nur-live-app",
  storageBucket: "nur-live-app.firebasestorage.app",
  messagingSenderId: "66758079300",
  appId: "1:66758079300:web:c098592f0573410ebddd11"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ምዝገባውን ለመቆጣጠር
window.registerAndNext = function() {
    const name = document.getElementById('studentName').value;
    const phone = document.getElementById('phoneNumber').value;

    if (name === "" || phone === "") {
        alert("እባክዎ ስም እና ስልክ ቁጥር ያስገቡ!");
        return;
    }

    const studentsRef = ref(db, 'students');
    const newStudentRef = push(studentsRef);
    
    set(newStudentRef, {
        fullName: name,
        phone: phone,
        date: new Date().toLocaleString()
    }).then(() => {
        document.getElementById('registration-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    }).catch((error) => {
        alert("ስህተት፡ " + error.message);
    });
}

// የቀጥታ ስርጭት ክፍሉን ለመክፈት (ስህተቱን የሚያጠፋው ይሄ ነው)
window.startLesson = function() {
    const className = document.getElementById('className').value;
    if (className === "") {
        alert("እባክዎ የክፍል ስም ያስገቡ!");
        return;
    }
    alert(className + " ክፍል ውስጥ ገብተዋል። ስርጭቱ ይጀምራል!");
}
