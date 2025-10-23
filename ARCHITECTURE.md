# ATM Banking System - Architecture Documentation

## Project Overview
**ATM Banking System** is a comprehensive Java-based application that simulates real-world ATM banking operations including account creation, deposits, withdrawals, balance enquiry, and transaction history management.

---

## 1. System Architecture

### 1.1 Architecture Type
**Three-Tier Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  (Java Swing GUI - Login, Signup, Transactions, etc.)      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                    │
│  (Transaction Processing, Validation, Business Rules)      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                      │
│  (Conn.java - JDBC Connection, SQL Queries)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                       │
│  (MySQL - bankmanagementsystem database)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Application Components

```
ATM Banking System
│
├── Authentication Module
│   ├── Login.java - User login interface
│   └── Pin.java - PIN change functionality
│
├── Account Management Module
│   ├── Signup.java - Personal details (Page 1)
│   ├── Signup2.java - Additional details (Page 2)
│   └── Signup3.java - Account type & services (Page 3)
│
├── Transaction Module
│   ├── Deposit.java - Deposit money
│   ├── Withdrawl.java - Withdraw money
│   ├── FastCash.java - Quick withdrawal
│   └── Transactions.java - Transaction menu/dashboard
│
├── Reporting Module
│   ├── BalanceEnquiry.java - Check account balance
│   └── MiniStatement.java - View transaction history
│
├── Data Access Layer
│   └── Conn.java - Database connectivity
│
└── Utilities
    ├── ClearDatabase.java - Database cleanup utility
    └── DbDump.java - Database inspection tool
```

---

## 3. Database Architecture

### 3.1 Database Schema

**Database Name:** `bankmanagementsystem`

```
┌──────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                         │
└──────────────────────────────────────────────────────────────┘

Table: signup (Personal Information - Page 1)
┌──────────────┬──────────────┬─────────────────────────────┐
│ Column       │ Type         │ Description                 │
├──────────────┼──────────────┼─────────────────────────────┤
│ formno       │ varchar(20)  │ Unique form number          │
│ name         │ varchar(20)  │ Customer name               │
│ fname        │ varchar(20)  │ Father's name               │
│ dob          │ varchar(20)  │ Date of birth               │
│ gender       │ varchar(20)  │ Gender                      │
│ email        │ varchar(30)  │ Email address               │
│ marital      │ varchar(20)  │ Marital status              │
│ address      │ varchar(40)  │ Residential address         │
│ city         │ varchar(25)  │ City                        │
│ pincode      │ varchar(20)  │ PIN code                    │
│ state        │ varchar(25)  │ State                       │
└──────────────┴──────────────┴─────────────────────────────┘

Table: signup2 (Additional Details - Page 2)
┌──────────────┬──────────────┬─────────────────────────────┐
│ Column       │ Type         │ Description                 │
├──────────────┼──────────────┼─────────────────────────────┤
│ formno       │ varchar(20)  │ Form number (FK)            │
│ religion     │ varchar(20)  │ Religion                    │
│ category     │ varchar(20)  │ Category                    │
│ income       │ varchar(20)  │ Income range                │
│ education    │ varchar(20)  │ Educational qualification   │
│ occupation   │ varchar(20)  │ Occupation                  │
│ pan          │ varchar(20)  │ PAN number                  │
│ aadhar       │ varchar(20)  │ Aadhar number               │
│ sencitizen   │ varchar(20)  │ Senior citizen status       │
│ exacc        │ varchar(20)  │ Existing account            │
└──────────────┴──────────────┴─────────────────────────────┘

Table: signup3 (Account Details - Page 3)
┌──────────────┬──────────────┬─────────────────────────────┐
│ Column       │ Type         │ Description                 │
├──────────────┼──────────────┼─────────────────────────────┤
│ formno       │ varchar(20)  │ Form number (FK)            │
│ accountType  │ varchar(40)  │ Account type                │
│ cardnumber   │ varchar(16)  │ 16-digit card number        │
│ pin          │ varchar(4)   │ 4-digit PIN                 │
│ facility     │ varchar(200) │ Services selected           │
└──────────────┴──────────────┴─────────────────────────────┘

Table: login (Authentication Credentials)
┌──────────────┬──────────────┬─────────────────────────────┐
│ Column       │ Type         │ Description                 │
├──────────────┼──────────────┼─────────────────────────────┤
│ formno       │ varchar(20)  │ Form number (FK)            │
│ cardnumber   │ varchar(16)  │ 16-digit card number        │
│ pin          │ varchar(4)   │ 4-digit PIN                 │
└──────────────┴──────────────┴─────────────────────────────┘

Table: bank (Transaction History)
┌──────────────┬──────────────┬─────────────────────────────┐
│ Column       │ Type         │ Description                 │
├──────────────┼──────────────┼─────────────────────────────┤
│ pin          │ varchar(10)  │ User PIN (FK)               │
│ date         │ varchar(50)  │ Transaction timestamp       │
│ type         │ varchar(20)  │ Deposit/Withdrawl           │
│ amount       │ varchar(20)  │ Transaction amount          │
└──────────────┴──────────────┴─────────────────────────────┘
```

