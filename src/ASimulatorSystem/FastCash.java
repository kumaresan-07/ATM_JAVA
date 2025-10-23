package ASimulatorSystem;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.sql.*;
import java.util.Date;

public class FastCash extends JFrame implements ActionListener {

    JLabel l1, l2;
    JButton b1, b2, b3, b4, b5, b6, b7, b8;
    JTextField t1;
    String pin;

    FastCash(String pin) {
        this.pin = pin;
        ImageIcon i1 = new ImageIcon(ClassLoader.getSystemResource("ASimulatorSystem/icons/atm.jpg"));
        Image i2 = i1.getImage().getScaledInstance(1000, 1180, Image.SCALE_DEFAULT);
        ImageIcon i3 = new ImageIcon(i2);
        JLabel l3 = new JLabel(i3);
        l3.setBounds(0, 0, 960, 1080);
        add(l3);

        l1 = new JLabel("SELECT WITHDRAWL AMOUNT");
        l1.setForeground(Color.WHITE);
        l1.setFont(new Font("System", Font.BOLD, 16));

        b1 = new JButton("Rs 100");
        b2 = new JButton("Rs 500");
        b3 = new JButton("Rs 1000");
        b4 = new JButton("Rs 2000");
        b5 = new JButton("Rs 5000");
        b6 = new JButton("Rs 10000");
        b7 = new JButton("BACK");

        setLayout(null);

        l1.setBounds(235, 400, 700, 35);
        l3.add(l1);

        b1.setBounds(170, 499, 150, 35);
        l3.add(b1);

        b2.setBounds(390, 499, 150, 35);
        l3.add(b2);

        b3.setBounds(170, 543, 150, 35);
        l3.add(b3);

        b4.setBounds(390, 543, 150, 35);
        l3.add(b4);

        b5.setBounds(170, 588, 150, 35);
        l3.add(b5);

        b6.setBounds(390, 588, 150, 35);
        l3.add(b6);

        b7.setBounds(390, 633, 150, 35);
        l3.add(b7);

        b1.addActionListener(this);
        b2.addActionListener(this);
        b3.addActionListener(this);
        b4.addActionListener(this);
        b5.addActionListener(this);
        b6.addActionListener(this);
        b7.addActionListener(this);

        setSize(960, 1080);
        setLocation(500, 0);
        setUndecorated(true);
        setVisible(true);

    }

    public void actionPerformed(ActionEvent ae) {
        try {
            // If the BACK button was pressed, go back immediately
            if (ae.getSource() == b7) {
                this.setVisible(false);
                new Transactions(pin).setVisible(true);
                return;
            }

            // For amount buttons: extract numeric amount safely
            String label = ((JButton) ae.getSource()).getText();
            // Remove non-digit characters and trim
            String amountStr = label.replaceAll("\\D+", "").trim();
            if (amountStr.isEmpty()) {
                JOptionPane.showMessageDialog(null, "Invalid amount selected: " + label);
                return;
            }

            int amount = 0;
            try {
                amount = Integer.parseInt(amountStr);
            } catch (NumberFormatException nfe) {
                JOptionPane.showMessageDialog(null, "Unable to parse amount: " + amountStr);
                return;
            }

            Conn c = new Conn();

            // Create bank table if it doesn't exist
            c.s.executeUpdate("CREATE TABLE IF NOT EXISTS bank (" +
                    "pin varchar(10), " +
                    "date varchar(50), " +
                    "type varchar(20), " +
                    "amount varchar(20))");

            // Calculate current balance for this PIN
            ResultSet rs = c.s.executeQuery("select * from bank where pin = '" + pin + "'");
            int balance = 0;
            while (rs.next()) {
                String t = rs.getString("type");
                String a = rs.getString("amount");
                int val = 0;
                try {
                    val = Integer.parseInt(a);
                } catch (Exception ex) {
                    // skip malformed amount
                    continue;
                }
                if ("Deposit".equalsIgnoreCase(t)) {
                    balance += val;
                } else {
                    balance -= val;
                }
            }

            if (balance < amount) {
                JOptionPane.showMessageDialog(null, "Insufficient Balance");
                return;
            }

            Date date = new Date();
            c.s.executeUpdate("insert into bank values('" + pin + "', '" + date + "', 'Withdrawl', '" + amount + "')");
            JOptionPane.showMessageDialog(null, "Rs. " + amount + " Debited Successfully");

            setVisible(false);
            new Transactions(pin).setVisible(true);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void main(String[] args) {
        new FastCash("").setVisible(true);
    }
}
