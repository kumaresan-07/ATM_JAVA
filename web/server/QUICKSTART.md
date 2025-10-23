# NexusBank ATM Server - Quickstart (Windows)

1) Create the MySQL database and tables

 - Open a MySQL shell or use a GUI (MySQL Workbench). From a terminal you can run:

   mysql -u root -p < schema.sql

 This will create the database `bankmanagementsystem` and required tables.

2) Configure server credentials

 - Copy `.env.example` to `.env` and set your MySQL password (or create a dedicated user):

   Copy-Item .env.example .env
   # then edit .env in notepad or VS Code and fill DB_PASSWORD

3) Install dependencies (if you haven't already)

 - In PowerShell it's easiest to use the batch wrapper to avoid script execution policy issues:

   cd /d d:\PROJECTS\ATM_JAVA\web\server
   npm.cmd install

4) Start the server

 - Use npm.cmd in PowerShell or run in Command Prompt (cmd.exe):

   npm.cmd start

 - The server will print a banner. Check the health endpoint in your browser or curl:

   http://localhost:3000/api/health

5) Frontend

 - Serve or open `d:\PROJECTS\ATM_JAVA\web\index.html` in a browser. The frontend is configured to call `http://localhost:3000/api` by default.

Security note: Do not commit `.env` with real credentials. Use .env and keep secrets local.
