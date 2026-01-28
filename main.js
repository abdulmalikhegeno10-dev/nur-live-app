import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase Configuration
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

// 1. የተማሪዎች ምዝገባ ተግባር
window.registerAndNext = function() {
    const name = document.getElementById('studentName').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();

    if (name === "" || phone === "") {
        alert("እባክዎ ስም እና ስልክ በትክክል ያስገቡ!");
        return;
    }

    const studentsRef = ref(db, 'students');
    
    // ዳታውን ወደ Firebase መላክ
    push(studentsRef, {
        fullName: name,
        phone: phone,
        date: new Date().toLocaleString('am-ET') // በኢትዮጵያ አቆጣጠር እንዲሆን
    })
    .then(() => {
        alert("በተሳካ ሁኔታ ተመዝግበዋል!");
        // ምዝገባው ሲያልቅ ክፍሎቹን መቀያየር
        document.getElementById('registration-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    })
    .catch((error) => {
        console.error("Error adding student: ", error);
        alert("ምዝገባው አልተሳካም፣ እባክዎ ድጋሚ ይሞክሩ።");
    });
};

// 2. የቪዲዮ ትምህርቱን የመጀመር ተግባር
window.startLesson = function() {
    const className = document.getElementById('className').value.trim();
    const meetContainer = document.querySelector('#meet');

    if (className === "") { 
        alert("እባክዎ የክፍል ስም ያስገቡ!"); 
        return; 
    }

    // Jitsi API መጫኑን ማረጋገጥ
    if (typeof JitsiMeetExternalAPI === 'undefined') {
        alert("የቪዲዮ ማገናኛው አልተጫነም (Jitsi Script is missing)");
        return;
    }

    const domain = 'meet.jit.si';
    const options = {
        roomName: 'NurLive-' + className.replace(/\s+/g, '-'), // ክፍተቶችን በ ሰረዝ (-) መተካት
        width: '100%',
        height: 500,
        parentNode: meetContainer,
        configOverwrite: { 
            disableDeepLinking: true, 
            prejoinPageEnabled: false 
        },
        interfaceConfigOverwrite: { 
            SHOW_JITSI_WATERMARK: false,
            MOBILE_APP_PROMO: false 
        }
    };

    // የቆየ የቪዲዮ መስኮት ካለ ማጽዳት
    meetContainer.innerHTML = "";
    
    // አዲሱን የቪዲዮ መስኮት መክፈት
    new JitsiMeetExternalAPI(domain, options);
};
