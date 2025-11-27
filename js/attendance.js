// attendance.js - Attendance page functionality

let currentEmployee = null;

// Employee selection
document.getElementById('employeeSelect').addEventListener('change', function() {
    const timeInBtn = document.getElementById('timeInBtn');
    const timeOutBtn = document.getElementById('timeOutBtn');
    const statusText = document.getElementById('statusText');
    
    if (this.value) {
        currentEmployee = this.options[this.selectedIndex].text;
        statusText.innerHTML = '<span style="color:#e74c3c;">Clocked Out</span>';
        timeInBtn.disabled = false;
        timeOutBtn.disabled = false;
    } else {
        currentEmployee = null;
        statusText.textContent = 'Please select an employee';
        timeInBtn.disabled = true;
        timeOutBtn.disabled = true;
    }
});

// Time In
function timeIn() {
    if (!currentEmployee) return;
    
    if (confirm('Clock in now for ' + currentEmployee + '?')) {
        const now = new Date();
        const attendance = AppData.attendance;
        
        attendance.unshift({
            employee: currentEmployee,
            date: now.toISOString().split('T')[0],
            time_in: now.toLocaleTimeString(),
            time_out: null,
            hours: null
        });
        
        AppData.attendance = attendance;
        renderAttendanceTable();
        showNotification('Time in recorded successfully!', 'success');
    }
}

// Time Out
function timeOut() {
    if (!currentEmployee) return;
    
    if (confirm('Clock out now for ' + currentEmployee + '?')) {
        const now = new Date();
        const attendance = AppData.attendance;
        
        // Find today's record for this employee
        const todayRecord = attendance.find(a => 
            a.employee === currentEmployee && 
            a.date === now.toISOString().split('T')[0] &&
            !a.time_out
        );
        
        if (todayRecord) {
            todayRecord.time_out = now.toLocaleTimeString();
            todayRecord.hours = '8.0'; // Simplified calculation
            AppData.attendance = attendance;
            renderAttendanceTable();
            showNotification('Time out recorded successfully!', 'success');
        } else {
            showNotification('No time-in record found for today!', 'error');
        }
    }
}

// Render attendance table
function renderAttendanceTable() {
    const tbody = document.getElementById('attendanceTableBody');
    const attendance = AppData.attendance;
    
    if (attendance.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">No attendance records found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = attendance.map(a => `
        <tr>
            <td>${a.date}</td>
            <td>${a.employee}</td>
            <td>${a.time_in || '-'}</td>
            <td>${a.time_out || '-'}</td>
            <td class="hours">${a.hours ? a.hours + 'h' : '-'}</td>
            <td>
                ${a.time_out 
                    ? '<span class="status-complete">Complete</span>' 
                    : '<span class="status-progress">In Progress</span>'}
            </td>
        </tr>
    `).join('');
}

// Initialize
renderAttendanceTable();