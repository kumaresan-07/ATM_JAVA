package ASimulatorSystem;

import java.sql.*;
import javax.swing.JOptionPane;

public class Conn {
    Connection c;
    Statement s;
    
    public Conn() {
        try {
            // Load the MySQL JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver loaded successfully");

            // Base URL for initial connection without database
            String baseUrl = "jdbc:mysql://localhost:3306/";
            String username = "root";
            String password = "";

            System.out.println("Connecting to MySQL...");
            c = DriverManager.getConnection(baseUrl, username, password);
            s = c.createStatement();

            // Drop and recreate database
            s.executeUpdate("DROP DATABASE IF EXISTS bankmanagementsystem");
            s.executeUpdate("CREATE DATABASE bankmanagementsystem");
            s.executeUpdate("USE bankmanagementsystem");
            System.out.println("Database created and selected");

            // Initialize all required tables
            initializeTables();
            System.out.println("Database tables initialized successfully");

        } catch (ClassNotFoundException e) {
            System.out.println("Error: MySQL JDBC Driver not found.");
            JOptionPane.showMessageDialog(null, "MySQL JDBC Driver not found.\n" + e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Error: Database connection failed.");
            JOptionPane.showMessageDialog(null, "Database connection failed.\n" + e.getMessage());
            e.printStackTrace();
        }
    }

    private void initializeTables() throws SQLException {
        System.out.println("Creating database tables...");

        // Create signup table
        String signup = "CREATE TABLE signup (" +
            "formno varchar(20), " +
            "name varchar(20), " +
            "fname varchar(20), " +
            "dob varchar(20), " +
            "gender varchar(20), " +
            "email varchar(30), " +
            "marital varchar(20), " +
            "address varchar(40), " +
            "city varchar(25), " +
            "pincode varchar(20), " +
            "state varchar(25))";
            
        s.executeUpdate(signup);
        System.out.println("Created signup table");

        // Create signup2 table
        String signup2 = "CREATE TABLE signup2 (" +
            "formno varchar(20), " +
            "religion varchar(20), " +
            "category varchar(20), " +
            "income varchar(20), " +
            "education varchar(20), " +
            "occupation varchar(20), " +
            "pan varchar(20), " +
            "aadhar varchar(20), " +
            "seniorcitizen varchar(20), " +
            "existingaccount varchar(20))";
            
        s.executeUpdate(signup2);
        System.out.println("Created signup2 table");

        // Create signup3 table
        String signup3 = "CREATE TABLE signup3 (" +
            "formno varchar(20), " +
            "accountType varchar(40), " +
            "cardnumber varchar(16), " +
            "pin varchar(4), " +
            "facility varchar(200))";
            
        s.executeUpdate(signup3);
        System.out.println("Created signup3 table");

        // Create login table
        String login = "CREATE TABLE login (" +
            "formno varchar(20), " +
            "cardnumber varchar(16), " +
            "pin varchar(4))";
            
        s.executeUpdate(login);
        System.out.println("Created login table");

        // Create bank table
        String bank = "CREATE TABLE bank (" +
            "pin varchar(4), " +
            "date varchar(50), " +
            "type varchar(20), " +
            "amount varchar(20))";
            
        s.executeUpdate(bank);
        System.out.println("Created bank table");
    }
}
