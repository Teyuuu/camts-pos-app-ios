// common.js - Shared functionality across all pages

// Data Storage Manager
const AppData = {
    get sales() {
        return JSON.parse(localStorage.getItem('camts_sales') || '[]');
    },
    set sales(data) {
        localStorage.setItem('camts_sales', JSON.stringify(data));
    },
    
    get inventory() {
        return JSON.parse(localStorage.getItem('camts_inventory') || '[{"product":"ordinary","qty":15},{"product":"special","qty":8},{"product":"premium","qty":3},{"product":"bbq","qty":0}]');
    },
    set inventory(data) {
        localStorage.setItem('camts_inventory', JSON.stringify(data));
    },
    
    get accounts() {
        return JSON.parse(localStorage.getItem('camts_accounts') || '[]');
    },
    set accounts(data) {
        localStorage.setItem('camts_accounts', JSON.stringify(data));
    },
    
    get deliveries() {
        return JSON.parse(localStorage.getItem('camts_deliveries') || '[]');
    },
    set deliveries(data) {
        localStorage.setItem('camts_deliveries', JSON.stringify(data));
    },
    
    get attendance() {
        return JSON.parse(localStorage.getItem('camts_attendance') || '[]');
    },
    set attendance(data) {
        localStorage.setItem('camts_attendance', JSON.stringify(data));
    }
};

// Sidebar Management
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("sidebar-toggle");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
        toggleBtn.classList.toggle("active");
    });
}

// Touch/Swipe support for mobile sidebar
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (window.innerWidth <= 1024) {
        if (touchEndX < touchStartX - 50) {
            sidebar.classList.remove('mobile-open');
            toggleBtn.classList.remove('active');
        }
        if (touchEndX > touchStartX + 50 && touchStartX < 50) {
            sidebar.classList.add('mobile-open');
            toggleBtn.classList.add('active');
        }
    }
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            toggleBtn.classList.remove('active');
        }
    }
});

// Format Currency
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#f39c12'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update DateTime (for pages that use it)
function updateDateTime() {
    const now = new Date();
    const options = { timeZone: 'Asia/Manila' };
    
    const timeEl = document.getElementById('currentTime');
    const dateEl = document.getElementById('currentDate');
    
    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', options);
    }
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        });
    }

    // Attendance page specific
    const attendanceDay = document.getElementById('attendanceDay');
    const attendanceDate = document.getElementById('attendanceDate');
    const attendanceTime = document.getElementById('attendanceTime');
    
    if (attendanceTime) {
        attendanceDay.textContent = now.toLocaleDateString('en-US', { weekday: 'long', ...options });
        attendanceDate.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', ...options });
        attendanceTime.textContent = now.toLocaleTimeString('en-US', options);
    }
}

// Start clock updates
setInterval(updateDateTime, 1000);
updateDateTime();

// Export Data
function exportData() {
    const data = {
        sales: AppData.sales,
        inventory: AppData.inventory,
        accounts: AppData.accounts,
        deliveries: AppData.deliveries,
        attendance: AppData.attendance,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'camts-data-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
}

// Clear All Data
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        if (confirm('Really? This will delete all sales, inventory updates, accounts, deliveries, and attendance records!')) {
            localStorage.clear();
            
            // Reset to default inventory
            AppData.inventory = [
                {product:"ordinary",qty:15},
                {product:"special",qty:8},
                {product:"premium",qty:3},
                {product:"bbq",qty:0}
            ];
            
            showNotification('All data has been cleared!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }
}

// Add Sample Data
function addSampleData() {
    if (confirm('Add sample data to demonstrate the system? This will add sales, inventory updates, accounts, and deliveries.')) {
        // Sample Sales
        const sales = AppData.sales;
        sales.push(
            {
                company: "ABC Restaurant",
                product: "Premium Charcoal",
                quantity: 50,
                price_per_kg: 45.00,
                amount: 2250.00,
                payment_method: "Cash",
                date: new Date().toISOString()
            },
            {
                company: "XYZ Grill House",
                product: "BBQ Charcoal",
                quantity: 100,
                price_per_kg: 38.50,
                amount: 3850.00,
                payment_method: "Bank Transfer",
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                company: "Golden Dragon Hotel",
                product: "Restaurant Grade",
                quantity: 75,
                price_per_kg: 52.00,
                amount: 3900.00,
                payment_method: "Check",
                date: new Date(Date.now() - 172800000).toISOString()
            }
        );
        AppData.sales = sales;

        // Sample Accounts
        const accounts = AppData.accounts;
        accounts.push(
            {
                company: "Manila Charcoal Supplies",
                contact_person: "Pedro Santos",
                phone: "09123456789",
                payable: 15000.00,
                due_date: new Date(Date.now() + 604800000).toISOString().split('T')[0],
                category: "Supplies",
                status: "pending"
            },
            {
                company: "Metro Equipment Rental",
                contact_person: "Maria Cruz",
                phone: "09187654321",
                payable: 8500.00,
                due_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                category: "Equipment",
                status: "pending"
            }
        );
        AppData.accounts = accounts;

        // Sample Deliveries
        const deliveries = AppData.deliveries;
        deliveries.push(
            {
                company: "Savory Restaurant Chain",
                product: "Premium Charcoal",
                qty: 200,
                delivery_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                driver: "Juan Reyes",
                status: "Scheduled"
            },
            {
                company: "BBQ King",
                product: "BBQ Charcoal",
                qty: 150,
                delivery_date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
                driver: "Mario Santos",
                status: "Scheduled"
            }
        );
        AppData.deliveries = deliveries;

        // Sample Attendance
        const attendance = AppData.attendance;
        attendance.push(
            {
                employee: "Juan Dela Cruz - Manager",
                date: new Date().toISOString().split('T')[0],
                time_in: "08:00:00 AM",
                time_out: "05:00:00 PM",
                hours: "9.0"
            },
            {
                employee: "Maria Santos - Supervisor",
                date: new Date().toISOString().split('T')[0],
                time_in: "08:15:00 AM",
                time_out: null,
                hours: null
            }
        );
        AppData.attendance = attendance;

        showNotification('Sample data added successfully!', 'success');
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                window.location.href = 'index.html';
                break;
            case '2':
                e.preventDefault();
                window.location.href = 'sales.html';
                break;
            case '3':
                e.preventDefault();
                window.location.href = 'accounts.html';
                break;
            case '4':
                e.preventDefault();
                window.location.href = 'delivery.html';
                break;
            case '5':
                e.preventDefault();
                window.location.href = 'inventory.html';
                break;
            case '6':
                e.preventDefault();
                window.location.href = 'attendance.html';
                break;
            case '7':
                e.preventDefault();
                window.location.href = 'alerts.html';
                break;
        }
    }
});
// Highlight the active sidebar link based on the current page
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop(); // e.g., "sales.html"
    const navLinks = document.querySelectorAll("#sidebar ul li a");

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});


// Welcome message on first visit
if (!localStorage.getItem('camts_visited')) {
    setTimeout(() => {
        alert('Welcome to CAMTS POS System!\n\n✨ Try these features:\n• Add sample data to explore\n• Create sales, manage inventory\n• Track deliveries & attendance\n• Monitor system alerts\n\n💡 Tip: Use Ctrl+1-7 for quick navigation!');
        localStorage.setItem('camts_visited', 'true');
    }, 1000);
}

console.log('%c🔥 CAMTS POS System Ready!', 'color: #e74c3c; font-size: 20px; font-weight: bold;');
console.log('%c📌 Keyboard Shortcuts: Ctrl+1-7 for quick navigation', 'color: #3498db; font-size: 14px;');