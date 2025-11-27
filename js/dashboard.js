// dashboard.js - Dashboard specific functionality

function updateDashboard() {
    const sales = AppData.sales;
    const inventory = AppData.inventory;
    const accounts = AppData.accounts;
    const deliveries = AppData.deliveries;

    // Calculate KPIs
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const totalInventory = inventory.reduce((sum, item) => sum + parseInt(item.qty), 0);
    const totalPayable = accounts.reduce((sum, acc) => sum + parseFloat(acc.payable), 0);
    const activeDeliveries = deliveries.filter(d => d.status !== 'Delivered').length;

    // Update KPI displays
    document.getElementById('kpiSales').textContent = formatCurrency(totalSales);
    document.getElementById('kpiInventory').textContent = totalInventory;
    document.getElementById('kpiAccounts').textContent = formatCurrency(totalPayable);
    document.getElementById('kpiDeliveries').textContent = activeDeliveries;
}

// Initialize Charts
function initCharts() {
    const sales = AppData.sales.slice(0, 5);
    const inventory = AppData.inventory;

    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: sales.map(s => s.company.substring(0, 15)),
                datasets: [{
                    label: 'Sales Amount',
                    data: sales.map(s => s.amount),
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Inventory Chart
    const inventoryCtx = document.getElementById('inventoryChart');
    if (inventoryCtx) {
        new Chart(inventoryCtx, {
            type: 'doughnut',
            data: {
                labels: inventory.map(i => i.product.toUpperCase()),
                datasets: [{
                    data: inventory.map(i => i.qty),
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(155, 89, 182, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Initialize dashboard
updateDashboard();
initCharts();