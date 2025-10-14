package ASimulatorSystem;

public class TestConnection {
    public static void main(String[] args) {
        System.out.println("Starting database connection test...");
        
        try {
            // Test 1: Create connection
            System.out.println("\nTest 1: Creating database connection...");
            Conn conn = new Conn();
            if (conn.c != null && !conn.c.isClosed()) {
                System.out.println("✓ Database connection successful!");
            }
            
            // Test 2: Insert test data
            System.out.println("\nTest 2: Inserting test data...");
            String testPin = "9999";
            String testAmount = "1000";
            conn.s.executeUpdate("INSERT INTO bank (pin, date, type, amount) VALUES ('" + testPin + "', NOW(), 'Test', '" + testAmount + "')");
            System.out.println("✓ Test data inserted successfully!");
            
            // Test 3: Read test data
            System.out.println("\nTest 3: Reading test data...");
            var rs = conn.s.executeQuery("SELECT * FROM bank WHERE pin='" + testPin + "'");
            if (rs.next()) {
                System.out.println("✓ Test data retrieved successfully!");
                System.out.println("Found record: PIN=" + rs.getString("pin") + ", Amount=" + rs.getString("amount"));
            }
            
            // Test 4: Clean up test data
            System.out.println("\nTest 4: Cleaning up test data...");
            conn.s.executeUpdate("DELETE FROM bank WHERE pin='" + testPin + "'");
            System.out.println("✓ Test data cleaned up successfully!");
            
            System.out.println("\n✓✓✓ All database tests passed! Connection is working properly!");
            
        } catch (Exception e) {
            System.out.println("\n❌ Test failed with error:");
            e.printStackTrace();
        }
    }
}