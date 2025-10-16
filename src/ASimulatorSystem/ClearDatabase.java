package ASimulatorSystem;

import java.sql.*;
import javax.swing.JOptionPane;

public class ClearDatabase {
    public static void main(String[] args) {
        try {
            // Confirm before deleting
            int response = JOptionPane.showConfirmDialog(null, 
                "This will DELETE ALL account data from the database!\n\n" +
                "Are you sure you want to continue?", 
                "Confirm Database Clear", 
                JOptionPane.YES_NO_OPTION, 
                JOptionPane.WARNING_MESSAGE);
            
            if (response == JOptionPane.YES_OPTION) {
                Conn c = new Conn();
                
                System.out.println("Clearing all data from database...");
                
                // Delete all records from all tables
                try {
                    c.s.executeUpdate("DELETE FROM bank");
                    System.out.println("✓ Cleared bank table (transactions)");
                } catch (SQLException e) {
                    System.out.println("Note: bank table might not exist yet");
                }
                
                try {
                    c.s.executeUpdate("DELETE FROM login");
                    System.out.println("✓ Cleared login table");
                } catch (SQLException e) {
                    System.out.println("Note: login table might not exist yet");
                }
                
                try {
                    c.s.executeUpdate("DELETE FROM signup");
                    System.out.println("✓ Cleared signup table");
                } catch (SQLException e) {
                    System.out.println("Note: signup table might not exist yet");
                }
                
                try {
                    c.s.executeUpdate("DELETE FROM signup2");
                    System.out.println("✓ Cleared signup2 table");
                } catch (SQLException e) {
                    System.out.println("Note: signup2 table might not exist yet");
                }
                
                try {
                    c.s.executeUpdate("DELETE FROM signup3");
                    System.out.println("✓ Cleared signup3 table");
                } catch (SQLException e) {
                    System.out.println("Note: signup3 table might not exist yet");
                }
                
                // Verify deletion
                ResultSet rs = c.s.executeQuery("SELECT COUNT(*) as count FROM login");
                if (rs.next()) {
                    System.out.println("\nRemaining accounts in login table: " + rs.getInt("count"));
                }
                
                JOptionPane.showMessageDialog(null, 
                    "Database cleared successfully!\n\n" +
                    "All account data has been deleted.\n" +
                    "You can now create new accounts.", 
                    "Success", 
                    JOptionPane.INFORMATION_MESSAGE);
                
                System.out.println("\n✓ Database cleared successfully!");
                System.out.println("You can now create new accounts.");
                
            } else {
                System.out.println("Database clear cancelled by user.");
                JOptionPane.showMessageDialog(null, "Operation cancelled.");
            }
            
            System.exit(0);
            
        } catch (Exception e) {
            System.out.println("Error clearing database:");
            e.printStackTrace();
            JOptionPane.showMessageDialog(null, 
                "Error clearing database:\n" + e.getMessage(), 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }
}
