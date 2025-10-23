const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const axios = require('axios');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection pool (attempt). If it fails we'll fall back to an in-memory dev mode.
let pool = null;
let devMode = false; // when true, use in-memory stores

async function initDatabaseOrFallback() {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'bankmanagementsystem',
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.warn('⚠️  Entering DEV fallback mode — server will use in-memory data stores.');
        devMode = true;
        initInMemoryStores();
    }
}

initDatabaseOrFallback();

// In-memory stores for dev mode
const inMemory = {
    signup: [],       // page1 records
    signup2: [],      // page2 records
    signup3: [],      // page3 records
    login: [],        // { formno, cardnumber, pin }
    bank: []          // { pin, date, type, amount }
};

function initInMemoryStores() {
    inMemory.signup = [];
    inMemory.signup2 = [];
    inMemory.signup3 = [];
    inMemory.login = [];
    inMemory.bank = [];
}

// ==================== API ROUTES ====================

// 1. LOGIN
app.post('/api/login', async (req, res) => {
    const { cardNumber, pin } = req.body;

    if (!cardNumber || !pin) {
        return res.status(400).json({ 
            success: false, 
            message: 'Card number and PIN are required' 
        });
    }

    try {
        if (devMode) {
            const row = inMemory.login.find(r => r.cardnumber === cardNumber && r.pin === pin);
            if (!row) return res.status(401).json({ success: false, message: 'Invalid card number or PIN' });
            const formno = row.formno;
            const userDetails = inMemory.signup.filter(s => s.formno === formno);
            const balance = inMemory.bank
                .filter(t => t.pin === pin)
                .reduce((acc, t) => acc + (t.type === 'Deposit' ? Number(t.amount) : -Number(t.amount)), 0);

            return res.json({
                success: true,
                message: 'Login successful',
                user: {
                    formNumber: formno,
                    cardNumber: cardNumber,
                    pin: pin,
                    balance: balance || 0,
                    name: userDetails[0]?.name || '',
                    email: userDetails[0]?.email || ''
                }
            });
        }

        const [rows] = await pool.query(
            'SELECT * FROM login WHERE cardnumber = ? AND pin = ?',
            [cardNumber, pin]
        );

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid card number or PIN' 
            });
        }

        // Get user details from signup table
        const formno = rows[0].formno;
        const [userDetails] = await pool.query(
            'SELECT * FROM signup WHERE formno = ?',
            [formno]
        );

        // Get balance from bank table
        const [bankData] = await pool.query(
            'SELECT SUM(CASE WHEN type = "Deposit" THEN CAST(amount AS DECIMAL(10,2)) ELSE -CAST(amount AS DECIMAL(10,2)) END) as balance FROM bank WHERE pin = ?',
            [pin]
        );

        const balance = bankData[0].balance || 0;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                formNumber: formno,
                cardNumber: cardNumber,
                pin: pin,
                balance: balance,
                name: userDetails[0]?.name || '',
                email: userDetails[0]?.email || ''
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// 2. SIGNUP - PAGE 1 (Insert into signup table)
app.post('/api/signup/page1', async (req, res) => {
    const { formNumber, name, fatherName, dob, gender, email, marital, address, city, pincode, state } = req.body;

    try {
        if (devMode) {
            inMemory.signup.push({ formno: formNumber, name, fname: fatherName, dob, gender, email, marital, address, city, pin: pincode, state });
            return res.json({ success: true, message: 'Page 1 data saved (dev)', formNumber });
        }

        await pool.query(
            'INSERT INTO signup (formno, name, fname, dob, gender, email, marital, address, city, pin, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [formNumber, name, fatherName, dob, gender, email, marital, address, city, pincode, state]
        );

        res.json({
            success: true,
            message: 'Page 1 data saved successfully',
            formNumber: formNumber
        });

    } catch (error) {
        console.error('Signup Page 1 error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving page 1 data' 
        });
    }
});

