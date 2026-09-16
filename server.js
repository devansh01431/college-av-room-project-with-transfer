const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let equipment = [
  { id: 1, name: 'Camera', available: 3 },
  { id: 2, name: 'Projector', available: 2 },
  { id: 3, name: 'Mic', available: 5 },
  { id: 4, name: 'Tripod', available: 4 }
];
let loans = [];
let nextLoanId = 1;

app.get('/api/equipment', (req, res) => res.json(equipment));
app.get('/api/loans', (req, res) => res.json(loans));

app.post('/api/loans', (req, res) => {
  const { student, equipmentId, dueDate } = req.body;
  const item = equipment.find((entry) => entry.id === Number(equipmentId));

  if (!student || !dueDate || !item) {
    return res.status(400).json({ message: 'Please provide valid borrowing details.' });
  }
  if (item.available < 1) {
    return res.status(400).json({ message: `${item.name} is not available.` });
  }

  item.available -= 1;
  const loan = { id: nextLoanId++, student, equipmentId: item.id, item: item.name, dueDate };
  loans.push(loan);
  res.status(201).json({ message: `${item.name} borrowed successfully.`, loan });
});

app.post('/api/loans/:id/return', (req, res) => {
  const loanIndex = loans.findIndex((loan) => loan.id === Number(req.params.id));
  if (loanIndex === -1) return res.status(404).json({ message: 'Loan not found.' });

  const loan = loans[loanIndex];
  const item = equipment.find((entry) => entry.id === loan.equipmentId);
  item.available += 1;
  loans.splice(loanIndex, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${loan.dueDate}T00:00:00`);
  const lateDays = Math.max(0, Math.ceil((today - dueDate) / 86400000));
  const lateFee = lateDays * 10;
  res.json({ message: `${loan.item} returned.`, lateDays, lateFee });
});

// Transfer an active loan. Stock is unchanged and the original due date remains the same.
app.patch('/api/loans/:id/transfer', (req, res) => {
  const loan = loans.find((entry) => entry.id === Number(req.params.id));
  const newBorrower = req.body.student?.trim();

  if (!loan) return res.status(404).json({ message: 'Loan not found.' });
  if (!newBorrower) return res.status(400).json({ message: 'Enter the new borrower name.' });

  const oldBorrower = loan.student;
  loan.student = newBorrower;
  res.json({
    message: `${loan.item} transferred from ${oldBorrower} to ${newBorrower}. Due date remains ${loan.dueDate}.`,
    loan
  });
});

// Basic admin action: add one unit of an existing item.
app.patch('/api/equipment/:id/restock', (req, res) => {
  const item = equipment.find((entry) => entry.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Equipment not found.' });
  item.available += 1;
  res.json({ message: `${item.name} stock increased by 1.`, item });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
