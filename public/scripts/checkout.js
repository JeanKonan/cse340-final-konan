const pickupCheckbox = document.getElementById('pickup');
const deliveryFields = document.getElementById('delivery-address-fields');
const deliveryNote = document.getElementById('delivery-note');
const deliveryInputs = deliveryFields.querySelectorAll('input[name="street"], input[name="city"], input[name="state"], input[name="zip"]');
const subtotalAmount = document.getElementById('subtotal-amount');
const taxAmount = document.getElementById('tax-amount');
const deliveryFeeAmount = document.getElementById('delivery-fee-amount');
const totalAmount = document.getElementById('total-amount');

const STANDARD_DELIVERY_FEE = 4.99;

function toMoneyValue(element) {
    return Number.parseFloat(element?.textContent || '0') || 0;
}

function formatMoney(value) {
    return value.toFixed(2);
}

function toggleDeliveryFields() {
    const isPickup = pickupCheckbox.checked;
    const subtotal = toMoneyValue(subtotalAmount);
    const tax = toMoneyValue(taxAmount);
    const currentDeliveryFee = isPickup ? 0 : STANDARD_DELIVERY_FEE;
    const total = subtotal + tax + currentDeliveryFee;

    deliveryFields.style.display = isPickup ? 'none' : '';
    deliveryNote.textContent = isPickup
        ? 'Pickup selected. No address information needed.'
        : 'Delivery selected. Please provide your address.';

    deliveryFeeAmount.textContent = formatMoney(currentDeliveryFee);
    totalAmount.textContent = formatMoney(total);

    deliveryInputs.forEach((input) => {
        input.required = !isPickup;
    });
}

if (pickupCheckbox && deliveryFields && deliveryNote && deliveryFeeAmount && totalAmount) {
    pickupCheckbox.addEventListener('change', toggleDeliveryFields);
    toggleDeliveryFields();
}