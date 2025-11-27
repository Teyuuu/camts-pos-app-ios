// accounts.js - Accounts payable page functionality

// Handle form submission
document.getElementById('accountsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const account = {
        company: formData.get('company'),
        contact_person: formData.get('contact_person'),
        phone: formData.get('phone'),
        invoice_number: formData.get('invoice_number'),
        category: formData.get('category'),
        priority: formData.get('priority'),
        payable: parseFloat(formData.get('payable')),
        invoice_date: formData.get('invoice_date'),
        due_date: formData.get('due_date'),
        description: formData.get('description'),
        status: 'pending'
    };
    
    const accounts = AppData.accounts;
    accounts.unshift(account);
    AppData.accounts = accounts;
    
    renderAccountsTable();
    this.reset();
    showNotification('Account payable added successfully!', 'success');
});

// Render accounts table
function renderAccountsTable() {
    const tbody = document.getElementById('accountsTableBody');
    const accounts = AppData.accounts;
    
    if (accounts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">No accounts payable recorded yet.</td></tr>';
        return;
    }
    
    tbody.innerHTML = accounts.map(acc => {
        const dueDate = new Date(acc.due_date);
        const today = new Date();
        const isOverdue = dueDate < today && acc.status !== 'paid';
        
        return `
            <tr>
                <td>
                    <strong>${acc.company}</strong>
                    ${acc.contact_person ? '<br><small>' + acc.contact_person + '</small>' : ''}
                </td>
                <td>${acc.invoice_number || '-'}</td>
                <td>${acc.category || 'Other'}</td>
                <td style="font-weight: bold;">₱${parseFloat(acc.payable).toFixed(2)}</td>
                <td>
                    ${acc.due_date}
                    ${isOverdue ? '<br><span style="color: #e74c3c; font-weight: bold;">(Overdue)</span>' : ''}
                </td>
                <td>
                    <span class="status-badge ${isOverdue ? 'status-overdue' : acc.status === 'paid' ? 'status-paid' : 'status-pending'}">
                        ${isOverdue ? 'Overdue' : acc.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                </td>
                <td>${acc.priority || 'Medium'}</td>
            </tr>
        `;
    }).join('');
}

// Initialize
renderAccountsTable();