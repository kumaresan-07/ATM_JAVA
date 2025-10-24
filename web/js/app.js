// API Configuration
const API_URL = 'http://localhost:3000/api';

let currentUser = null;

// Signup data storage
let signupData = {
    formNumber: '',
    page1: {},
    page2: {},
    page3: {}
};

// ==================== API HELPER FUNCTIONS ====================

async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();

        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Connection error. Please check if server is running.' };
    }
}

// Page Navigation
function showPage(pageId) {
    const pages = ['loginPage', 'transactionsPage', 'depositPage', 'withdrawPage', 'balancePage', 
                   'signupPage1', 'signupPage2', 'signupPage3', 'faceWidget'];
    pages.forEach(page => {
        const element = document.getElementById(page);
        if (element) {
            if (element.classList.contains('container')) {
                element.classList.add('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        if (targetPage.classList.contains('container')) {
            targetPage.classList.remove('hidden');
        } else {
            targetPage.classList.remove('hidden');
        }
    }
}

// Show the Face Recognition widget and hide other pages
function showFaceWidget() {
    // Hide all known pages
    const pages = ['loginPage', 'transactionsPage', 'depositPage', 'withdrawPage', 'balancePage', 
                   'signupPage1', 'signupPage2', 'signupPage3'];
    pages.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.classList.add('hidden');
    });

    // Stop camera on other widgets if any
    try { stopCamera(); } catch (e) { /* ignore */ }

    const fw = document.getElementById('faceWidget');
    if (fw) fw.classList.remove('hidden');

    // Ensure UI controls are in the correct state
    startCameraBtn.disabled = false;
    stopCameraBtn.disabled = true;
    captureBtn.disabled = true;

    // Focus the start button for accessibility
    setTimeout(() => startCameraBtn?.focus(), 150);
}

// ==================== LOGIN ====================

async function login() {
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const statusDiv = document.getElementById('loginStatus');

    // Validation
    if (!cardNumber || !pin) {
        showStatus(statusDiv, 'Please enter both card number and PIN', 'error');
        return;
    }

    showStatus(statusDiv, 'Logging in...', 'success');

    // Call API
    const result = await apiRequest('/login', 'POST', { cardNumber, pin });

    if (result.success) {
        currentUser = result.user;
        showStatus(statusDiv, 'Login Successful! Redirecting...', 'success');
        
        setTimeout(() => {
            showPage('transactionsPage');
            clearLogin();
        }, 1500);
    } else {
        showStatus(statusDiv, result.message || 'Invalid card number or PIN', 'error');
        
        // Shake animation on error
        const card = document.querySelector('.login-card');
        if (card) {
            card.style.animation = 'shake 0.5s';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        }
    }
}

// Clear Login Form
function clearLogin() {
    document.getElementById('cardNumber').value = '';
    document.getElementById('pin').value = '';
    const statusDiv = document.getElementById('loginStatus');
    if (statusDiv) statusDiv.style.display = 'none';
}

// ==================== SIGNUP ====================

async function showSignup() {
    // Generate unique form number from server
    const result = await apiRequest('/generate-form-number');
    
    if (result.success) {
        signupData.formNumber = result.formNumber;
        
        // Display form number on all pages
        document.getElementById('formNumber').textContent = signupData.formNumber;
        document.getElementById('formNumber2').textContent = signupData.formNumber;
        document.getElementById('formNumber3').textContent = signupData.formNumber;
        
        // Generate card number and PIN
        await generateCardAndPin();
        
        showPage('signupPage1');
    } else {
        alert('Error generating form number. Please check if server is running.');
    }
}

// Generate Card Number and PIN
async function generateCardAndPin() {
    // Generate unique card number from server
    const result = await apiRequest('/generate-card-number');
    
    if (result.success) {
        const cardNumber = result.cardNumber;
        const formattedCardNumber = cardNumber.match(/.{1,4}/g).join('-');
        
        // Generate 4-digit PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Store for later
        signupData.page3.cardNumber = cardNumber;
        signupData.page3.pin = pin;
        
        // Display on page 3
        document.getElementById('generatedCardNumber').textContent = formattedCardNumber;
        document.getElementById('generatedPinNumber').textContent = pin;
    }
}

// Signup Form 1 Handler
document.addEventListener('DOMContentLoaded', () => {
    const form1 = document.getElementById('signupForm1');
    if (form1) {
        form1.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const genderRadio = document.querySelector('input[name="gender"]:checked');
            const maritalRadio = document.querySelector('input[name="marital"]:checked');
            
            if (!genderRadio || !maritalRadio) {
                showStatus(document.getElementById('signup1Status'), 'Please select all required fields', 'error');
                return;
            }
            
            // Save page 1 data
            signupData.page1 = {
                formNumber: signupData.formNumber,
                name: document.getElementById('name').value.trim(),
                fatherName: document.getElementById('fatherName').value.trim(),
                dob: document.getElementById('dob').value,
                gender: genderRadio.value,
                email: document.getElementById('email').value.trim(),
                marital: maritalRadio.value,
                address: document.getElementById('address').value.trim(),
                city: document.getElementById('city').value.trim(),
                pincode: document.getElementById('pincode').value.trim(),
                state: document.getElementById('state').value.trim()
            };
            
            showStatus(document.getElementById('signup1Status'), 'Saving to database...', 'success');
            
            // Save to database
            const result = await apiRequest('/signup/page1', 'POST', signupData.page1);
            
            if (result.success) {
                showStatus(document.getElementById('signup1Status'), 'Details saved! Proceeding to next page...', 'success');
                setTimeout(() => {
                    showPage('signupPage2');
                    document.getElementById('signup1Status').style.display = 'none';
                }, 1000);
            } else {
                showStatus(document.getElementById('signup1Status'), result.message || 'Error saving data', 'error');
            }
        });
    }
});

