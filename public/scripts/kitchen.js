const socket = io();
const kitchenRoot = document.getElementById('kitchen-dashboard');
const ordersTableBody = document.getElementById('orders-table-body');

if (kitchenRoot) {
    socket.emit('joinKitchen');
}

const parseStatuses = () => {
    if (!kitchenRoot?.dataset?.statusOptions) {
        return ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    }

    try {
        return JSON.parse(kitchenRoot.dataset.statusOptions);
    } catch (_error) {
        return ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
    }
};

const statuses = parseStatuses();

const buildStatusOptions = (currentStatus) => {
    return statuses
        .map((status) => `<option value="${status}" ${currentStatus === status ? 'selected' : ''}>${status}</option>`)
        .join('');
};

const upsertOrderRow = (order) => {
    if (!ordersTableBody || !order) return;

    const existingRow = ordersTableBody.querySelector(`tr[data-order-id="${order.id}"]`);
    const rowMarkup = `
        <tr data-order-id="${order.id}">
            <td>${order.orderNumber}</td>
            <td>${order.customerName}</td>
            <td>${order.itemsSummary || ''}</td>
            <td>$${Number(order.total || 0).toFixed(2)}</td>
            <td class="order-status">${order.status}</td>
            <td>
                <form method="POST" action="/kitchen/orders/${order.id}/status" class="inline-form">
                    <select name="status" required>
                        ${buildStatusOptions(order.status)}
                    </select>
                    <button type="submit" class="btn">Save</button>
                </form>
            </td>
        </tr>
    `;

    if (existingRow) {
        existingRow.outerHTML = rowMarkup;
    } else {
        ordersTableBody.insertAdjacentHTML('afterbegin', rowMarkup);
    }
};

socket.on('newOrder', (order) => {
    upsertOrderRow(order);
});

socket.on('orderStatusChanged', (payload) => {
    const row = ordersTableBody?.querySelector(`tr[data-order-id="${payload.orderId}"]`);
    if (!row) return;

    const statusCell = row.querySelector('.order-status');
    if (statusCell) {
        statusCell.textContent = payload.status;
    }

    const select = row.querySelector('select[name="status"]');
    if (select) {
        select.value = payload.status;
    }
});
