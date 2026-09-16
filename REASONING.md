# Reasoning

The assignment needs a way to track AV equipment, check availability, borrow equipment, return it, and apply a small late fee. I used a client-server structure: HTML/CSS/JavaScript for the client and a small Node.js/Express server for the API. This separates the student interface from the logic that updates equipment and loan data.

The server stores the equipment stock and active loans while it runs. Borrowing decreases the selected item's stock and creates a loan record. Returning removes that loan and increases stock again. A student cannot borrow an item when its available quantity is zero. On return, the server compares the current date with the due date and charges ₹10 for every late day. The Admin tab can also transfer an active loan by changing only the borrower name. It deliberately does not change the due date or stock, because the same item remains on loan.

This scope keeps the important borrowing, availability, and return requirements clear and easy to demonstrate.