// Signup Form 2 Handler
document.addEventListener('DOMContentLoaded', () => {
    const form2 = document.getElementById('signupForm2');
    if (form2) {
        form2.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const seniorRadio = document.querySelector('input[name="seniorCitizen"]:checked');
            const existingRadio = document.querySelector('input[name="existingAccount"]:checked');
            
            if (!seniorRadio || !existingRadio) {
                showStatus(document.getElementById('signup2Status'), 'Please select all required fields', 'error');
                return;
            }
            
            // Save page 2 data
            signupData.page2 = {
                formNumber: signupData.formNumber,
                religion: document.getElementById('religion').value,
                category: document.getElementById('category').value,
                income: document.getElementById('income').value,
                education: document.getElementById('education').value,
                occupation: document.getElementById('occupation').value,
                pan: document.getElementById('pan').value.trim().toUpperCase(),
                aadhar: document.getElementById('aadhar').value.trim(),
                seniorCitizen: seniorRadio.value,
                existingAccount: existingRadio.value
            };
            
            showStatus(document.getElementById('signup2Status'), 'Saving to database...', 'success');
            
            // Save to database
            const result = await apiRequest('/signup/page2', 'POST', signupData.page2);
            
            if (result.success) {
                showStatus(document.getElementById('signup2Status'), 'Details saved! Proceeding to final page...', 'success');
                setTimeout(() => {
                    showPage('signupPage3');
                    document.getElementById('signup2Status').style.display = 'none';
                }, 1000);
            } else {
                showStatus(document.getElementById('signup2Status'), result.message || 'Error saving data', 'error');
            }
        });
    }
});

// ==================== FACE ID CAPTURE FOR SIGNUP ====================
let signupCameraStream = null;
let signupFaceData = null;

