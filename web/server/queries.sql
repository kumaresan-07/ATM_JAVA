-- =====================================================
-- SQL QUERIES FOR BANKMANAGEMENTSYSTEM DATABASE
-- NexusBank ATM - Data Retrieval Queries
-- =====================================================

USE bankmanagementsystem;

-- =====================================================
-- 1. BASIC SELECT QUERIES
-- =====================================================

-- Get all signup records (Page 1 data)
SELECT * FROM signup;

-- Get all signup2 records (Page 2 data)
SELECT * FROM signup2;

-- Get all signup3 records (Page 3 data)
SELECT * FROM signup3;

-- Get all login credentials
SELECT * FROM login;

-- Get all bank transactions
SELECT * FROM bank;


-- =====================================================
-- 2. FILTERED QUERIES (WHERE CLAUSE)
-- =====================================================

-- Find user by form number
SELECT * FROM signup WHERE formno = '1001';

-- Find user by email
SELECT * FROM signup WHERE email = 'test@example.com';

-- Find users by gender
SELECT * FROM signup WHERE gender = 'Male';

-- Find users by city
SELECT * FROM signup WHERE city = 'Bangalore';

-- Find users by state
SELECT * FROM signup WHERE state = 'Karnataka';

-- Find senior citizens
SELECT * FROM signup2 WHERE seniorcitizen = 'Yes';

-- Find users with existing accounts
SELECT * FROM signup2 WHERE existingaccount = 'Yes';

-- Find users by religion
SELECT * FROM signup2 WHERE religion = 'Hindu';

-- Find users by income range
SELECT * FROM signup2 WHERE income = '< 1,00,000';

-- Find users by account type
SELECT * FROM signup3 WHERE accountType = 'Saving Account';

-- Find login by card number
SELECT * FROM login WHERE cardnumber = '1234567890123456';

-- Find users with face ID registered
SELECT * FROM login WHERE face_token IS NOT NULL;

-- Find users without face ID
SELECT * FROM login WHERE face_token IS NULL;

-- Find transactions by type
SELECT * FROM bank WHERE type = 'Deposit';
SELECT * FROM bank WHERE type = 'Withdrawl';

-- Find transactions by amount range
SELECT * FROM bank WHERE amount > 1000;
SELECT * FROM bank WHERE amount BETWEEN 500 AND 5000;

-- Find transactions by date
SELECT * FROM bank WHERE date >= '2025-01-01';
SELECT * FROM bank WHERE DATE(date) = CURDATE(); -- Today's transactions


-- =====================================================
-- 3. JOINED QUERIES (COMBINING MULTIPLE TABLES)
-- =====================================================

-- Get complete user profile (signup + signup2 + signup3)
SELECT 
    s1.formno,
    s1.name,
    s1.fname,
    s1.dob,
    s1.gender,
    s1.email,
    s1.marital,
    s1.address,
    s1.city,
    s1.pin,
    s1.state,
    s2.religion,
    s2.category,
    s2.income,
    s2.education,
    s2.occupation,
    s2.pan,
    s2.aadhar,
    s2.seniorcitizen,
    s2.existingaccount,
    s3.accountType,
    s3.cardnumber,
    s3.facility
FROM signup s1
LEFT JOIN signup2 s2 ON s1.formno = s2.formno
LEFT JOIN signup3 s3 ON s1.formno = s3.formno;

-- Get user with login credentials
SELECT 
    s1.formno,
    s1.name,
    s1.email,
    l.cardnumber,
    l.pin,
    CASE 
        WHEN l.face_token IS NOT NULL THEN 'Yes' 
        ELSE 'No' 
    END AS has_face_id
FROM signup s1
INNER JOIN login l ON s1.formno = l.formno;

-- Get account details with user name
SELECT 
    s1.name,
    s1.email,
    s3.accountType,
    s3.cardnumber,
    s3.facility
FROM signup s1
INNER JOIN signup3 s3 ON s1.formno = s3.formno;

-- Get transactions with user details (assuming pin links to login)
SELECT 
    s1.name,
    s1.email,
    b.date,
    b.type,
    b.amount
FROM bank b
INNER JOIN login l ON b.pin = l.pin
INNER JOIN signup s1 ON l.formno = s1.formno
ORDER BY b.date DESC;


-- =====================================================
-- 4. AGGREGATE QUERIES (COUNT, SUM, AVG, etc.)
-- =====================================================

-- Count total users
SELECT COUNT(*) AS total_users FROM signup;

-- Count users by gender
SELECT gender, COUNT(*) AS count FROM signup GROUP BY gender;

