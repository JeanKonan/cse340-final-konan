const socket = io();
const trackingRoot = document.getElementById('order-tracking');
const orderNumber = trackingRoot?.dataset?.orderNumber;

if (orderNumber) {
    socket.emit('joinOrder', orderNumber);
}

socket.on('statusUpdate', (data) => {
    if (data.orderNumber === orderNumber) {
        document.getElementById('current-status').textContent = data.status;

        const timeline = document.getElementById('timeline');
        const newItem = document.createElement('div');
        newItem.className = 'timeline-item';
        newItem.innerHTML = `<strong>${data.status}</strong> - ${new Date().toLocaleString()}`;
        timeline.insertBefore(newItem, timeline.firstChild);

        // Update status bar
        document.querySelectorAll('.status-step').forEach(step => {
            step.classList.remove('active');
        });
        if (data.status === 'Placed') document.querySelectorAll('.status-step')[0].classList.add('active');
        if (data.status === 'Preparing') document.querySelectorAll('.status-step')[1].classList.add('active');
        if (data.status === 'Out for Delivery') document.querySelectorAll('.status-step')[2].classList.add('active');
        if (data.status === 'Delivered') document.querySelectorAll('.status-step')[3].classList.add('active');
    }
});