async function startSignupCamera() {
    const video = document.getElementById('signupVideo');
    const statusEl = document.getElementById('signupFaceStatus');
    const startBtn = document.getElementById('startSignupCamera');
    const captureBtn = document.getElementById('captureSignupFace');
    
    console.log('startSignupCamera called');
    
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        statusEl.textContent = '❌ Your browser does not support camera access';
        statusEl.style.color = '#dc3545';
        alert('Camera access is not supported in your browser. Please use Chrome, Firefox, or Edge.');
        return;
    }
    
    try {
        statusEl.textContent = 'Requesting camera permission...';
        statusEl.style.color = '#007bff';
        
        signupCameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            }, 
            audio: false 
        });
        
        video.srcObject = signupCameraStream;
        video.style.display = 'block';
        startBtn.disabled = true;
        captureBtn.disabled = false;
        statusEl.textContent = '✓ Camera ready! Position your face in the frame and click Capture Face';
        statusEl.style.color = '#28a745';
    } catch (err) {
        console.error('Camera error:', err);
        let errorMsg = 'Camera access denied or not available';
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMsg = '❌ Camera permission denied. Please allow camera access and try again.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMsg = '❌ No camera found. Please connect a camera and try again.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMsg = '❌ Camera is being used by another application. Close other apps and try again.';
        } else if (err.name === 'NotSupportedError') {
            errorMsg = '❌ Camera access requires HTTPS. Make sure you are accessing via http://localhost:3000';
        }
        
        statusEl.textContent = errorMsg;
        statusEl.style.color = '#dc3545';
        alert(errorMsg + '\n\nError: ' + err.name + '\n\nMake sure you:\n1. Access via http://localhost:3000\n2. Allow camera permissions\n3. Camera is not used by other apps');
    }
}

function captureSignupFace() {
    const video = document.getElementById('signupVideo');
    const canvas = document.getElementById('signupCanvas');
    const preview = document.getElementById('signupFacePreview');
    const statusEl = document.getElementById('signupFaceStatus');
    const captureBtn = document.getElementById('captureSignupFace');
    const retakeBtn = document.getElementById('retakeSignupFace');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    preview.src = imageData;
    preview.style.display = 'block';
    video.style.display = 'none';
    
    // Stop camera
    if (signupCameraStream) {
        signupCameraStream.getTracks().forEach(track => track.stop());
        signupCameraStream = null;
    }
    
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    statusEl.textContent = 'Verifying face...';
    statusEl.style.color = '#007bff';
    
    // Send to Face++ for verification
    verifySignupFace(imageData);
}

async function verifySignupFace(imageData) {
    const statusEl = document.getElementById('signupFaceStatus');
    
    try {
        const base64Image = imageData.split(',')[1];
        const result = await apiRequest('/face/detect', 'POST', { image_base64: base64Image });
        
        if (result.success && result.data && result.data.faces && result.data.faces.length > 0) {
            const face = result.data.faces[0];
            signupFaceData = {
                image: imageData,
                token: face.face_token,
                faceRectangle: face.face_rectangle
            };
            statusEl.textContent = '✓ Face captured successfully! You can now submit the form.';
            statusEl.style.color = '#28a745';
        } else {
            statusEl.textContent = '⚠ No face detected. Please retake the photo.';
            statusEl.style.color = '#ffc107';
            signupFaceData = null;
        }
    } catch (err) {
        console.error('Face verification error:', err);
        statusEl.textContent = '✓ Face captured (offline mode). You can now submit the form.';
        statusEl.style.color = '#28a745';
        // Store image even if Face++ fails (for offline mode)
        signupFaceData = { image: imageData, token: null };
    }
}

function retakeSignupFace() {
    const video = document.getElementById('signupVideo');
    const preview = document.getElementById('signupFacePreview');
    const startBtn = document.getElementById('startSignupCamera');
    const captureBtn = document.getElementById('captureSignupFace');
    const retakeBtn = document.getElementById('retakeSignupFace');
    const statusEl = document.getElementById('signupFaceStatus');
    
    preview.style.display = 'none';
    retakeBtn.style.display = 'none';
    startBtn.disabled = false;
    captureBtn.disabled = true;
    statusEl.textContent = 'Click Start Camera to capture your face again';
    statusEl.style.color = '#666';
    signupFaceData = null;
}

