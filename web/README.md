# 🏦 NexusBank ATM Web Application

A modern, responsive web-based ATM banking system with complete signup and transaction features.

## ✨ Features

### 🔐 Authentication
- **Login System**: Secure login with card number and PIN
- **Complete Signup Flow**: 3-page registration process
  - Page 1: Personal Details (Name, DOB, Address, etc.)
  - Page 2: Additional Details (Religion, Income, PAN, Aadhar, etc.)
  - Page 3: Account Details (Account Type, Services)

### 💰 Banking Operations
1. **Deposit** - Add money to your account
2. **Withdraw** - Withdraw money with balance validation
3. **Fast Cash** - Quick withdrawal (₹100, ₹500, ₹1000, ₹2000, ₹5000, ₹10000)
4. **Balance Enquiry** - Check your current balance with animation
5. **Mini Statement** - View last 10 transactions
6. **PIN Change** - Update your 4-digit PIN securely

## 🚀 How to Run

1. Simply open `index.html` in your web browser
2. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

## 🎯 Demo Credentials

**Existing Demo Account:**
- Card Number: `1234567890123456`
- PIN: `1234`
- Initial Balance: ₹5000

## 📝 Creating a New Account

1. Click **"CREATE NEW ACCOUNT"** on the login page
2. Fill out all three pages:
   - **Personal Details**: Basic information
   - **Additional Details**: Financial and ID information
   - **Account Details**: Choose account type and services
3. Your card number and PIN will be automatically generated
4. Save the credentials shown at the end
5. Use them to login!

## 💾 Data Persistence

- All user data is stored in **browser's localStorage**
- Data persists across page refreshes
- Each browser has its own separate data storage

## 🎨 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern dark UI with gradient accents
- **Smooth Animations**: 
  - Floating background circles
  - Card slide-up effects
  - Button ripple animations
  - Balance counter animation
- **Form Validation**: Complete validation for all inputs
- **Real-time Updates**: Instant balance updates after transactions

## 📋 Validation Rules

### Signup Validations:
- **Email**: Valid email format required
- **Pin Code**: 6 digits
- **PAN**: Format ABCDE1234F (5 letters, 4 digits, 1 letter)
- **Aadhar**: 12 digits
- **Date of Birth**: Date picker
- **All fields**: Required validation

### Transaction Validations:
- **Deposit**: Amount must be > 0
- **Withdraw**: Amount must be > 0 and ≤ balance
- **PIN Change**: 4-digit numeric PIN required

## 🗂️ File Structure

```
web/
├── index.html          # Main HTML file with all pages
├── css/
│   └── styles.css      # Complete styling with animations
├── js/
│   └── app.js          # All JavaScript functionality
└── README.md           # This file
```

## 🔧 Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: 
  - CSS Custom Properties (Variables)
  - CSS Grid & Flexbox
  - CSS Animations & Keyframes
  - Media Queries for responsiveness
- **JavaScript (ES6)**:
  - LocalStorage API
  - DOM Manipulation
  - Event Handling
  - Form Validation

## 🎯 Key Components

### JavaScript Functions:
- `showSignup()` - Initialize signup process
- `login()` - Authenticate user
- `processDeposit()` - Handle deposits
- `processWithdraw()` - Handle withdrawals
- `showFastCash()` - Quick cash withdrawal
- `showBalance()` - Display balance with animation
- `showStatement()` - Display transaction history
- `showPinChange()` - Change PIN securely

### CSS Features:
- Floating circle animations
- Card slide-up effects
- Button ripple animations
- Responsive grid layout
- Dark theme with gradients

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: < 480px

## 🔒 Security Notes

⚠️ **Important**: This is a demo application for learning purposes.

**Current Implementation:**
- Data stored in browser's localStorage (client-side)
- No server-side validation
- No encryption

**For Production Use:**
- Connect to a real backend API
- Implement server-side validation
- Use HTTPS encryption
- Implement proper authentication (JWT, OAuth)
- Store data in a secure database
- Add rate limiting
- Implement CAPTCHA for signup/login

## 🛠️ Future Enhancements

- [ ] Connect to Java backend (existing MySQL database)
- [ ] Add more transaction types
- [ ] Implement account statements (PDF download)
- [ ] Add profile management
- [ ] Multiple account support
- [ ] Transfer to other accounts
- [ ] Bill payments
- [ ] Email/SMS notifications
- [ ] Two-factor authentication

## 📞 Support

For issues or questions, please check:
1. Browser console for errors (F12)
2. Ensure localStorage is enabled
3. Try clearing browser cache

## 📄 License

This is a student project created for educational purposes.

---

**Built with ❤️ for learning web development**

🎓 This project demonstrates:
- Modern HTML5/CSS3/JavaScript
- Responsive design principles
- Client-side data persistence
- Form validation
- Animation techniques
- Progressive web app concepts
