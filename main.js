// የተማሪውን ስም ለጊዜው ለመያዝ
let currentStudentName = ""; 

// 1. ተመዝግቦ ወደ ቀጣዩ ክፍል ማለፍ
window.registerAndNext = function() {
    const nameInput = document.getElementById('studentName');
    const phoneInput = document.getElementById('phoneNumber');
    
    currentStudentName = nameInput.value.trim(); // ስሙን እዚህ እንይዘዋለን
    const phone = phoneInput.value.trim();

    if (currentStudentName === "" || phone === "") {
        alert("እባክዎ ስም እና ስልክ ያስገቡ!");
        return;
    }

    // Firebase ላይ መረጃውን መመዝገብ
    push(ref(db, 'students'), {
        fullName: currentStudentName,
        phone: phone,
        date: new Date().toLocaleString('am-ET')
    }).then(() => {
        // የምዝገባውን ፎርም መደበቅ
        document.getElementById('registration-section').style.display = 'none';
        // የቪዲዮ መግቢያውን ማሳየት
        document.getElementById('login-section').style.display = 'block';
    }).catch(err => alert("ስህተት አጋጥሟል፦ " + err.message));
};

// 2. የቪዲዮ ትምህርት መጀመር
window.startLesson = function() {
    const className = document.getElementById('className').value.trim();
    if (className === "") { alert("እባክዎ የክፍል ስም ያስገቡ!"); return; }

    const domain = 'meet.jit.si';
    const options = {
        roomName: 'NurLive-' + className.replace(/\s+/g, '-'),
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#meet'),
        
        // --- ማስታወቂያውን ለማጥፋት እና በቀጥታ ለማስገባት ---
        configOverwrite: { 
            disableDeepLinking: true,   // "Join in App" የሚለውን ገጽ ያጠፋል
            prejoinPageEnabled: false,  // "Join Meeting" የሚለውን ቁልፍ ሳያስነካ ያስገባል
            startWithAudioMuted: false, // በኦዲዮ በቀጥታ እንዲገባ
            startWithVideoMuted: false  // በቪዲዮ በቀጥታ እንዲገባ
        },
        
        interfaceConfigOverwrite: { 
            MOBILE_APP_PROMO: false,    // የሞባይል አፕ ማስታወቂያን ይደብቃል
            SHOW_JITSI_WATERMARK: false 
        },

        // --- የተማሪውን ስም ለ Jitsi ማስተላለፍ ---
        userInfo: {
            displayName: currentStudentName // ተመዝግቦ የገባበት ስም
        }
    };
    
    // የቆየ የቪዲዮ መስኮት ካለ ማጽዳት
    document.getElementById('meet').innerHTML = ""; 
    
    // አዲሱን የቪዲዮ ስብሰባ መጀመር
    new JitsiMeetExternalAPI(domain, options);
};