### 3.2 Entity Relationships

```
signup ──┐
         ├──→ signup2 (via formno)
         │
         ├──→ signup3 (via formno)
         │
         └──→ login (via formno)

login ────→ bank (via pin)
```

---

## 4. Application Flow

### 4.1 User Registration Flow

```
┌─────────────┐
│   START     │
└──────┬──────┘
       ↓
┌─────────────────────────┐
│   Login.java            │
│   Click "SIGN UP"       │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Signup.java           │
│   Enter Personal Info   │
│   (Page 1)              │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Signup2.java          │
│   Enter Additional Info │
│   (Page 2)              │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Signup3.java          │
│   Select Account Type   │
│   & Services (Page 3)   │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Generate:             │
│   • Card Number (16-d)  │
│   • PIN (4-digit)       │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Insert data into:     │
│   • signup table        │
│   • signup2 table       │
│   • signup3 table       │
│   • login table         │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Display Card & PIN    │
│   to User               │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Deposit.java          │
│   Initial Deposit       │
└──────┬──────────────────┘
       ↓
┌─────────────┐
│     END     │
└─────────────┘
```

### 4.2 User Login & Transaction Flow

```
┌─────────────┐
│   START     │
└──────┬──────┘
       ↓
┌─────────────────────────┐
│   Login.java            │
│   Enter Card & PIN      │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Validate Credentials  │
│   SELECT * FROM login   │
└──────┬──────────────────┘
       ↓
┌─────────────────────────┐
│   Transactions.java     │
│   Main Menu:            │
│   1. Deposit            │
│   2. Cash Withdrawal    │
│   3. Fast Cash          │
│   4. Mini Statement     │
│   5. Pin Change         │
│   6. Balance Enquiry    │
│   7. Exit               │
└──────┬──────────────────┘
       ↓
    ┌──┴──────────────────────────────────────┐
    │                                          │
    ↓                                          ↓
┌─────────────┐                      ┌─────────────────┐
│  Deposit    │                      │  Withdrawal     │
│  • Input $  │                      │  • Input $      │
│  • INSERT   │                      │  • Check bal    │
│    bank     │                      │  • INSERT bank  │
└─────────────┘                      └─────────────────┘
    ↓                                          ↓
    └──────────────────┬───────────────────────┘
                       ↓
              ┌─────────────────┐
              │  Update Database│
              │  Return to Menu │
              └─────────────────┘
```

### 4.3 Balance Calculation Logic

```
For a given PIN:
┌─────────────────────────────────────────┐
│ SELECT * FROM bank WHERE pin = 'xxxx'   │
└─────────────────┬───────────────────────┘
                  ↓
         ┌────────────────────┐
         │ For each record:   │
         │ if type='Deposit'  │
         │   balance += amt   │
         │ else               │
         │   balance -= amt   │
         └────────┬───────────┘
                  ↓
         ┌────────────────────┐
         │ Display balance    │
         └────────────────────┘
```

---

## 5. Technology Stack

### 5.1 Core Technologies

| Layer                  | Technology              | Version      |
|------------------------|-------------------------|--------------|
| Programming Language   | Java                    | JDK 8+       |
| GUI Framework          | Java Swing              | Built-in     |
| Database               | MySQL                   | 9.4.0        |
| Database Driver        | MySQL Connector/J       | 8.0.33       |
| UI Component Library   | JCalendar               | 1.4          |
| Build Tool             | Apache Ant              | (optional)   |

### 5.2 Development Environment

- **IDE:** NetBeans / IntelliJ IDEA / VS Code
- **Version Control:** Git
- **Repository:** GitHub (kumaresan-07/ATM_JAVA)
- **Operating System:** Windows

---

## 6. Key Features

### 6.1 Security Features
1. **PIN-based Authentication:** 4-digit secure PIN
2. **Balance Validation:** Insufficient balance check before withdrawal
3. **Database Connection Security:** SSL disabled for local testing (should be enabled in production)

### 6.2 Transaction Features
1. **Deposit:** Add money to account
2. **Cash Withdrawal:** Withdraw with balance check
3. **Fast Cash:** Quick withdrawal (₹100, ₹500, ₹1000, ₹2000, ₹5000, ₹10000)
4. **Balance Enquiry:** Real-time balance calculation
5. **Mini Statement:** Transaction history display
6. **PIN Change:** Update security PIN

### 6.3 Account Management
1. **Multi-page Registration:** Three-step signup process
2. **Account Type Selection:** Saving/Current/Fixed/Recurring
3. **Service Selection:** ATM Card, Internet Banking, Mobile Banking, etc.
4. **Unique Card Generation:** Random 16-digit card number
5. **Unique PIN Generation:** Random 4-digit PIN