// 3. SIGNUP - PAGE 2 (Insert into signup2 table)
app.post('/api/signup/page2', async (req, res) => {
    const { formNumber, religion, category, income, education, occupation, pan, aadhar, seniorCitizen, existingAccount } = req.body;

    try {
        if (devMode) {
            inMemory.signup2.push({ formno: formNumber, religion, category, income, education, occupation, pan, aadhar, seniorcitizen: seniorCitizen, existingaccount: existingAccount });
            return res.json({ success: true, message: 'Page 2 data saved (dev)' });
        }

        await pool.query(
            'INSERT INTO signup2 (formno, religion, category, income, education, occupation, pan, aadhar, seniorcitizen, existingaccount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [formNumber, religion, category, income, education, occupation, pan, aadhar, seniorCitizen, existingAccount]
        );

        res.json({
            success: true,
            message: 'Page 2 data saved successfully'
        });

    } catch (error) {
        console.error('Signup Page 2 error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving page 2 data' 
        });
    }
});

// 4. SIGNUP - PAGE 3 (Insert into signup3 and login tables)
app.post('/api/signup/page3', async (req, res) => {
    const { formNumber, accountType, cardNumber, pin, services } = req.body;
    try {
        if (devMode) {
            inMemory.signup3.push({ formno: formNumber, accountType, cardnumber: cardNumber, pin, facility: services.join(', ') });
            inMemory.login.push({ formno: formNumber, cardnumber: cardNumber, pin });
            return res.json({ success: true, message: 'Account created (dev)', credentials: { formNumber, cardNumber, pin } });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert into signup3 table
            await connection.query(
                'INSERT INTO signup3 (formno, accountType, cardnumber, pin, facility) VALUES (?, ?, ?, ?, ?)',
                [formNumber, accountType, cardNumber, pin, services.join(', ')]
            );

            // Insert into login table
            await connection.query(
                'INSERT INTO login (formno, cardnumber, pin) VALUES (?, ?, ?)',
                [formNumber, cardNumber, pin]
            );

            await connection.commit();

            res.json({
                success: true,
                message: 'Account created successfully!',
                credentials: {
                    formNumber: formNumber,
                    cardNumber: cardNumber,
                    pin: pin
                }
            });
        } catch (error) {
            await connection.rollback();
            console.error('Signup Page 3 error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error creating account' 
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Signup Page 3 outer error:', error);
        res.status(500).json({ success: false, message: 'Error creating account' });
    }
});

// 5. GET BALANCE
app.get('/api/balance/:pin', async (req, res) => {
    const { pin } = req.params;

    try {
        if (devMode) {
            const balance = inMemory.bank.filter(t => t.pin === pin).reduce((acc, t) => acc + (t.type === 'Deposit' ? Number(t.amount) : -Number(t.amount)), 0);
            return res.json({ success: true, balance: balance || 0 });
        }

        const [rows] = await pool.query(
            'SELECT SUM(CASE WHEN type = "Deposit" THEN CAST(amount AS DECIMAL(10,2)) ELSE -CAST(amount AS DECIMAL(10,2)) END) as balance FROM bank WHERE pin = ?',
            [pin]
        );

        const balance = rows[0].balance || 0;

        res.json({ success: true, balance: balance });

    } catch (error) {
        console.error('Balance error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching balance' 
        });
    }
});

// 6. DEPOSIT
app.post('/api/deposit', async (req, res) => {
    const { pin, amount } = req.body;

    if (!pin || !amount || amount <= 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid deposit amount' 
        });
    }

    try {
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (devMode) {
            inMemory.bank.push({ pin, date, type: 'Deposit', amount });
            const balance = inMemory.bank.filter(t => t.pin === pin).reduce((acc, t) => acc + (t.type === 'Deposit' ? Number(t.amount) : -Number(t.amount)), 0);
            return res.json({ success: true, message: `Successfully deposited Rs. ${amount}`, balance });
        }

        await pool.query(
            'INSERT INTO bank (pin, date, type, amount) VALUES (?, ?, ?, ?)',
            [pin, date, 'Deposit', amount]
        );

        // Get updated balance
        const [rows] = await pool.query(
            'SELECT SUM(CASE WHEN type = "Deposit" THEN CAST(amount AS DECIMAL(10,2)) ELSE -CAST(amount AS DECIMAL(10,2)) END) as balance FROM bank WHERE pin = ?',
            [pin]
        );

        res.json({
            success: true,
            message: `Successfully deposited Rs. ${amount}`,
            balance: rows[0].balance || 0
        });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing deposit' 
        });
    }
});

