// Simulated database (in real app, this would be backend API)
let users = [];

// Load users from localStorage on page load
function loadUsers() {
    try {
        const savedUsers = localStorage.getItem('nexusBankUsers');
        if (savedUsers) {
            users = JSON.parse(savedUsers);
            console.log('Loaded', users.length, 'users from storage');
        } else {
            // Default demo user
            users = [{
                cardNumber: '1234567890123456',
                pin: '1234',
                balance: 5000,
                transactions: []
            }];
        }
    } catch (e) {
        console.warn('Could not load users from localStorage:', e);
        users = [{
            cardNumber: '1234567890123456',
            pin: '1234',
            balance: 5000,
            transactions: []
        }];
    }
}

// Initialize on page load
loadUsers();

let currentUser = null;

// Signup data storage
let signupData = {
    formNumber: '',
    page1: {},
    page2: {},
    page3: {}
};

// Page Navigation
function showPage(pageId) {
    const pages = ['loginPage', 'transactionsPage', 'depositPage', 'withdrawPage', 'balancePage', 
                   'signupPage1', 'signupPage2', 'signupPage3'];
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

// Login Function
function login() {
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const statusDiv = document.getElementById('loginStatus');

    // Validation
    if (!cardNumber || !pin) {
        showStatus(statusDiv, 'Please enter both card number and PIN', 'error');
        return;
    }

    // Find user
    const user = users.find(u => u.cardNumber === cardNumber && u.pin === pin);

    if (user) {
        currentUser = user;
        showStatus(statusDiv, 'Login Successful! Redirecting...', 'success');
        
        setTimeout(() => {
            showPage('transactionsPage');
            clearLogin();
        }, 1500);
    } else {
        showStatus(statusDiv, 'Invalid card number or PIN', 'error');
        
        // Shake animation on error
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.5s';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
}

// Clear Login Form
function clearLogin() {
    document.getElementById('cardNumber').value = '';
    document.getElementById('pin').value = '';
    document.getElementById('loginStatus').style.display = 'none';
}

// Show Signup (placeholder)
function showSignup() {
    // Generate random form number
    const formNum = Math.floor(1000 + Math.random() * 9000);
    signupData.formNumber = formNum.toString();
    
    // Display form number on all pages
    document.getElementById('formNumber').textContent = signupData.formNumber;
    document.getElementById('formNumber2').textContent = signupData.formNumber;
    document.getElementById('formNumber3').textContent = signupData.formNumber;
    
    // Generate card number and PIN
    generateCardAndPin();
    
    showPage('signupPage1');
}

// Generate Card Number and PIN
function generateCardAndPin() {
    // Generate 16-digit card number
    let cardNumber = '';
    for (let i = 0; i < 16; i++) {
        cardNumber += Math.floor(Math.random() * 10);
        if ((i + 1) % 4 === 0 && i < 15) cardNumber += '-';
    }
    
    // Generate 4-digit PIN
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store for later
    signupData.page3.cardNumber = cardNumber.replace(/-/g, '');
    signupData.page3.pin = pin;
    
    // Display on page 3
    document.getElementById('generatedCardNumber').textContent = cardNumber;
    document.getElementById('generatedPinNumber').textContent = pin;
}

// Signup Form 1 Handler
document.addEventListener('DOMContentLoaded', () => {
    const form1 = document.getElementById('signupForm1');
    if (form1) {
        form1.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get gender value
            const genderRadio = document.querySelector('input[name="gender"]:checked');
            const maritalRadio = document.querySelector('input[name="marital"]:checked');
            
            if (!genderRadio || !maritalRadio) {
                showStatus(document.getElementById('signup1Status'), 'Please select all required fields', 'error');
                return;
            }
            
            // Save page 1 data
            signupData.page1 = {
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
            
            showStatus(document.getElementById('signup1Status'), 'Details saved! Proceeding to next page...', 'success');
            setTimeout(() => {
                showPage('signupPage2');
                document.getElementById('signup1Status').style.display = 'none';
            }, 1000);
        });
    }
});

// Signup Form 2 Handler
document.addEventListener('DOMContentLoaded', () => {
    const form2 = document.getElementById('signupForm2');
    if (form2) {
        form2.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const seniorRadio = document.querySelector('input[name="seniorCitizen"]:checked');
            const existingRadio = document.querySelector('input[name="existingAccount"]:checked');
            
            if (!seniorRadio || !existingRadio) {
                showStatus(document.getElementById('signup2Status'), 'Please select all required fields', 'error');
                return;
            }
            
            // Save page 2 data
            signupData.page2 = {
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
            
            showStatus(document.getElementById('signup2Status'), 'Details saved! Proceeding to final page...', 'success');
            setTimeout(() => {
                showPage('signupPage3');
                document.getElementById('signup2Status').style.display = 'none';
            }, 1000);
        });
    }
});

