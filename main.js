document.getElementById('start-btn').onclick = function() {
    const roomName = document.getElementById('room-name').value;
    const userName = prompt("እባክዎ ስምዎን ያስገቡ:"); 
    const TEACHER_PASSWORD = "1234"; 

    if (roomName.length > 3 && userName) {
        const userRole = confirm("አስተማሪ ነዎት? (አዎ ከሆነ 'OK' ይጫኑ)");
        
        if (userRole) {
            const pass = prompt("የአስተማሪ የሚስጥር ቁልፍ ያስገቡ:");
            if (pass !== TEACHER_PASSWORD) {
                alert("የተሳሳተ ቁልፍ ነው!");
                return;
            }
        }

        document.getElementById('setup-container').style.display = 'none';
        document.getElementById('meet-container').style.display = 'block';

        const domain = 'meet.jit.si';
        const options = {
            roomName: roomName,
            width: '100%',
            height: '100%',
            parentNode: document.querySelector('#meet-container'),
            userInfo: { displayName: userName },
            
            configOverwrite: {
                prejoinPageEnabled: false,
                disableDeepLinking: true, // "Open in App" ባነርን ለመከልከል
                enableWelcomePage: false,
                disableThirdPartyRequests: true,
                dynamicBrandingUrl: '',
                hideConferenceTimer: true
            },
            
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                SHOW_BRAND_WATERMARK: false,
                SHOW_POWERED_BY: false,
                MOBILE_APP_PROMO: false, // አፕ ግብዣን ለመከልከል
                DEFAULT_BACKGROUND: '#064e3b',
                TOOLBAR_BUTTONS: userRole ? 
                    ['microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'chat', 'raisehand', 'videoquality', 'tileview', 'security', 'mute-everyone'] : 
                    ['microphone', 'camera', 'fullscreen', 'hangup', 'chat', 'raisehand']
            }
        };

        const api = new JitsiMeetExternalAPI(domain, options);

        // --- ማስታወቂያዎችን በሃይል ለመደበቅ (CSS HACK) ---
        api.on('videoConferenceJoined', () => {
            // ይህ ኮድ በቪድዮው ላይ ያሉ ማናቸውንም ሎጎዎች በሃይል ይደብቃል
            api.executeCommand('overwriteConfig', {
                customStyles: {
                    '.watermark': { display: 'none !important' },
                    '.leftwatermark': { display: 'none !important' },
                    '.mobile-app-promo': { display: 'none !important' }
                }
            });
        });

        // የተሳታፊዎች ቁጥር
        const countDiv = document.createElement('div');
        countDiv.style = "position:absolute; top:10px; left:10px; padding:10px; background:rgba(0,0,0,0.6); color:white; border-radius:5px; z-index:1000;";
        document.body.appendChild(countDiv);
        api.addEventListener('participantJoined', () => {
            countDiv.innerText = `ተሳታፊዎች: ${api.getNumberOfParticipants()}`;
        });

        api.addEventListener('videoConferenceLeft', () => { location.reload(); });
    }
};