-- Count users by city
SELECT city, COUNT(*) AS count FROM signup GROUP BY city ORDER BY count DESC;

-- Count users by state
SELECT state, COUNT(*) AS count FROM signup GROUP BY state ORDER BY count DESC;

-- Count users by account type
SELECT accountType, COUNT(*) AS count FROM signup3 GROUP BY accountType;

-- Count users with face ID
SELECT 
    COUNT(CASE WHEN face_token IS NOT NULL THEN 1 END) AS with_face_id,
    COUNT(CASE WHEN face_token IS NULL THEN 1 END) AS without_face_id
FROM login;

-- Total transactions count
SELECT COUNT(*) AS total_transactions FROM bank;

-- Count transactions by type
SELECT type, COUNT(*) AS count FROM bank GROUP BY type;

-- Sum of all deposits
SELECT SUM(amount) AS total_deposits FROM bank WHERE type = 'Deposit';

-- Sum of all withdrawals
SELECT SUM(amount) AS total_withdrawals FROM bank WHERE type = 'Withdrawl';

-- Average transaction amount
SELECT AVG(amount) AS avg_transaction FROM bank;

-- Total balance calculation (deposits - withdrawals)
SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM bank WHERE type = 'Deposit') -
    (SELECT COALESCE(SUM(amount), 0) FROM bank WHERE type = 'Withdrawl') AS total_balance;

-- Count users by income bracket
SELECT income, COUNT(*) AS count FROM signup2 GROUP BY income;

-- Count senior citizens vs non-senior
SELECT seniorcitizen, COUNT(*) AS count FROM signup2 GROUP BY seniorcitizen;


-- =====================================================
-- 5. ADVANCED QUERIES
-- =====================================================

-- Get users registered in last 30 days (assuming you have a registration date)
-- Note: Add a created_at column to signup table for this
-- SELECT * FROM signup WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Get top 10 most recent transactions
SELECT * FROM bank ORDER BY date DESC LIMIT 10;

-- Get users with PAN card
SELECT 
    s1.name,
    s1.email,
    s2.pan
FROM signup s1
INNER JOIN signup2 s2 ON s1.formno = s2.formno
WHERE s2.pan IS NOT NULL AND s2.pan != '';

-- Get users with Aadhar card
SELECT 
    s1.name,
    s1.email,
    s2.aadhar
FROM signup s1
INNER JOIN signup2 s2 ON s1.formno = s2.formno
WHERE s2.aadhar IS NOT NULL AND s2.aadhar != '';

-- Get account balance by PIN
SELECT 
    l.cardnumber,
    s1.name,
    (SELECT COALESCE(SUM(amount), 0) FROM bank WHERE pin = l.pin AND type = 'Deposit') -
    (SELECT COALESCE(SUM(amount), 0) FROM bank WHERE pin = l.pin AND type = 'Withdrawl') AS balance
FROM login l
INNER JOIN signup s1 ON l.formno = s1.formno;

-- Get users who have completed all signup steps
SELECT 
    s1.formno,
    s1.name,
    s1.email,
    'Complete' AS signup_status
FROM signup s1
INNER JOIN signup2 s2 ON s1.formno = s2.formno
INNER JOIN signup3 s3 ON s1.formno = s3.formno
INNER JOIN login l ON s1.formno = l.formno;

-- Get incomplete signups (started but not finished)
SELECT 
    s1.formno,
    s1.name,
    s1.email,
    CASE 
        WHEN s2.formno IS NULL THEN 'Stopped at Page 1'
        WHEN s3.formno IS NULL THEN 'Stopped at Page 2'
        WHEN l.formno IS NULL THEN 'Stopped at Page 3'
    END AS signup_status
FROM signup s1
LEFT JOIN signup2 s2 ON s1.formno = s2.formno
LEFT JOIN signup3 s3 ON s1.formno = s3.formno
LEFT JOIN login l ON s1.formno = l.formno
WHERE s2.formno IS NULL OR s3.formno IS NULL OR l.formno IS NULL;

-- Search users by name (pattern matching)
SELECT * FROM signup WHERE name LIKE '%John%';

-- Get users by age range (calculate age from DOB)
SELECT 
    formno,
    name,
    dob,
    TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
FROM signup
WHERE TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN 18 AND 30;

-- Get monthly transaction summary
SELECT 
    DATE_FORMAT(date, '%Y-%m') AS month,
    type,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount
FROM bank
GROUP BY DATE_FORMAT(date, '%Y-%m'), type
ORDER BY month DESC, type;

