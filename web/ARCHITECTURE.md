# 🏗️ NexusBank ATM - System Architecture

## 📊 Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER'S WEB BROWSER                              │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                     FRONTEND (Client-Side)                      │   │
│  │                                                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │  │ index.html   │  │ styles.css   │  │   app.js     │        │   │
│  │  │              │  │              │  │              │        │   │
│  │  │ • Login Page │  │ • Dark Theme │  │ • API Calls  │        │   │
│  │  │ • Signup     │  │ • Animations │  │ • Functions  │        │   │
│  │  │ • Deposit    │  │ • Responsive │  │ • Validation │        │   │
│  │  │ • Withdraw   │  │ • Gradients  │  │ • Logic      │        │   │
│  │  │ • Balance    │  │ • Grid       │  │              │        │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTP REST API
                                   │ (Port 3000)
                                   │ fetch() requests
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Server-Side)                         │
│                     Node.js + Express.js                                │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                      server.js (REST API)                       │   │
│  │                                                                  │   │
│  │  📍 API Endpoints:                                              │   │
│  │  ├── POST   /api/login              (Authentication)           │   │
│  │  ├── GET    /api/generate-form-number (Unique Form ID)         │   │
│  │  ├── GET    /api/generate-card-number (Unique Card)            │   │
│  │  ├── POST   /api/signup/page1        (Personal Details)        │   │
│  │  ├── POST   /api/signup/page2        (Additional Details)      │   │
│  │  ├── POST   /api/signup/page3        (Account Creation)        │   │
│  │  ├── GET    /api/balance/:pin        (Check Balance)           │   │
│  │  ├── POST   /api/deposit             (Add Money)               │   │
│  │  ├── POST   /api/withdraw            (Remove Money)            │   │
│  │  ├── GET    /api/statement/:pin      (Transaction History)     │   │
│  │  ├── POST   /api/changepin           (Update PIN)              │   │
│  │  └── GET    /api/health              (Server Status)           │   │
│  │                                                                  │   │
│  │  🔧 Middleware:                                                 │   │
│  │  ├── CORS (Cross-Origin)                                       │   │
│  │  ├── Body Parser (JSON)                                        │   │
│  │  └── Express (Routing)                                         │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ SQL Queries
                                   │ mysql2 driver
                                   │ (Port 3306)
                                   ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE (Data Storage)                        │