function skipFaceId() {
    console.log('skipFaceId function called');
    
    const statusEl = document.getElementById('signupFaceStatus');
    const startBtn = document.getElementById('startSignupCamera');
    const captureBtn = document.getElementById('captureSignupFace');
    const retakeBtn = document.getElementById('retakeSignupFace');
    const skipBtn = document.getElementById('skipFaceId');
    const preview = document.getElementById('signupFacePreview');
    const video = document.getElementById('signupVideo');
    
    console.log('Elements found:', {
        statusEl: !!statusEl,
        startBtn: !!startBtn,
        captureBtn: !!captureBtn,
        retakeBtn: !!retakeBtn,
        skipBtn: !!skipBtn,
        preview: !!preview,
        video: !!video
    });
    
    // Stop camera if running
    if (signupCameraStream) {
        console.log('Stopping camera stream');
        signupCameraStream.getTracks().forEach(track => track.stop());
        signupCameraStream = null;
    }
    
    // Set a placeholder for skipped face
    signupFaceData = { 
        image: null, 
        token: null,
        skipped: true 
    };
    console.log('signupFaceData set to:', signupFaceData);
    
    if (video) video.style.display = 'none';
    if (preview) preview.style.display = 'none';
    if (startBtn) startBtn.disabled = true;
    if (captureBtn) captureBtn.disabled = true;
    if (retakeBtn) retakeBtn.style.display = 'none';
    if (skipBtn) {
        skipBtn.disabled = true;
        skipBtn.textContent = 'Face ID Skipped ✓';
        skipBtn.classList.remove('btn-warning');
        skipBtn.classList.add('btn-success');
    }
    
    if (statusEl) {
        statusEl.innerHTML = '✅ <strong>Face ID skipped.</strong> You can proceed with signup. (Face ID can be added later for enhanced security)';
        statusEl.style.color = '#28a745';
    }
    
    console.log('skipFaceId function completed successfully');
}

// Add event listener for Skip Face ID button
document.addEventListener('DOMContentLoaded', () => {
    const skipBtn = document.getElementById('skipFaceId');
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            console.log('Skip button clicked via event listener');
            skipFaceId();
        });
    }
});

// Signup Form 3 Handler
document.addEventListener('DOMContentLoaded', () => {
    const form3 = document.getElementById('signupForm3');
    if (form3) {
        form3.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const accountTypeRadio = document.querySelector('input[name="accountType"]:checked');
            const declaration = document.getElementById('declaration');
            
            if (!accountTypeRadio) {
                showStatus(document.getElementById('signup3Status'), 'Please select account type', 'error');
                return;
            }
            
            if (!declaration.checked) {
                showStatus(document.getElementById('signup3Status'), 'Please accept the declaration', 'error');
                return;
            }
            
            // Check if face is captured or skipped
            if (!signupFaceData) {
                showStatus(document.getElementById('signup3Status'), 'Please capture your face ID or click Skip', 'error');
                document.getElementById('signupFaceStatus').textContent = '⚠ Please either capture Face ID or skip to continue';
                document.getElementById('signupFaceStatus').style.color = '#dc3545';
                return;
            }
            
            // Get selected services
            const servicesCheckboxes = document.querySelectorAll('input[name="services"]:checked');
            const services = Array.from(servicesCheckboxes).map(cb => cb.value);
            
            // Save page 3 data
            signupData.page3.accountType = accountTypeRadio.value;
            signupData.page3.services = services;
            
            const page3Data = {
                formNumber: signupData.formNumber,
                accountType: signupData.page3.accountType,
                cardNumber: signupData.page3.cardNumber,
                pin: signupData.page3.pin,
                services: services,
                faceToken: signupFaceData.token,
                faceImage: signupFaceData.image
            };
            
            showStatus(document.getElementById('signup3Status'), 'Creating account...', 'success');
            
            // Save to database
            const result = await apiRequest('/signup/page3', 'POST', page3Data);
            
            if (result.success) {
                showStatus(document.getElementById('signup3Status'), 'Account created successfully!', 'success');
                
                // Show confirmation alert with credentials
                setTimeout(() => {
                    alert(`🎉 Account Created Successfully!\n\n` +
                          `Form Number: ${signupData.formNumber}\n` +
                          `Card Number: ${signupData.page3.cardNumber}\n` +
                          `PIN: ${signupData.page3.pin}\n` +
                          `Account Type: ${signupData.page3.accountType}\n` +
                          `Face ID: Registered ✓\n\n` +
                          `Please save these details for login!`);
                    
                    // Reset signup data
                    signupData = { formNumber: '', page1: {}, page2: {}, page3: {} };
                    signupFaceData = null;
                    
                    // Clear forms
                    document.getElementById('signupForm1').reset();
                    document.getElementById('signupForm2').reset();
                    document.getElementById('signupForm3').reset();
                    
                    // Go back to login
                    showPage('loginPage');
                    showMessage('Account created! You can now login with your credentials.');
                }, 1500);
            } else {
                showStatus(document.getElementById('signup3Status'), result.message || 'Error creating account', 'error');
            }
        });
    }
});