-- Get users with specific facilities
SELECT 
    s1.name,
    s1.email,
    s3.accountType,
    s3.facility
FROM signup s1
INNER JOIN signup3 s3 ON s1.formno = s3.formno
WHERE s3.facility LIKE '%ATM Card%';


-- =====================================================
-- 6. UTILITY QUERIES
-- =====================================================

-- Get table structure
DESCRIBE signup;
DESCRIBE signup2;
DESCRIBE signup3;
DESCRIBE login;
DESCRIBE bank;

-- Count records in all tables
SELECT 'signup' AS table_name, COUNT(*) AS record_count FROM signup
UNION ALL
SELECT 'signup2', COUNT(*) FROM signup2
UNION ALL
SELECT 'signup3', COUNT(*) FROM signup3
UNION ALL
SELECT 'login', COUNT(*) FROM login
UNION ALL
SELECT 'bank', COUNT(*) FROM bank;

-- Find duplicate emails
SELECT email, COUNT(*) AS count 
FROM signup 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Find duplicate card numbers
SELECT cardnumber, COUNT(*) AS count 
FROM signup3 
GROUP BY cardnumber 
HAVING COUNT(*) > 1;

-- Get database size
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'bankmanagementsystem'
ORDER BY (data_length + index_length) DESC;


-- =====================================================
-- 7. PARAMETERIZED QUERY TEMPLATES (For Node.js)
-- =====================================================

-- These are template queries to use in server.js with mysql2

-- Find user by form number
-- SELECT * FROM signup WHERE formno = ?

-- Verify login credentials
-- SELECT * FROM login WHERE cardnumber = ? AND pin = ?

-- Get user transactions
-- SELECT * FROM bank WHERE pin = ? ORDER BY date DESC

-- Insert new signup (page 1)
-- INSERT INTO signup (formno, name, fname, dob, gender, email, marital, address, city, pin, state) 
-- VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

-- Insert new signup2 (page 2)
-- INSERT INTO signup2 (formno, religion, category, income, education, occupation, pan, aadhar, seniorcitizen, existingaccount)
-- VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

-- Insert new signup3 (page 3)
-- INSERT INTO signup3 (formno, accountType, cardnumber, pin, facility)
-- VALUES (?, ?, ?, ?, ?)

-- Insert new login
-- INSERT INTO login (formno, cardnumber, pin, face_token, face_image)
-- VALUES (?, ?, ?, ?, ?)

-- Insert new transaction
-- INSERT INTO bank (pin, date, type, amount)
-- VALUES (?, NOW(), ?, ?)

-- Update user email
-- UPDATE signup SET email = ? WHERE formno = ?

-- Update face ID
-- UPDATE login SET face_token = ?, face_image = ? WHERE cardnumber = ?

-- Delete user (cascade delete from all tables)
-- DELETE FROM bank WHERE pin = (SELECT pin FROM login WHERE formno = ?)
-- DELETE FROM login WHERE formno = ?
-- DELETE FROM signup3 WHERE formno = ?
-- DELETE FROM signup2 WHERE formno = ?
-- DELETE FROM signup WHERE formno = ?


-- =====================================================
-- 8. REPORTING QUERIES
-- =====================================================

-- Daily transaction report
SELECT 
    DATE(date) AS transaction_date,
    type,
    COUNT(*) AS count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount,
    MIN(amount) AS min_amount,
    MAX(amount) AS max_amount
FROM bank
GROUP BY DATE(date), type
ORDER BY transaction_date DESC, type;

-- User demographics report
SELECT 
    s1.state,
    s1.city,
    s1.gender,
    s2.income,
    COUNT(*) AS user_count
FROM signup s1
LEFT JOIN signup2 s2 ON s1.formno = s2.formno
GROUP BY s1.state, s1.city, s1.gender, s2.income
ORDER BY user_count DESC;

-- Account type distribution
SELECT 
    s3.accountType,
    COUNT(*) AS count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM signup3)), 2) AS percentage
FROM signup3 s3
GROUP BY s3.accountType;

-- Face ID adoption rate
SELECT 
    COUNT(*) AS total_users,
    SUM(CASE WHEN face_token IS NOT NULL THEN 1 ELSE 0 END) AS users_with_face_id,
    ROUND((SUM(CASE WHEN face_token IS NOT NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS adoption_percentage
FROM login;


-- =====================================================
-- END OF QUERIES FILE
-- =====================================================

-- To run specific queries:
-- 1. Open MySQL command line or MySQL Workbench
-- 2. Connect to your database: USE bankmanagementsystem;
-- 3. Copy and paste the query you want to run
-- 4. Execute and view results
