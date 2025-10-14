package ASimulatorSystem;package ASimulatorSystem;package ASimulatorSystem;



import java.sql.*;



public class TestDB {import java.sql.*;import java.sql.*;

    public static void main(String[] args) {

        System.out.println("Testing ATM database connection...");

        

        try {public class TestDB {public class TestDB {

            // Load the JDBC driver

            Class.forName("com.mysql.cj.jdbc.Driver");    public static void main(String[] args) {    public static void main(String[] args) {

            System.out.println("1. Driver loaded successfully");

                    System.out.println("Testing ATM database connection...");        System.out.println("Testing ATM database connection...");

            // Connection parameters

            String url = "jdbc:mysql://localhost:3306/bankmanagementsystem?allowPublicKeyRetrieval=true&useSSL=false";                

            String user = "root";

            String password = "atm123";        try {        try {

            

            System.out.println("URL: " + url);            // Load the JDBC driver            // Load the JDBC driver

            System.out.println("Username: " + user);

            System.out.println("Password is set: " + (password != null && !password.isEmpty()));            Class.forName("com.mysql.cj.jdbc.Driver");            Class.forName("com.mysql.cj.jdbc.Driver");

            

            System.out.println("\n2. Connecting to MySQL...");            System.out.println("1. Driver loaded successfully");            System.out.println("1. Driver loaded successfully");

            Connection conn = DriverManager.getConnection(url, user, password);

            Statement stmt = conn.createStatement();                        

            

            System.out.println("\n3. Creating and using database...");            // Connection parameters            // Connection parameters

            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS bankmanagementsystem");

            stmt.executeUpdate("USE bankmanagementsystem");            String url = "jdbc:mysql://localhost:3306/bankmanagementsystem?allowPublicKeyRetrieval=true&useSSL=false";            String url = "jdbc:mysql://localhost:3306/bankmanagementsystem?allowPublicKeyRetrieval=true&useSSL=false";

            

            System.out.println("\n4. Creating tables...");            String user = "root";            String user = "root";

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS signup ("

                + "formno varchar(20), "            String password = "atm123";            String password = "atm123";

                + "name varchar(20), "

                + "fname varchar(20), "                        

                + "dob varchar(20), "

                + "gender varchar(20), "            System.out.println("URL: " + url);            System.out.println("URL: " + url);

                + "email varchar(30), "

                + "marital varchar(20), "            System.out.println("Username: " + user);            System.out.println("Username: " + user);

                + "address varchar(40), "

                + "city varchar(25), "            System.out.println("Password is set: " + (password != null && !password.isEmpty()));            System.out.println("Password is set: " + (password != null && !password.isEmpty()));

                + "pincode varchar(20), "

                + "state varchar(25))");                        

            System.out.println("Signup table created/verified!");

                        System.out.println("\n2. Connecting to MySQL...");            System.out.println("\nStep 3: Connecting to MySQL...");

            System.out.println("\n5. Testing query...");

            ResultSet rs = stmt.executeQuery("SELECT VERSION()");            Connection conn = DriverManager.getConnection(url, user, password);            Connection conn = DriverManager.getConnection(url, user, password);

            if (rs.next()) {

                System.out.println("MySQL Version: " + rs.getString(1));            Statement stmt = conn.createStatement();            Statement stmt = conn.createStatement();

            }

                                    

            // Test if we can query the table

            rs = stmt.executeQuery("SHOW TABLES");            System.out.println("\n3. Creating and using database...");            System.out.println("\nStep 4: Creating and using database...");

            System.out.println("\nExisting tables:");

            while (rs.next()) {            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS bankmanagementsystem");            stmt.executeUpdate("CREATE DATABASE IF NOT EXISTS bankmanagementsystem");

                System.out.println("- " + rs.getString(1));

            }            stmt.executeUpdate("USE bankmanagementsystem");            stmt.executeUpdate("USE bankmanagementsystem");

            

            System.out.println("\n✓ Connection test successful!");                        System.out.println("Database ready!");

            conn.close();

                        System.out.println("\n4. Creating tables...");            

        } catch (ClassNotFoundException e) {

            System.out.println("\n❌ Driver Error:");            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS signup (" +            System.out.println("\nStep 5: Testing query...");

            System.out.println("MySQL JDBC Driver not found.");

            e.printStackTrace();                "formno varchar(20), " +            ResultSet rs = stmt.executeQuery("SELECT VERSION()");

        } catch (SQLException e) {

            System.out.println("\n❌ SQL Error:");                "name varchar(20), " +            if (rs.next()) {

            System.out.println("Message: " + e.getMessage());

            System.out.println("SQLState: " + e.getSQLState());                "fname varchar(20), " +                System.out.println("MySQL Version: " + rs.getString(1));

            System.out.println("Error Code: " + e.getErrorCode());

            e.printStackTrace();                "dob varchar(20), " +            }

        }

    }                "gender varchar(20), " +            

}
                "email varchar(30), " +            System.out.println("\n✓ Connection test successful!");

                "marital varchar(20), " +            conn.close();

                "address varchar(40), " +        } catch (Exception e) {

                "city varchar(25), " +            System.out.println("\n❌ Error occurred:");

                "pincode varchar(20), " +            e.printStackTrace();

                "state varchar(25))");        }

            System.out.println("Signup table created/verified!");    }

            }

            System.out.println("\n5. Testing query...");        } catch (Exception e) {

            ResultSet rs = stmt.executeQuery("SELECT VERSION()");            System.out.println("\n❌ Error occurred:");

            if (rs.next()) {            e.printStackTrace();

                System.out.println("MySQL Version: " + rs.getString(1));        }

            }            System.out.println("\nCreating tables...");

                        connection.s.executeUpdate("CREATE TABLE IF NOT EXISTS signup (" +

            // Test if we can query the table                "formno varchar(20), " +

            rs = stmt.executeQuery("SHOW TABLES");                "name varchar(20), " +

            System.out.println("\nExisting tables:");                "fname varchar(20), " +

            while (rs.next()) {                "dob varchar(20), " +

                System.out.println("- " + rs.getString(1));                "gender varchar(20), " +

            }                "email varchar(30), " +

                            "marital varchar(20), " +

            System.out.println("\n✓ Connection test successful!");                "address varchar(40), " +

            conn.close();                "city varchar(25), " +

                            "pincode varchar(20), " +

        } catch (ClassNotFoundException e) {                "state varchar(25))");

            System.out.println("\n❌ Driver Error:");            System.out.println("Signup table created/verified!");

            System.out.println("MySQL JDBC Driver not found.");            

            e.printStackTrace();            // Test if we can query the table

        } catch (SQLException e) {            var rs = connection.s.executeQuery("SHOW TABLES");

            System.out.println("\n❌ SQL Error:");            System.out.println("\nExisting tables:");

            System.out.println("Message: " + e.getMessage());            while (rs.next()) {

            System.out.println("SQLState: " + e.getSQLState());                System.out.println("- " + rs.getString(1));

            System.out.println("Error Code: " + e.getErrorCode());            }

            e.printStackTrace();            

        }        } catch (Exception e) {

    }            System.out.println("\nError occurred:");

}            e.printStackTrace();
        }
    }
}