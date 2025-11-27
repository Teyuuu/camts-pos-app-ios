// alerts.js - Alerts page functionality

let allAlerts = [];

// Generate alerts from system data
function generateAlerts() {
    const alerts = [];
    
    // Inventory alerts
    const inventory = AppData.inventory;
    inventory.forEach(item => {
        if (item.qty === 0) {
            alerts.push({
                priority: 'critical',
                type: 'Inventory',
                message: `${item.product.toUpperCase()} Charcoal is OUT OF STOCK!`,
                time: 'Just now'
            });
        } else if (item.qty < 5) {
            alerts.push({
                priority: 'high',
                type: 'Inventory',
                message: `${item.product.toUpperCase()} Charcoal has only ${item.qty} sacks left (Low Stock)`,
                time: 'Just now'
            });
        }
    });
    
    // Accounts alerts
    const accounts = AppData.accounts;
    const today = new Date();
    accounts.forEach(acc => {
        const dueDate = new Date(acc.due_date);
        if (dueDate < today && acc.status !== 'paid') {
            const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
            alerts.push({
                priority: 'high',
                type: 'Accounts Payable',
                message: `Payment to ${acc.company} is ${daysOverdue} day(s) overdue (₱${parseFloat(acc.payable).toFixed(2)})`,
                time: 'Just now'
            });
        } else if (dueDate - today < 7 * 24 * 60 * 60 * 1000 && dueDate > today) {
            alerts.push({
                priority: 'warning',
                type: 'Accounts Payable',
                message: `Payment to ${acc.company} is due soon (₱${parseFloat(acc.payable).toFixed(2)})`,
                time: 'Just now'
            });
        }
    });
    
    // Delivery alerts
    const deliveries = AppData.deliveries;
    deliveries.forEach(d => {
        const deliveryDate = new Date(d.delivery_date);
        if (deliveryDate < today && d.status !== 'Delivered') {
            alerts.push({
                priority: 'high',
                type: 'Delivery',
                message: `Delivery to ${d.company} is overdue (${d.qty} sacks of ${d.product})`,
                time: 'Just now'
            });
        } else if (deliveryDate.toDateString() === today.toDateString()) {
            alerts.push({
                priority: 'warning',
                type: 'Delivery',
                message: `Delivery to ${d.company} scheduled for today (${d.qty} sacks of ${d.product})`,
                time: 'Just now'
            });
        }
    });
    
    allAlerts = alerts;
    renderAlerts(alerts);
}

// Render alerts table
function renderAlerts(alerts) {
    const tbody = document.getElementById('alertsTableBody');
    const alertCount = document.getElementById('alertCount');
    
    alertCount.textContent = alerts.length;
    
    if (alerts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="no-alerts">
                    <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                    <h3>All Clear!</h3>
                    <p style="color: #7f8c8d;">No active alerts at the moment. Your system is running smoothly.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = alerts.map(alert => `
        <tr data-type="${alert.type}" data-priority="${alert.priority}">
            <td>
                <span class="priority-badge priority-${alert.priority}">
                    ${alert.priority.toUpperCase()}
                </span>
            </td>
            <td>
                <span class="alert-type type-${alert.type.toLowerCase().replace(' ', '-')}">
                    ${alert.type}
                </span>
            </td>
            <td>${alert.message}</td>
            <td><small style="color: #7f8c8d;">${alert.time}</small></td>
        </tr>
    `).join('');
}

// Filter alerts
function filterAlerts() {
    const typeFilter = document.getElementById('filterType').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    
    let filteredAlerts = allAlerts;
    
    if (typeFilter !== 'all') {
        filteredAlerts = filteredAlerts.filter(a => a.type === typeFilter);
    }
    
    if (priorityFilter !== 'all') {
        filteredAlerts = filteredAlerts.filter(a => a.priority === priorityFilter);
    }
    
    renderAlerts(filteredAlerts);
}

// Initialize
generateAlerts();