// 7. WITHDRAW
app.post('/api/withdraw', async (req, res) => {
    const { pin, amount } = req.body;

    if (!pin || !amount || amount <= 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid withdrawal amount' 
        });
    }

    try {
        // Check balance first
        if (devMode) {
            const currentBalance = inMemory.bank.filter(t => t.pin === pin).reduce((acc, t) => acc + (t.type === 'Deposit' ? Number(t.amount) : -Number(t.amount)), 0);
            if (amount > currentBalance) return res.status(400).json({ success: false, message: 'Insufficient balance' });
            const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            inMemory.bank.push({ pin, date, type: 'Withdrawl', amount });
            const balance = inMemory.bank.filter(t => t.pin === pin).reduce((acc, t) => acc + (t.type === 'Deposit' ? Number(t.amount) : -Number(t.amount)), 0);
            return res.json({ success: true, message: `Successfully withdrawn Rs. ${amount}`, balance });
        }

        const [balanceRows] = await pool.query(
            'SELECT SUM(CASE WHEN type = "Deposit" THEN CAST(amount AS DECIMAL(10,2)) ELSE -CAST(amount AS DECIMAL(10,2)) END) as balance FROM bank WHERE pin = ?',
            [pin]
        );

        const currentBalance = balanceRows[0].balance || 0;

        if (amount > currentBalance) {
            return res.status(400).json({ 
                success: false, 
                message: 'Insufficient balance' 
            });
        }

        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        await pool.query(
            'INSERT INTO bank (pin, date, type, amount) VALUES (?, ?, ?, ?)',
            [pin, date, 'Withdrawl', amount]
        );

        // Get updated balance
        const [rows] = await pool.query(
            'SELECT SUM(CASE WHEN type = "Deposit" THEN CAST(amount AS DECIMAL(10,2)) ELSE -CAST(amount AS DECIMAL(10,2)) END) as balance FROM bank WHERE pin = ?',
            [pin]
        );

        res.json({
            success: true,
            message: `Successfully withdrawn Rs. ${amount}`,
            balance: rows[0].balance || 0
        });
    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing withdrawal' 
        });
    }
});

// 8. GET MINI STATEMENT
app.get('/api/statement/:pin', async (req, res) => {
    const { pin } = req.params;

    try {
        if (devMode) {
            const rows = inMemory.bank.filter(t => t.pin === pin).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
            return res.json({ success: true, transactions: rows });
        }

        const [rows] = await pool.query(
            'SELECT * FROM bank WHERE pin = ? ORDER BY date DESC LIMIT 10',
            [pin]
        );

        res.json({ success: true, transactions: rows });

    } catch (error) {
        console.error('Statement error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching statement' 
        });
    }
});

// 9. CHANGE PIN
app.post('/api/changepin', async (req, res) => {
    const { cardNumber, oldPin, newPin } = req.body;

    if (!cardNumber || !oldPin || !newPin) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
        return res.status(400).json({ 
            success: false, 
            message: 'PIN must be 4 digits' 
        });
    }

    const connection = await pool.getConnection();

    try {
        if (devMode) {
            const loginRow = inMemory.login.find(r => r.cardnumber === cardNumber && r.pin === oldPin);
            if (!loginRow) return res.status(401).json({ success: false, message: 'Incorrect current PIN' });
            // Update login
            loginRow.pin = newPin;
            // Update signup3
            inMemory.signup3.filter(s => s.cardnumber === cardNumber).forEach(s => s.pin = newPin);
            // Update bank
            inMemory.bank.filter(b => b.pin === oldPin).forEach(b => b.pin = newPin);
            return res.json({ success: true, message: 'PIN changed successfully (dev)' });
        }

        // Verify old PIN
        const [loginRows] = await connection.query(
            'SELECT * FROM login WHERE cardnumber = ? AND pin = ?',
            [cardNumber, oldPin]
        );

        if (loginRows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Incorrect current PIN' 
            });
        }

        await connection.beginTransaction();

        // Update PIN in login table
        await connection.query(
            'UPDATE login SET pin = ? WHERE cardnumber = ?',
            [newPin, cardNumber]
        );

        // Update PIN in signup3 table
        await connection.query(
            'UPDATE signup3 SET pin = ? WHERE cardnumber = ?',
            [newPin, cardNumber]
        );

        // Update PIN in bank table
        await connection.query(
            'UPDATE bank SET pin = ? WHERE pin = ?',
            [newPin, oldPin]
        );

        await connection.commit();

        res.json({ success: true, message: 'PIN changed successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('Change PIN error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error changing PIN' 
        });
    } finally {
        connection.release();
    }
});

