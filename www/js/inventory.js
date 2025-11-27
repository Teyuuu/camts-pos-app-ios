// inventory.js - Inventory page functionality

function updateSummary() {
    const inventory = AppData.inventory;
    
    const totalProducts = inventory.length;
    const totalStock = inventory.reduce((sum, item) => sum + parseInt(item.qty), 0);
    const lowStock = inventory.filter(i => i.qty > 0 && i.qty < 5).length;
    const outOfStock = inventory.filter(i => i.qty === 0).length;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalStock').textContent = totalStock + ' sacks';
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
}

function renderInventory() {
    const grid = document.getElementById('inventoryGrid');
    const alerts = document.getElementById('inventoryAlerts');
    const inventory = AppData.inventory;
    
    // Generate alerts
    let alertsHtml = '';
    inventory.forEach(item => {
        if (item.qty === 0) {
            alertsHtml += `<div class="alert alert-danger"><strong>⚠️ OUT OF STOCK:</strong> ${item.product.toUpperCase()} Charcoal is completely out of stock!</div>`;
        } else if (item.qty < 5) {
            alertsHtml += `<div class="alert alert-warning"><strong>⚠️ LOW STOCK:</strong> ${item.product.toUpperCase()} Charcoal has only ${item.qty} sacks left.</div>`;
        }
    });
    alerts.innerHTML = alertsHtml;

    // Generate inventory cards
    grid.innerHTML = inventory.map((item, index) => {
        const stockClass = item.qty === 0 ? 'stock-out' : 
                          item.qty < 5 ? 'stock-low' : 
                          item.qty < 15 ? 'stock-medium' : 'stock-high';
        
        const stockStatus = item.qty === 0 ? 'Out of Stock' : 
                           item.qty < 5 ? 'Low Stock' : 
                           item.qty < 15 ? 'Medium Stock' : 'Good Stock';
        
        return `
            <div class="product-card">
                <div class="product-header">
                    <div class="product-name">${item.product.toUpperCase()} Charcoal</div>
                    <div class="stock-level ${stockClass}">${item.qty} sacks</div>
                </div>
                
                <div class="product-details">
                    <p><strong>SKU:</strong> ${item.product.toUpperCase()}-001</p>
                    <p><strong>Category:</strong> Charcoal Products</p>
                    <p><strong>Unit:</strong> Sacks (50kg each)</p>
                    <p><strong>Status:</strong> ${stockStatus}</p>
                </div>
                
                <div class="inventory-actions">
                    <input type="number" id="qty-${index}" min="1" placeholder="Add sacks">
                    <button onclick="restockItem(${index})" class="btn-restock">Restock</button>
                </div>
                
                <div class="inventory-actions">
                    <input type="number" id="use-${index}" min="1" max="${item.qty}" placeholder="Remove sacks">
                    <button onclick="useStock(${index})" class="btn-consume">Use Stock</button>
                </div>
            </div>
        `;
    }).join('');
    
    updateSummary();
}

function restockItem(index) {
    const qty = parseInt(document.getElementById(`qty-${index}`).value);
    if (qty && qty > 0) {
        const inventory = AppData.inventory;
        inventory[index].qty += qty;
        AppData.inventory = inventory;
        renderInventory();
        showNotification(`Added ${qty} sacks to inventory!`, 'success');
    } else {
        showNotification('Please enter a valid quantity', 'error');
    }
}

function useStock(index) {
    const qty = parseInt(document.getElementById(`use-${index}`).value);
    const inventory = AppData.inventory;
    
    if (qty && qty > 0 && qty <= inventory[index].qty) {
        inventory[index].qty -= qty;
        AppData.inventory = inventory;
        renderInventory();
        showNotification(`Removed ${qty} sacks from inventory!`, 'success');
    } else {
        showNotification('Please enter a valid quantity', 'error');
    }
}

// Initialize
renderInventory();