│                      bankmanagementsystem                               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                        Database Tables                          │   │
│  │                                                                  │   │
│  │  📁 login                                                       │   │
│  │     ├── formno          (Application Form Number)              │   │
│  │     ├── cardnumber      (16-digit Card Number)                 │   │
│  │     └── pin             (4-digit PIN)                          │   │
│  │                                                                  │   │
│  │  📁 signup                                                      │   │
│  │     ├── formno, name, fname, dob, gender                       │   │
│  │     ├── email, marital, address, city                          │   │
│  │     └── pin, state                                             │   │
│  │                                                                  │   │
│  │  📁 signup2                                                     │   │
│  │     ├── formno, religion, category, income                     │   │
│  │     ├── education, occupation, pan, aadhar                     │   │
│  │     └── seniorcitizen, existingaccount                         │   │
│  │                                                                  │   │
│  │  📁 signup3                                                     │   │
│  │     ├── formno, accountType, cardnumber                        │   │
│  │     ├── pin, facility (services)                               │   │
│  │     └──                                                         │   │
│  │                                                                  │   │
│  │  📁 bank (Transactions)                                         │   │
│  │     ├── pin             (User's PIN)                           │   │
│  │     ├── date            (Transaction Date/Time)                │   │
│  │     ├── type            (Deposit / Withdrawl)                  │   │
│  │     └── amount          (Transaction Amount)                   │   │
│  │                                                                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### 1️⃣ **LOGIN FLOW**

```
USER ACTION: Enter card number and PIN, click "Login"
     ↓
FRONTEND: JavaScript function login()
     ↓
     fetch('http://localhost:3000/api/login', {
         method: 'POST',
         body: { cardNumber: '...', pin: '...' }
     })
     ↓
BACKEND: Express receives POST /api/login
     ↓
     Query: SELECT * FROM login WHERE cardnumber=? AND pin=?
     ↓
DATABASE: Returns user data
     ↓
BACKEND: Calculate balance from bank table
     Query: SELECT SUM(...) FROM bank WHERE pin=?
     ↓
     Response: { success: true, user: {...}, balance: 5000 }
     ↓
FRONTEND: Receives response
     ↓
     currentUser = result.user
     showPage('transactionsPage')
     ↓
USER SEES: Transaction menu with balance
```

### 2️⃣ **SIGNUP FLOW**

```
USER ACTION: Click "CREATE NEW ACCOUNT"
     ↓
FRONTEND: async function showSignup()
     ↓
     GET /api/generate-form-number
     ↓
BACKEND: Generate unique 4-digit form number
     Query: SELECT formno FROM signup WHERE formno=?
     (repeat until unique)
     ↓
     Response: { formNumber: '1234' }
     ↓
FRONTEND: Display form with form number
     User fills Page 1 → Click "Next"
     ↓
     POST /api/signup/page1 with all data
     ↓
BACKEND: Insert into signup table
     Query: INSERT INTO signup (formno, name, fname, ...) VALUES (?, ?, ?)
     ↓
     Response: { success: true }
     ↓
FRONTEND: Show Page 2
     User fills Page 2 → Click "Next"
     ↓
     POST /api/signup/page2
     ↓
BACKEND: Insert into signup2 table
     ↓
FRONTEND: Show Page 3 with generated card & PIN
     User selects account type → Click "Submit"
     ↓
     POST /api/signup/page3
     ↓
BACKEND: Start transaction
     INSERT INTO signup3 (...)
     INSERT INTO login (formno, cardnumber, pin)
     Commit transaction
     ↓
     Response: { success: true, credentials: {...} }
     ↓
FRONTEND: Show success message with credentials
     Alert: "Account Created! Card: ... PIN: ..."
     ↓
USER SEES: Credentials to save and login page
```

### 3️⃣ **DEPOSIT FLOW**

```
USER ACTION: Click "Deposit", enter amount, click "Deposit"
     ↓
FRONTEND: async function processDeposit()
     ↓
     POST /api/deposit
     body: { pin: '1234', amount: 1000 }
     ↓
BACKEND: Express receives POST /api/deposit
     ↓
     INSERT INTO bank (pin, date, type, amount)
     VALUES (?, NOW(), 'Deposit', ?)
     ↓
     Calculate new balance:
     SELECT SUM(CASE WHEN type='Deposit' THEN amount ELSE -amount END)
     FROM bank WHERE pin=?
     ↓
DATABASE: Transaction recorded
     ↓
BACKEND: Response: { success: true, balance: 6000 }
     ↓
FRONTEND: Update currentUser.balance
     Show success message
     ↓
USER SEES: "Successfully deposited Rs. 1000"
     Redirect to transactions page
```

### 4️⃣ **BALANCE ENQUIRY FLOW**

```
USER ACTION: Click "Balance Enquiry"
     ↓
FRONTEND: async function showBalance()
     ↓
     GET /api/balance/1234
     ↓
BACKEND: Express receives GET /api/balance/:pin
     ↓
     Query: SELECT SUM(CASE WHEN type='Deposit' THEN CAST(amount AS DECIMAL)
                            ELSE -CAST(amount AS DECIMAL) END) as balance
            FROM bank WHERE pin=?
     ↓
DATABASE: Returns calculated balance
     ↓
BACKEND: Response: { success: true, balance: 6000 }
     ↓
FRONTEND: Display balance with animation
     animateValue(0, 6000, 1000ms)
     ↓
USER SEES: Animated counter from 0 to Rs. 6000.00
```

---

## 🔐 Security Layers

```
┌──────────────────────────────────────────────┐
│  FRONTEND VALIDATION                         │
│  • Required field checks                     │
│  • Format validation (email, PAN, etc.)      │
│  • Length validation                         │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  API REQUEST                                 │
│  • JSON format                               │
│  • HTTP headers                              │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  BACKEND VALIDATION                          │
│  • Input sanitization                        │
│  • Business logic checks                     │
│  • Balance validation                        │
└──────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────┐
│  DATABASE SECURITY                           │
│  • Parameterized queries (SQL injection safe)│
│  • Transaction atomicity                     │
│  • Data integrity constraints                │
└──────────────────────────────────────────────┘
```

---

## 📡 Request/Response Cycle

### Example: Withdrawal Request

```
┌────────────┐                    ┌────────────┐                    ┌────────────┐
│  Browser   │                    │   Server   │                    │  Database  │
└─────┬──────┘                    └─────┬──────┘                    └─────┬──────┘
      │                                 │                                  │
      │  POST /api/withdraw             │                                  │
      │  { pin: "1234", amount: 500 }   │                                  │
      │────────────────────────────────>│                                  │
      │                                 │                                  │
      │                                 │  SELECT balance WHERE pin=1234   │
      │                                 │─────────────────────────────────>│
      │                                 │                                  │
      │                                 │  balance = 6000                  │
      │                                 │<─────────────────────────────────│
      │                                 │                                  │
      │                                 │  Check: 500 <= 6000 ✓           │
      │                                 │                                  │
      │                                 │  INSERT INTO bank                │
      │                                 │  (pin, date, type, amount)       │
      │                                 │─────────────────────────────────>│
      │                                 │                                  │
      │                                 │  Success                         │
      │                                 │<─────────────────────────────────│
      │                                 │                                  │
      │                                 │  Calculate new balance           │
      │                                 │─────────────────────────────────>│
      │                                 │                                  │
      │                                 │  balance = 5500                  │
      │                                 │<─────────────────────────────────│
      │                                 │                                  │
      │  { success: true,               │                                  │
      │    message: "...",              │                                  │
      │    balance: 5500 }              │                                  │
      │<────────────────────────────────│                                  │
      │                                 │                                  │
      │  Update UI                      │                                  │
      │  Show success message           │                                  │
      │                                 │                                  │
```

---

## 🚀 Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  HTML5 • CSS3 • JavaScript ES6 • Fetch API • DOM Manipulation   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                          │
│      Node.js • Express.js • REST API • JSON • Async/Await       │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                              │
│        MySQL • mysql2 driver • SQL • Transactions • Indexes     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Dependencies

### Frontend (No Dependencies!)
- Pure JavaScript
- No frameworks needed
- Works in any modern browser

### Backend
```json
{
  "express": "^4.18.2",      // Web framework
  "mysql2": "^3.6.0",        // MySQL driver
  "cors": "^2.8.5",          // Cross-origin requests
  "body-parser": "^1.20.2",  // Parse JSON
  "dotenv": "^16.3.1"        // Environment variables
}
```

---

## 🎯 Comparison: Before vs After

### BEFORE (localStorage version)
```
Browser ─────> JavaScript ─────> localStorage
                                  (Client-side only)
```
❌ Data lost on browser clear
❌ Not shared across browsers
❌ Limited to 5-10MB
❌ No concurrent users

### AFTER (Database version)
```
Browser ─────> Node.js ─────> MySQL Database
                              (Server-side)
```
✅ Permanent data storage
✅ Accessible from anywhere
✅ Unlimited storage
✅ Multiple users supported
✅ Real banking system architecture

---

**This is the architecture used by real banks!** 🏦💰
