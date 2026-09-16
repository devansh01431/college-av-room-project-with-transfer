const API = 'http://localhost:3000/api';
let equipment = [];
let loans = [];
const stockList = document.getElementById('stockList');
const adminStock = document.getElementById('adminStock');
const equipmentSelect = document.getElementById('equipment');
const loanList = document.getElementById('loanList');
const message = document.getElementById('message');
const transferLoan = document.getElementById('transferLoan');

function showMessage(text, type) { message.textContent = text; message.className = `message ${type}`; }

async function loadData() {
  const [equipmentResponse, loanResponse] = await Promise.all([fetch(`${API}/equipment`), fetch(`${API}/loans`)]);
  equipment = await equipmentResponse.json();
  loans = await loanResponse.json();
  render();
}

function render() {
  stockList.innerHTML = equipment.map(item => `<div class="stock-item">${item.name}: ${item.available} available</div>`).join('');
  equipmentSelect.innerHTML = equipment.map(item => `<option value="${item.id}" ${item.available === 0 ? 'disabled' : ''}>${item.name} (${item.available} available)</option>`).join('');
  adminStock.innerHTML = equipment.map(item => `<div class="admin-item"><span>${item.name}: ${item.available} available</span><button class="return-button restock" data-id="${item.id}">Add 1 unit</button></div>`).join('');
  loanList.innerHTML = loans.length ? loans.map(loan => `<tr><td>${loan.student}</td><td>${loan.item}</td><td>${loan.dueDate}</td><td><button class="return-button return" data-id="${loan.id}">Return</button></td></tr>`).join('') : '<tr><td class="empty" colspan="4">No active loans.</td></tr>';
  transferLoan.innerHTML = loans.length
    ? loans.map(loan => `<option value="${loan.id}">${loan.item} — ${loan.student} (due ${loan.dueDate})</option>`).join('')
    : '<option value="">No active loans to transfer</option>';
  transferLoan.disabled = loans.length === 0;
}

document.getElementById('borrowForm').addEventListener('submit', async event => {
  event.preventDefault();
  const body = { student: document.getElementById('studentName').value.trim(), equipmentId: equipmentSelect.value, dueDate: document.getElementById('dueDate').value };
  const response = await fetch(`${API}/loans`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  const result = await response.json();
  showMessage(result.message, response.ok ? 'success' : 'error');
  if (response.ok) { event.target.reset(); loadData(); }
});

document.getElementById('transferForm').addEventListener('submit', async event => {
  event.preventDefault();
  const loanId = transferLoan.value;
  const student = document.getElementById('newBorrower').value.trim();
  const response = await fetch(`${API}/loans/${loanId}/transfer`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student })
  });
  const result = await response.json();
  showMessage(result.message, response.ok ? 'success' : 'error');
  if (response.ok) { event.target.reset(); loadData(); }
});

document.addEventListener('click', async event => {
  const id = event.target.dataset.id;
  if (event.target.matches('.return')) {
    const response = await fetch(`${API}/loans/${id}/return`, { method:'POST' });
    const result = await response.json();
    showMessage(result.lateDays ? `${result.message} Late fee: ₹${result.lateFee}.` : `${result.message} No late fee.`, 'success');
    loadData();
  }
  if (event.target.matches('.restock')) { await fetch(`${API}/equipment/${id}/restock`, { method:'PATCH' }); loadData(); }
  if (event.target.matches('.tab')) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab === event.target));
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('hidden', view.id !== event.target.dataset.view));
  }
});

loadData().catch(() => showMessage('Start the server first, then refresh this page.', 'error'));
