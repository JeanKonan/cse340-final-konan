import OrderModel from '../models/order.js';

export function startOrderSimulation(io, orderId, orderNumber) {
    const statuses = ['Preparing', 'Out for Delivery', 'Delivered'];
    let currentIndex = 0;

    const interval = setInterval(async () => {
        if (currentIndex >= statuses.length) {
            clearInterval(interval);
            return;
        }

        const newStatus = statuses[currentIndex];
        await OrderModel.updateOrderStatus(orderId, newStatus);

        io.to(`order_${orderNumber}`).emit('statusUpdate', {
            orderNumber,
            status: newStatus
        });

        console.log(`Order ${orderNumber} -> ${newStatus}`);
        currentIndex++;
    }, 30000); // Update every 30 seconds for demo
}