// Signup Form 3 Handler
document.addEventListener('DOMContentLoaded', () => {
    const form3 = document.getElementById('signupForm3');
    if (form3) {
        form3.addEventListener('submit', (e) => {
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
            
            // Get selected services
            const servicesCheckboxes = document.querySelectorAll('input[name="services"]:checked');
            const services = Array.from(servicesCheckboxes).map(cb => cb.value);
            
            // Save page 3 data
            signupData.page3.accountType = accountTypeRadio.value;
            signupData.page3.services = services;
            
            // Create new user
            const newUser = {
                formNumber: signupData.formNumber,
                cardNumber: signupData.page3.cardNumber,
                pin: signupData.page3.pin,
                balance: 0,
                transactions: [],
                personalDetails: signupData.page1,
                additionalDetails: signupData.page2,
                accountDetails: signupData.page3
            };
            
            // Add to users array
            users.push(newUser);
            
            // Save to localStorage
            try {
                localStorage.setItem('nexusBankUsers', JSON.stringify(users));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }
            
            // Show success message
            showStatus(document.getElementById('signup3Status'), 'Account created successfully!', 'success');
            
            // Show confirmation alert with credentials
            setTimeout(() => {
                alert(`🎉 Account Created Successfully!\n\n` +
                      `Form Number: ${signupData.formNumber}\n` +
                      `Card Number: ${signupData.page3.cardNumber}\n` +
                      `PIN: ${signupData.page3.pin}\n` +
                      `Account Type: ${signupData.page3.accountType}\n\n` +
                      `Please save these details for login!`);
                
                // Reset signup data
                signupData = { formNumber: '', page1: {}, page2: {}, page3: {} };
                
                // Clear forms
                document.getElementById('signupForm1').reset();
                document.getElementById('signupForm2').reset();
                document.getElementById('signupForm3').reset();
                
                // Go back to login
                showPage('loginPage');
                showMessage('Account created! You can now login with your credentials.');
            }, 1500);
        });
    }
});

// Cancel Signup
function cancelSignup() {
    if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
        // Reset signup data
        signupData = { formNumber: '', page1: {}, page2: {}, page3: {} };
        
        // Clear forms
        document.getElementById('signupForm1').reset();
        document.getElementById('signupForm2').reset();
        document.getElementById('signupForm3').reset();
        
        // Go back to login
        showPage('loginPage');
    }
}

// Back to Signup Page 1
function backToSignup1() {
    showPage('signupPage1');
}

// Back to Signup Page 2
function backToSignup2() {
    showPage('signupPage2');
}

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

// Show Deposit Page
function showDeposit() {
    showPage('depositPage');
    document.getElementById('depositAmount').value = '';
    document.getElementById('depositStatus').style.display = 'none';
}

// Process Deposit
function processDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const statusDiv = document.getElementById('depositStatus');

    if (!amount || amount <= 0) {
        showStatus(statusDiv, 'Please enter a valid amount', 'error');
        return;
    }

    // Add to balance
    currentUser.balance += amount;
    
    // Record transaction
    currentUser.transactions.push({
        type: 'Deposit',
        amount: amount,
        date: new Date().toLocaleString(),
        balance: currentUser.balance
    });

    // Save to localStorage
    try {
        localStorage.setItem('nexusBankUsers', JSON.stringify(users));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }

    showStatus(statusDiv, `Successfully deposited Rs. ${amount}`, 'success');

    setTimeout(() => {
        showPage('transactionsPage');
    }, 2000);
}

