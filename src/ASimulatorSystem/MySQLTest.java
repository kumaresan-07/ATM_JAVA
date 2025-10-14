package ASimulatorSystem;

import java.sql.*;

public class MySQLTest {
    public static void main(String[] args) {
        System.out.println("MySQL Connection Test Starting...");
        System.out.println("Java version: " + System.getProperty("java.version"));
        
        try {
            // 1. Test JDBC Driver
            System.out.println("\n1. Testing JDBC Driver...");
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                System.out.println("✓ JDBC Driver found!");
            } catch (ClassNotFoundException e) {
                System.out.println("❌ JDBC Driver not found!");
                System.out.println("Error: " + e.getMessage());
                return;
            }

            // 2. Test MySQL Connection
            System.out.println("\n2. Testing MySQL Connection...");
            String url = "jdbc:mysql://localhost:3306/";
            String user = "root";
            String password = "";  // Change this if you have a password set

            try {
                System.out.println("Connecting to: " + url);
                System.out.println("Username: " + user);
                System.out.println("Password: " + (password.isEmpty() ? "empty" : "set"));
                
                Connection conn = DriverManager.getConnection(url, user, password);
                System.out.println("✓ Connected to MySQL successfully!");
                
                // Get MySQL version
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT VERSION()");
                if (rs.next()) {
                    System.out.println("MySQL Version: " + rs.getString(1));
                }
                
                conn.close();
                System.out.println("✓ Connection closed properly");
                
            } catch (SQLException e) {
                System.out.println("❌ MySQL Connection Failed!");
                System.out.println("Error Code: " + e.getErrorCode());
                System.out.println("SQL State: " + e.getSQLState());
                System.out.println("Error Message: " + e.getMessage());
            }

        } catch (Exception e) {
            System.out.println("❌ Unexpected error:");
            e.printStackTrace();
        }
    }
}