// Cancel Signup
function cancelSignup() {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
        signupData = { formNumber: '', page1: {}, page2: {}, page3: {} };
        
        document.getElementById('signupForm1')?.reset();
        document.getElementById('signupForm2')?.reset();
        document.getElementById('signupForm3')?.reset();
        
        showPage('loginPage');
    }
}

function backToSignup1() {
    showPage('signupPage1');
}

function backToSignup2() {
    showPage('signupPage2');
}

// ==================== TRANSACTIONS ====================

// Logout
function logout() {
    if (confirm('Are you sure you want to exit?')) {
        currentUser = null;
        showPage('loginPage');
        showMessage('Logged out successfully!');
    }
}

// Back to Transactions
function backToTransactions() {
    showPage('transactionsPage');
}

// ==================== DEPOSIT ====================

function showDeposit() {
    showPage('depositPage');
    document.getElementById('depositAmount').value = '';
    const statusDiv = document.getElementById('depositStatus');
    if (statusDiv) statusDiv.style.display = 'none';
}

async function processDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const statusDiv = document.getElementById('depositStatus');

    if (!amount || amount <= 0) {
        showStatus(statusDiv, 'Please enter a valid amount', 'error');
        return;
    }

    showStatus(statusDiv, 'Processing deposit...', 'success');

    const result = await apiRequest('/deposit', 'POST', {
        pin: currentUser.pin,
        amount: amount
    });

    if (result.success) {
        currentUser.balance = result.balance;
        showStatus(statusDiv, `Successfully deposited Rs. ${amount}`, 'success');

        setTimeout(() => {
            showPage('transactionsPage');
        }, 2000);
    } else {
        showStatus(statusDiv, result.message || 'Error processing deposit', 'error');
    }
}

// ==================== WITHDRAW ====================

function showWithdraw() {
    showPage('withdrawPage');
    document.getElementById('withdrawAmount').value = '';
    const statusDiv = document.getElementById('withdrawStatus');
    if (statusDiv) statusDiv.style.display = 'none';
}

async function processWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const statusDiv = document.getElementById('withdrawStatus');

    if (!amount || amount <= 0) {
        showStatus(statusDiv, 'Please enter a valid amount', 'error');
        return;
    }

    showStatus(statusDiv, 'Processing withdrawal...', 'success');

    const result = await apiRequest('/withdraw', 'POST', {
        pin: currentUser.pin,
        amount: amount
    });

    if (result.success) {
        currentUser.balance = result.balance;
        showStatus(statusDiv, `Successfully withdrawn Rs. ${amount}`, 'success');

        setTimeout(() => {
            showPage('transactionsPage');
        }, 2000);
    } else {
        showStatus(statusDiv, result.message || 'Error processing withdrawal', 'error');
    }
}

// ==================== FAST CASH ====================

async function showFastCash() {
    const amounts = [100, 500, 1000, 2000, 5000, 10000];
    const choice = prompt(`Select Fast Cash Amount:\n${amounts.map((amt, i) => `${i+1}. Rs. ${amt}`).join('\n')}\n\nEnter your choice (1-6):`);
    
    if (choice >= 1 && choice <= 6) {
        const amount = amounts[choice - 1];
        
        const result = await apiRequest('/withdraw', 'POST', {
            pin: currentUser.pin,
            amount: amount
        });

        if (result.success) {
            currentUser.balance = result.balance;
            alert(`Successfully withdrawn Rs. ${amount}\nRemaining Balance: Rs. ${currentUser.balance.toFixed(2)}`);
        } else {
            alert(result.message || 'Error processing withdrawal');
        }
    }
}