// Show Withdraw Page
function showWithdraw() {
    showPage('withdrawPage');
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawStatus').style.display = 'none';
}

// Process Withdrawal
function processWithdraw() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const statusDiv = document.getElementById('withdrawStatus');

    if (!amount || amount <= 0) {
        showStatus(statusDiv, 'Please enter a valid amount', 'error');
        return;
    }

    if (amount > currentUser.balance) {
        showStatus(statusDiv, 'Insufficient balance', 'error');
        return;
    }

    // Deduct from balance
    currentUser.balance -= amount;
    
    // Record transaction
    currentUser.transactions.push({
        type: 'Withdrawal',
        amount: amount,
        date: new Date().toLocaleString(),
        balance: currentUser.balance
    });

    // Save to localStorage
    try {
        localStorage.setItem('nexusBankUsers', JSON.stringify(users));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }

    showStatus(statusDiv, `Successfully withdrawn Rs. ${amount}`, 'success');

    setTimeout(() => {
        showPage('transactionsPage');
    }, 2000);
}

// Show Fast Cash (Quick withdrawal amounts)
function showFastCash() {
    const amounts = [100, 500, 1000, 2000, 5000, 10000];
    const choice = prompt(`Select Fast Cash Amount:\n${amounts.map((amt, i) => `${i+1}. Rs. ${amt}`).join('\n')}\n\nEnter your choice (1-6):`);
    
    if (choice >= 1 && choice <= 6) {
        const amount = amounts[choice - 1];
        
        if (amount > currentUser.balance) {
            alert('Insufficient balance');
            return;
        }

        currentUser.balance -= amount;
        currentUser.transactions.push({
            type: 'Fast Cash',
            amount: amount,
            date: new Date().toLocaleString(),
            balance: currentUser.balance
        });

        // Save to localStorage
        try {
            localStorage.setItem('nexusBankUsers', JSON.stringify(users));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }

        alert(`Successfully withdrawn Rs. ${amount}\nRemaining Balance: Rs. ${currentUser.balance}`);
    }
}

// Show Balance
function showBalance() {
    document.getElementById('balanceAmount').textContent = currentUser.balance.toFixed(2);
    showPage('balancePage');
    
    // Animate balance
    animateValue('balanceAmount', 0, currentUser.balance, 1000);
}

// Animate number counting
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        obj.textContent = current.toFixed(2);
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Show Mini Statement
function showStatement() {
    let statement = 'MINI STATEMENT\n\n';
    statement += `Card: ${currentUser.cardNumber}\n`;
    statement += `Current Balance: Rs. ${currentUser.balance}\n\n`;
    statement += 'Recent Transactions:\n';
    statement += '=' .repeat(50) + '\n';
    
    const recentTransactions = currentUser.transactions.slice(-10).reverse();
    
    if (recentTransactions.length === 0) {
        statement += 'No transactions found\n';
    } else {
        recentTransactions.forEach(t => {
            statement += `${t.date}\n`;
            statement += `${t.type}: Rs. ${t.amount}\n`;
            statement += `Balance: Rs. ${t.balance}\n`;
            statement += '-'.repeat(50) + '\n';
        });
    }
    
    alert(statement);
}

// Show PIN Change
function showPinChange() {
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
    
    currentUser.pin = newPin;
    
    // Save to localStorage
    try {
        localStorage.setItem('nexusBankUsers', JSON.stringify(users));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
    
    alert('PIN changed successfully!');
}

// Show Status Message
function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status-message ${type}`;
    element.style.display = 'block';
}

// Show temporary message
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

// Add shake animation to CSS
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
        if (e.key === 'Enter') document.getElementById('pin').focus();
    });
    
    document.getElementById('pin')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
});

console.log('🏦 NexusBank ATM System Loaded');
console.log('Demo Credentials:');
console.log('Card Number: 1234567890123456');
console.log('PIN: 1234');
