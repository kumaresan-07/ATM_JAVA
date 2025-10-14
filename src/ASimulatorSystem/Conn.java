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

            // First connect to MySQL server (without database)
            String serverUrl = "jdbc:mysql://localhost:3306/?allowPublicKeyRetrieval=true&useSSL=false";
            String username = "root";
            String password = "atm123";  // MySQL root password

            System.out.println("Connection details:");
            System.out.println("URL: " + serverUrl);
            System.out.println("Username: " + username);

            System.out.println("Attempting MySQL connection...");
            // Connect to MySQL server
            c = DriverManager.getConnection(serverUrl, username, password);
            s = c.createStatement();
            System.out.println("Connected to MySQL server successfully!");
            
            // Create database if it doesn't exist
            s.executeUpdate("CREATE DATABASE IF NOT EXISTS bankmanagementsystem");
            System.out.println("Database 'bankmanagementsystem' created/verified");
            
            // Use the database
            s.executeUpdate("USE bankmanagementsystem");
            System.out.println("Now using 'bankmanagementsystem' database");

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
}