// ==================== BALANCE ====================

async function showBalance() {
    // Fetch latest balance
    const result = await apiRequest(`/balance/${currentUser.pin}`);
    
    if (result.success) {
        currentUser.balance = result.balance;
        document.getElementById('balanceAmount').textContent = currentUser.balance.toFixed(2);
        showPage('balancePage');
        
        // Animate balance
        animateValue('balanceAmount', 0, currentUser.balance, 1000);
    } else {
        alert('Error fetching balance');
    }
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (obj) obj.textContent = current.toFixed(2);
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// ==================== MINI STATEMENT ====================

async function showStatement() {
    const result = await apiRequest(`/statement/${currentUser.pin}`);
    
    if (result.success) {
        let statement = 'MINI STATEMENT\n\n';
        statement += `Card: ${currentUser.cardNumber}\n`;
        statement += `Current Balance: Rs. ${currentUser.balance.toFixed(2)}\n\n`;
        statement += 'Recent Transactions:\n';
        statement += '='.repeat(50) + '\n';
        
        if (result.transactions.length === 0) {
            statement += 'No transactions found\n';
        } else {
            result.transactions.forEach(t => {
                statement += `${t.date}\n`;
                statement += `${t.type}: Rs. ${t.amount}\n`;
                statement += '-'.repeat(50) + '\n';
            });
        }
        
        alert(statement);
    } else {
        alert('Error fetching statement');
    }
}

// ==================== PIN CHANGE ====================

async function showPinChange() {
    const oldPin = prompt('Enter your current PIN:');
    
    if (oldPin !== currentUser.pin) {
        alert('Incorrect PIN');
        return;
    }
    
    const newPin = prompt('Enter your new PIN (4 digits):');
    
    if (!newPin || newPin.length !== 4 || !/^\d+$/.test(newPin)) {
        alert('Invalid PIN. Must be 4 digits');
        return;
    }
    
    const confirmPin = prompt('Confirm your new PIN:');
    
    if (newPin !== confirmPin) {
        alert('PINs do not match');
        return;
    }
    
    const result = await apiRequest('/changepin', 'POST', {
        cardNumber: currentUser.cardNumber,
        oldPin: oldPin,
        newPin: newPin
    });
    
    if (result.success) {
        currentUser.pin = newPin;
        alert('PIN changed successfully!');
    } else {
        alert(result.message || 'Error changing PIN');
    }
}

// ==================== HELPER FUNCTIONS ====================

function showStatus(element, message, type) {
    if (element) {
        element.textContent = message;
        element.className = `status-message ${type}`;
        element.style.display = 'block';
    }
}

function showMessage(message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28A745, #20873A);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideInRight 0.3s ease-in;
    `;
    overlay.textContent = message;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enter key support for login
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cardNumber')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('pin')?.focus();
    });
    
    document.getElementById('pin')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
});

console.log('🏦 NexusBank ATM System Loaded (Connected to Database)');
console.log('Server URL:', API_URL);

// ==================== FACE++ CLIENT WIRING ====================
// Elements
const videoEl = document.getElementById('video');
const canvasEl = document.getElementById('captureCanvas');
const previewImg = document.getElementById('previewImg');
const faceResultEl = document.getElementById('faceResult');
const startCameraBtn = document.getElementById('startCameraBtn');
const stopCameraBtn = document.getElementById('stopCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const fileInput = document.getElementById('fileInput');

let cameraStream = null;

function showFaceWidget() {
    showPage(''); // hide others safely
    document.getElementById('faceWidget').classList.remove('hidden');
}

function hideFaceWidget() {
    stopCamera();
    document.getElementById('faceWidget').classList.add('hidden');
}

async function startCamera() {
    faceResultEl.textContent = 'Requesting camera permission...';
    try {
        // Pre-check permissions if supported
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const status = await navigator.permissions.query({ name: 'camera' });
                if (status.state === 'denied') {
                    faceResultEl.textContent = 'Camera permission blocked. Please allow camera access in your browser settings.';
                    return;
                }
            } catch (permErr) {
                // Some browsers don't support querying camera permission; ignore and continue
            }
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        videoEl.srcObject = cameraStream;
        startCameraBtn.disabled = true;
        stopCameraBtn.disabled = false;
        captureBtn.disabled = false;
        faceResultEl.textContent = 'Camera ready. Click Capture to take a snapshot.';
    } catch (err) {
        console.error('Camera start error', err);
        // Provide clearer messages based on error
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            faceResultEl.textContent = 'Camera permission denied. Please enable camera access for this site and try again.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            faceResultEl.textContent = 'No camera found. Please attach a camera or use the Upload button.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            faceResultEl.textContent = 'Camera is already in use by another application.';
        } else {
            faceResultEl.textContent = 'Unable to access camera. Try using Upload or Test Sample Image.';
        }

        startCameraBtn.disabled = false;
        stopCameraBtn.disabled = true;
        captureBtn.disabled = true;
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        cameraStream = null;
    }
    videoEl.srcObject = null;
    startCameraBtn.disabled = false;
    stopCameraBtn.disabled = true;
    captureBtn.disabled = true;
}

function captureSnapshot() {
    if (!videoEl || !canvasEl) return;
    const w = videoEl.videoWidth;
    const h = videoEl.videoHeight;
    canvasEl.width = w;
    canvasEl.height = h;
    const ctx = canvasEl.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, w, h);
    const dataUrl = canvasEl.toDataURL('image/jpeg', 0.9);
    previewImg.src = dataUrl;
    sendToFaceDetect({ image_base64: dataUrl.split(',')[1] });
}

function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        previewImg.src = dataUrl;
        sendToFaceDetect({ image_base64: dataUrl.split(',')[1] });
    };
    reader.readAsDataURL(file);
}

async function sendToFaceDetect(payload) {
    faceResultEl.textContent = 'Detecting...';
    try {
        const resp = await fetch(`${API_URL}/face/detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await resp.json();
        if (json.success) {
            faceResultEl.textContent = JSON.stringify(json.data, null, 2);
        } else {
            faceResultEl.textContent = `Error: ${json.message || JSON.stringify(json.error)}`;
        }
    } catch (err) {
        console.error('Face detect request failed', err);
        faceResultEl.textContent = `Request failed: ${err.message}`;
    }
}

