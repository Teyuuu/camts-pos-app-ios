// sales.js - Sales page functionality

// Auto-calculate total amount
const qtyInput = document.getElementById('quantity');
const priceInput = document.getElementById('price_per_kg');
const amountInput = document.getElementById('amount');

function calculateTotal() {
    const qty = parseFloat(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    amountInput.value = (qty * price).toFixed(2);
}

qtyInput.addEventListener('input', calculateTotal);
priceInput.addEventListener('input', calculateTotal);

// Handle form submission
document.getElementById('salesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const sale = {
        company: formData.get('company'),
        product: formData.get('product'),
        quantity: parseFloat(formData.get('quantity')),
        price_per_kg: parseFloat(formData.get('price_per_kg')),
        amount: parseFloat(formData.get('amount')),
        payment_method: formData.get('payment_method'),
        date: new Date().toISOString()
    };
    
    const sales = AppData.sales;
    sales.unshift(sale);
    AppData.sales = sales;
    
    renderSalesTable();
    updateTotalToday();
    this.reset();
    showNotification('Sale added successfully!', 'success');
});

// Render sales table
function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    const sales = AppData.sales;
    
    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No sales recorded yet.</td></tr>';
        return;
    }
    
    tbody.innerHTML = sales.map(sale => `
        <tr>
            <td>${sale.company}</td>
            <td>${sale.product}</td>
            <td>${parseFloat(sale.quantity).toFixed(2)} kg</td>
            <td>₱${parseFloat(sale.price_per_kg).toFixed(2)}</td>
            <td style="font-weight: bold; color: #27ae60;">₱${parseFloat(sale.amount).toFixed(2)}</td>
            <td>${sale.payment_method}</td>
            <td>${new Date(sale.date).toLocaleString()}</td>
        </tr>
    `).join('');
}

// Update total sales today
function updateTotalToday() {
    const today = new Date().toISOString().split('T')[0];
    const sales = AppData.sales;
    
    const totalToday = sales
        .filter(sale => sale.date.startsWith(today))
        .reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    
    document.getElementById('totalToday').textContent = formatCurrency(totalToday);
}

// Initialize
renderSalesTable();
updateTotalToday();