// delivery.js - Delivery page functionality

// Handle form submission
document.getElementById('deliveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const delivery = {
        company: formData.get('company'),
        contact_person: formData.get('contact_person'),
        phone: formData.get('phone'),
        product: formData.get('product'),
        qty: parseInt(formData.get('qty')),
        priority: formData.get('priority'),
        delivery_date: formData.get('delivery_date'),
        delivery_time: formData.get('delivery_time'),
        driver: formData.get('driver'),
        address: formData.get('address'),
        status: 'Scheduled'
    };
    
    const deliveries = AppData.deliveries;
    deliveries.unshift(delivery);
    AppData.deliveries = deliveries;
    
    renderDeliveriesTable();
    this.reset();
    showNotification('Delivery scheduled successfully!', 'success');
});

// Render deliveries table
function renderDeliveriesTable() {
    const tbody = document.getElementById('deliveryTableBody');
    const deliveries = AppData.deliveries;
    
    if (deliveries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">No deliveries scheduled yet.</td></tr>';
        return;
    }
    
    tbody.innerHTML = deliveries.map(d => `
        <tr>
            <td>
                <strong>${d.company}</strong>
                ${d.contact_person ? '<br><small>' + d.contact_person + '</small>' : ''}
            </td>
            <td>${d.product}</td>
            <td>${d.qty} sacks</td>
            <td>
                ${d.delivery_date}
                ${d.delivery_time ? '<br><small>' + d.delivery_time + '</small>' : ''}
            </td>
            <td>
                <span class="status-badge ${d.status === 'Delivered' ? 'status-available' : 'status-low-stock'}">
                    ${d.status}
                </span>
            </td>
            <td>${d.driver || '-'}</td>
        </tr>
    `).join('');
}

// Initialize
renderDeliveriesTable();