// 10. GENERATE UNIQUE FORM NUMBER
app.get('/api/generate-form-number', async (req, res) => {
    try {
        let formNumber;
        let exists = true;

        // Generate unique form number
        while (exists) {
            formNumber = Math.floor(1000 + Math.random() * 9000).toString();
            if (devMode) {
                exists = inMemory.signup.some(s => s.formno === formNumber);
            } else {
                try {
                    const [rows] = await pool.query('SELECT formno FROM signup WHERE formno = ?', [formNumber]);
                    exists = rows.length > 0;
                } catch (qerr) {
                    // If DB check fails here, fallback to devMode so the frontend can continue working
                    console.error('DB check failed during form number generation:', qerr.message || qerr);
                    console.warn('Falling back to DEV mode for form number generation.');
                    devMode = true;
                    initInMemoryStores();
                    exists = inMemory.signup.some(s => s.formno === formNumber);
                }
            }
        }

        res.json({
            success: true,
            formNumber: formNumber
        });

    } catch (error) {
        console.error('Generate form number error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating form number' 
        });
    }
});

// 11. GENERATE UNIQUE CARD NUMBER
app.get('/api/generate-card-number', async (req, res) => {
    try {
        let cardNumber;
        let exists = true;

        // Generate unique 16-digit card number
        while (exists) {
            cardNumber = '';
            for (let i = 0; i < 16; i++) {
                cardNumber += Math.floor(Math.random() * 10);
            }
            if (devMode) {
                exists = inMemory.login.some(l => l.cardnumber === cardNumber);
            } else {
                const [rows] = await pool.query('SELECT cardnumber FROM login WHERE cardnumber = ?', [cardNumber]);
                exists = rows.length > 0;
            }
        }

        res.json({
            success: true,
            cardNumber: cardNumber
        });

    } catch (error) {
        console.error('Generate card number error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error generating card number' 
        });
    }
});

// 12. SERVER STATUS
app.get('/api/status', async (req, res) => {
    try {
        const dbStatus = devMode ? 'dev' : 'connected';
        return res.json({ success: true, devMode: devMode, dbStatus: dbStatus });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Unable to read status' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'NexusBank ATM Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Face++ detect proxy endpoint
app.post('/api/face/detect', async (req, res) => {
    const { image_url, image_base64 } = req.body;

    if (!process.env.FACEPP_API_KEY || !process.env.FACEPP_API_SECRET) {
        return res.status(500).json({ success: false, message: 'Face++ API keys not configured on server.' });
    }

    if (!image_url && !image_base64) {
        return res.status(400).json({ success: false, message: 'Provide image_url or image_base64 in request body.' });
    }

    try {
        const form = new URLSearchParams();
        form.append('api_key', process.env.FACEPP_API_KEY);
        form.append('api_secret', process.env.FACEPP_API_SECRET);
        if (image_url) form.append('image_url', image_url);
        if (image_base64) form.append('image_base64', image_base64);

        // call Face++ detect API
        const resp = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', form.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 15000
        });

        return res.json({ success: true, data: resp.data });
    } catch (err) {
        console.error('Face detect error:', err?.response?.data || err.message || err);
        return res.status(500).json({ success: false, message: 'Face detection failed', error: err?.response?.data || err.message });
    }
});

    

// Serve static files (optional - for production)
app.use(express.static('../'));

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🏦 NEXUSBANK ATM SERVER STARTED 🏦      ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                              ║
║  Database: ${process.env.DB_NAME}          ║
║  Environment: ${process.env.NODE_ENV}      ║
║  Time: ${new Date().toLocaleString()}      ║
╚════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await pool.end();
    console.log('✅ Database connections closed');
    process.exit(0);
});