// Wire buttons when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    startCameraBtn?.addEventListener('click', startCamera);
    stopCameraBtn?.addEventListener('click', stopCamera);
    captureBtn?.addEventListener('click', captureSnapshot);
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleFileUpload(file);
    });
    // Start polling server status
    pollServerStatus();
    setInterval(pollServerStatus, 10000); // every 10s
});

async function pollServerStatus() {
    try {
        const resp = await fetch(`${API_URL}/status`);
        const json = await resp.json();
        const banner = document.getElementById('devBanner');
        if (json && json.devMode) {
            banner?.classList.remove('hidden');
            banner.textContent = '⚠️ Server running in DEV MODE (in-memory storage)';
        } else {
            banner?.classList.add('hidden');
        }
    } catch (err) {
        // If status endpoint unreachable, show banner to indicate degraded state
        const banner = document.getElementById('devBanner');
        banner?.classList.remove('hidden');
        banner.textContent = '⚠️ Server status unknown (check backend)';
    }

}



// Send a reliable public sample face image to the detect endpoint for quick testing
async function sendSampleImage() {
    // Public sample image (Obama) hosted in a public GitHub repo - stable for testing
    const sampleUrl = 'https://raw.githubusercontent.com/ageitgey/face_recognition/master/examples/obama.jpg';
    previewImg.src = sampleUrl;
    faceResultEl.textContent = 'Detecting sample image...';

    try {
        const resp = await fetch(`${API_URL}/face/detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: sampleUrl })
        });
        const json = await resp.json();
        if (json.success) {
            faceResultEl.textContent = JSON.stringify(json.data, null, 2);
        } else {
            faceResultEl.textContent = `Error: ${json.message || JSON.stringify(json.error)}`;
        }
    } catch (err) {
        console.error('Sample detect request failed', err);
        faceResultEl.textContent = `Request failed: ${err.message}`;
    }
}
