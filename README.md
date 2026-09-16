# College AV Room Equipment Rental

A basic client-server web project for borrowing and returning college AV equipment.

## Features

- Student view: checks availability and borrows one available item.
- Admin view: sees active loans, returns equipment, and adds stock.
- Admin can transfer an active loan to another borrower. The original due date and equipment availability stay unchanged.
- Prevents borrowing an item when it is out of stock.
- Calculates a late fee of ₹10 per day when an item is returned after its due date.

## How to run

1. Download or clone this repository.
2. Open a terminal in the `server` folder.
3. Run `npm install` once.
4. Run `npm start` to start the server.
5. Open `http://localhost:3000` in a web browser.

The server runs at `http://localhost:3000`.