---

## 7. Design Patterns Used

### 7.1 Singleton Pattern
- **Conn.java** - Database connection (one connection per instance)

### 7.2 MVC Pattern (Partial)
- **Model:** Database tables (signup, login, bank)
- **View:** Swing GUI components
- **Controller:** ActionListener implementations in each class

### 7.3 Template Pattern
- All transaction classes follow similar structure (UI setup → event handling → database operation)

---

## 8. Data Flow Diagram

### 8.1 Deposit Transaction Flow

```
User → Deposit.java → Conn.java → MySQL Database
  ↓                      ↓              ↓
Enter Amount    Create connection   INSERT INTO bank
  ↓                      ↓              ↓
Click Deposit   Execute SQL         Store transaction
  ↓                      ↓              ↓
Success Message ← Confirmation ← Record saved
  ↓
Redirect to Transactions.java
```

### 8.2 Withdrawal Transaction Flow

```
User → Withdrawl.java → Conn.java → MySQL Database
  ↓                        ↓              ↓
Enter Amount      SELECT * FROM bank    Fetch transactions
  ↓                        ↓              ↓
Click Withdraw    Calculate balance    Return ResultSet
  ↓                        ↓
Check Balance    if (balance >= amount)
  ↓                        ↓
if sufficient:    INSERT INTO bank
  Withdraw               ↓
  ↓              Store withdrawal record
Success Message          ↓
  ↓              Redirect to Transactions
else:
  "Insufficient Balance"
```

---

## 9. File Structure

```
ATM_JAVA/
├── src/
│   └── ASimulatorSystem/
│       ├── BalanceEquiry.java
│       ├── ClearDatabase.java
│       ├── Conn.java
│       ├── DbDump.java
│       ├── Deposit.java
│       ├── FastCash.java
│       ├── Login.java
│       ├── MiniStatement.java
│       ├── Pin.java
│       ├── Signup.java
│       ├── Signup2.java
│       ├── Signup3.java
│       ├── Transactions.java
│       ├── Withdrawl.java
│       └── icons/
│           ├── a.png
│           ├── atm.jpg
│           └── logo.jpg
├── lib/
│   ├── jcalendar-1.4.jar
│   └── mysql-connector-j-8.0.33.jar
├── build/
│   └── classes/
├── nbproject/
├── build.xml
├── manifest.mf
└── README.md
```

---

## 10. Security Considerations

### 10.1 Current Implementation
- Local MySQL connection with basic authentication
- PIN stored as plain text (4 digits)
- No encryption for data transmission
- SQL injection vulnerable (concatenated queries)

### 10.2 Production Recommendations
1. **Hash PINs:** Use BCrypt/SHA-256
2. **Prepared Statements:** Prevent SQL injection
3. **SSL/TLS:** Encrypt database connections
4. **Session Management:** Implement timeout
5. **Audit Logging:** Track all transactions
6. **Input Validation:** Sanitize all user inputs

---

## 11. Future Enhancements

1. **Enhanced Security**
   - PIN encryption
   - Prepared statements
   - Session management

2. **Additional Features**
   - Fund transfer between accounts
   - Bill payments
   - Account statements (PDF export)
   - Transaction limits

3. **UI/UX Improvements**
   - Modern GUI (JavaFX)
   - Responsive design
   - Multi-language support

4. **Backend Improvements**
   - Connection pooling
   - Transaction rollback
   - Better error handling
   - Logging framework

---

## 12. System Requirements

### 12.1 Software Requirements
- **JDK:** 8 or higher
- **MySQL Server:** 5.7 or higher
- **Operating System:** Windows/Linux/macOS
- **RAM:** Minimum 2GB
- **Storage:** 100MB

### 12.2 Network Requirements
- Local MySQL server (localhost:3306)
- No internet required (standalone application)

---

## 13. Deployment Instructions

### 13.1 Database Setup
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS bankmanagementsystem;
USE bankmanagementsystem;

-- Tables are auto-created by the application
```

### 13.2 Application Setup
```powershell
# Compile all Java files
javac -d build/classes -cp "lib/*;src" src/ASimulatorSystem/*.java

# Run the application
java -cp "lib/*;build/classes" ASimulatorSystem.Login
```

---

## 14. Conclusion

This ATM Banking System demonstrates a complete end-to-end banking solution with:
- ✅ User authentication
- ✅ Account management
- ✅ Transaction processing
- ✅ Real-time balance tracking
- ✅ Transaction history
- ✅ Database persistence

The architecture follows industry-standard patterns and can be extended for production use with enhanced security and additional features.

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Author:** ATM_JAVA Development Team  
**Repository:** https://github.com/kumaresan-07/ATM_JAVA
