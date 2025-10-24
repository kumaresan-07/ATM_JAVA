-- Schema for NexusBank ATM (bankmanagementsystem)
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS bankmanagementsystem;
USE bankmanagementsystem;

-- Table: signup (page 1)
CREATE TABLE IF NOT EXISTS signup (
  formno VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255),
  fname VARCHAR(255),
  dob DATE,
  gender VARCHAR(20),
  email VARCHAR(255),
  marital VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  pin VARCHAR(20), -- pincode
  state VARCHAR(100)
);

-- Table: signup2 (page 2)
CREATE TABLE IF NOT EXISTS signup2 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  formno VARCHAR(20),
  religion VARCHAR(100),
  category VARCHAR(100),
  income VARCHAR(50),
  education VARCHAR(100),
  occupation VARCHAR(100),
  pan VARCHAR(20),
  aadhar VARCHAR(30),
  seniorcitizen VARCHAR(5),
  existingaccount VARCHAR(5),
  INDEX (formno)
);

-- Table: signup3 (page 3)
CREATE TABLE IF NOT EXISTS signup3 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  formno VARCHAR(20),
  accountType VARCHAR(50),
  cardnumber VARCHAR(32) UNIQUE,
  pin VARCHAR(10),
  facility TEXT,
  INDEX (formno)
);

-- Table: login (credentials)
CREATE TABLE IF NOT EXISTS login (
  id INT AUTO_INCREMENT PRIMARY KEY,
  formno VARCHAR(20),
  cardnumber VARCHAR(32) UNIQUE,
  pin VARCHAR(10),
  face_token TEXT,  -- Store Face++ face token for facial recognition
  face_image TEXT,  -- Store base64 image of user's face
  INDEX (formno)
);

-- Table: bank (transactions)
CREATE TABLE IF NOT EXISTS bank (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pin VARCHAR(10),
  date DATETIME,
  type VARCHAR(20),
  amount DECIMAL(10,2)
);

-- (Optional) insert a small test user (uncomment to use)
-- INSERT INTO signup (formno, name, fname, dob, gender, email, marital, address, city, pin, state)
-- VALUES ('1001', 'Test User', 'Test Father', '1990-01-01', 'Male', 'test@example.com', 'Single', '123 Test St', 'TestCity', '560001', 'TestState');
