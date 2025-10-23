# 🚀 NexusBank ATM Server - Setup Guide

## 💖 Database Connected Backend Server for Web Application

This Node.js Express server connects your web application to the existing MySQL database (`bankmanagementsystem`).

---

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ **Node.js** installed (v14 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. ✅ **MySQL** running with `bankmanagementsystem` database
   - The same database your Java application uses

3. ✅ **NPM** (comes with Node.js)
   - Check: `npm --version`

---

## 🛠️ Installation Steps

### Step 1: Navigate to Server Directory
```powershell
cd d:\PROJECTS\ATM_JAVA\web\server
```

### Step 2: Install Dependencies
```powershell
npm install
```

This will install:
- **express** - Web framework
- **mysql2** - MySQL database driver
- **cors** - Enable cross-origin requests
- **body-parser** - Parse JSON requests
- **dotenv** - Environment variables
- **bcrypt** - Password hashing (future use)

### Step 3: Configure Database Settings

Edit `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=bankmanagementsystem
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Step 4: Start the Server

```powershell
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║   🏦 NEXUSBANK ATM SERVER STARTED 🏦      ║
╠════════════════════════════════════════════╣
║  Port: 3000                                ║
║  Database: bankmanagementsystem            ║
║  Environment: development                  ║
╚════════════════════════════════════════════╝

✅ Database connected successfully!
```

---

## 🎯 API Endpoints

### 1. **Login**
```
POST /api/login
Body: { "cardNumber": "string", "pin": "string" }
Response: { "success": true, "user": {...} }
```

### 2. **Generate Form Number**
```
GET /api/generate-form-number
Response: { "success": true, "formNumber": "1234" }
```

### 3. **Generate Card Number**
```
GET /api/generate-card-number
Response: { "success": true, "cardNumber": "1234567890123456" }
```

### 4. **Signup - Page 1**
```
POST /api/signup/page1
Body: { "formNumber": "string", "name": "string", ... }
Response: { "success": true, "message": "..." }
```

### 5. **Signup - Page 2**
```
POST /api/signup/page2
Body: { "formNumber": "string", "religion": "string", ... }
Response: { "success": true, "message": "..." }
```

### 6. **Signup - Page 3**
```
POST /api/signup/page3
Body: { "formNumber": "string", "accountType": "string", "cardNumber": "string", "pin": "string", "services": [] }
Response: { "success": true, "credentials": {...} }
```

### 7. **Get Balance**
```
GET /api/balance/:pin
Response: { "success": true, "balance": 5000.00 }
```

### 8. **Deposit**
```
POST /api/deposit
Body: { "pin": "string", "amount": number }
Response: { "success": true, "balance": 6000.00 }
```

### 9. **Withdraw**
```
POST /api/withdraw
Body: { "pin": "string", "amount": number }
Response: { "success": true, "balance": 4000.00 }
```

### 10. **Mini Statement**
```
GET /api/statement/:pin
Response: { "success": true, "transactions": [...] }
```

### 11. **Change PIN**
```
POST /api/changepin
Body: { "cardNumber": "string", "oldPin": "string", "newPin": "string" }
Response: { "success": true, "message": "..." }
```

### 12. **Health Check**
```
GET /api/health
Response: { "success": true, "message": "Server is running!" }
```

---

## 🗄️ Database Tables Used

The server interacts with these tables:

1. **`login`** - Stores card numbers and PINs
2. **`signup`** - Page 1 personal details
3. **`signup2`** - Page 2 additional details
4. **`signup3`** - Page 3 account details
5. **`bank`** - All transactions (deposits/withdrawals)

---

## 🚀 Running the Application

### Step 1: Start the Server
```powershell
cd d:\PROJECTS\ATM_JAVA\web\server
npm start
```

### Step 2: Open the Web Application
Open `d:\PROJECTS\ATM_JAVA\web\index.html` in your browser

**OR** use a local server:
```powershell
cd d:\PROJECTS\ATM_JAVA\web
python -m http.server 8080
```

Then visit: `http://localhost:8080`

---

## 🧪 Testing the Connection

### Test 1: Health Check
Open browser and visit:
```
http://localhost:3000/api/health
```

Should see: `{ "success": true, "message": "NexusBank ATM Server is running!" }`

### Test 2: Login with Existing User
If you have existing data in your database, try logging in with those credentials.

### Test 3: Create New Account
Click "CREATE NEW ACCOUNT" and complete the signup process.

---

## 🔧 Troubleshooting

### Problem: "Database connection failed"
**Solution:**
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure `bankmanagementsystem` database exists

### Problem: "Connection error" in browser console
**Solution:**
- Ensure server is running (`npm start`)
- Check server is on port 3000
- Verify API_URL in `app.js` is `http://localhost:3000/api`

### Problem: "CORS error"
**Solution:**
- Server already has CORS enabled
- If still issues, check browser console for specific error

### Problem: "Cannot find module"
**Solution:**
```powershell
cd d:\PROJECTS\ATM_JAVA\web\server
npm install
```

---

## 📊 Database Schema

### Expected Table Structures:

#### `login` table:
```sql
CREATE TABLE login (
    formno VARCHAR(20),
    cardnumber VARCHAR(25),
    pin VARCHAR(10)
);
```

#### `signup` table:
```sql
CREATE TABLE signup (
    formno VARCHAR(20),
    name VARCHAR(50),
    fname VARCHAR(50),
    dob VARCHAR(20),
    gender VARCHAR(10),
    email VARCHAR(60),
    marital VARCHAR(20),
    address VARCHAR(100),
    city VARCHAR(40),
    pin VARCHAR(10),
    state VARCHAR(40)
);
```

#### `signup2` table:
```sql
CREATE TABLE signup2 (
    formno VARCHAR(20),
    religion VARCHAR(20),
    category VARCHAR(20),
    income VARCHAR(30),
    education VARCHAR(40),
    occupation VARCHAR(30),
    pan VARCHAR(20),
    aadhar VARCHAR(20),
    seniorcitizen VARCHAR(10),
    existingaccount VARCHAR(10)
);
```

#### `signup3` table:
```sql
CREATE TABLE signup3 (
    formno VARCHAR(20),
    accountType VARCHAR(40),
    cardnumber VARCHAR(25),
    pin VARCHAR(10),
    facility VARCHAR(200)
);
```

#### `bank` table:
```sql
CREATE TABLE bank (
    pin VARCHAR(10),
    date VARCHAR(50),
    type VARCHAR(20),
    amount VARCHAR(20)
);
```

---

## 🎨 Features

✨ **Auto-generated Form Numbers** - Unique 4-digit form numbers
✨ **Auto-generated Card Numbers** - Unique 16-digit card numbers
✨ **Transaction Processing** - Real-time deposit/withdraw
✨ **Balance Calculation** - Dynamic balance from transactions
✨ **Mini Statement** - Last 10 transactions
✨ **PIN Change** - Secure PIN update across all tables
✨ **Error Handling** - Comprehensive error messages
✨ **Database Transactions** - Atomic operations for data integrity

---

## 🔒 Security Notes

⚠️ **Current Implementation:**
- PINs stored in plain text (for demo)
- No JWT authentication
- Basic CORS enabled

🔐 **Production Recommendations:**
1. Hash PINs using bcrypt
2. Implement JWT authentication
3. Use HTTPS
4. Add rate limiting
5. Implement input sanitization
6. Add SQL injection prevention (parameterized queries already used)
7. Environment-specific CORS settings

---

## 📝 Development Mode

For auto-restart on file changes:

```powershell
npm run dev
```

This uses `nodemon` to watch for file changes and restart automatically.

---

## 🛑 Stopping the Server

Press `Ctrl + C` in the terminal running the server.

---

## 📁 Project Structure

```
server/
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (database config)
├── server.js          # Main server file with all API routes
└── README.md          # This file
```

---

## 🎓 How It Works

1. **Frontend** (HTML/CSS/JS) sends HTTP requests to server
2. **Server** (Node.js/Express) receives requests
3. **Database** (MySQL) stores/retrieves data
4. **Server** sends response back to frontend
5. **Frontend** displays results to user

```
Browser → API Request → Express Server → MySQL Database
                                               ↓
Browser ← JSON Response ← Express Server ← Query Result
```

---

## 💡 Tips

1. **Keep server running** while using the web app
2. **Check console logs** for debugging
3. **Test with existing data** from Java app first
4. **Create new accounts** to test full flow
5. **Monitor database** to see changes in real-time

---

## 🆘 Need Help?

1. Check server console for errors
2. Check browser console (F12) for frontend errors
3. Verify database connection
4. Ensure all tables exist
5. Check `.env` configuration

---

## 🎉 Success!

If you see:
- ✅ Server running on port 3000
- ✅ Database connected
- ✅ Can login with existing credentials
- ✅ Can create new accounts
- ✅ Transactions work

**Congratulations! Your full-stack ATM application is running!** 💖

---

**Built with ❤️ for learning full-stack development**

Stack:
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js, Express
- Database: MySQL
- Architecture: REST API
