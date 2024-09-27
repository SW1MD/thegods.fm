document.addEventListener('DOMContentLoaded', function() {
    const confirmationMessage = document.getElementById('confirmationMessage');
    const priceElement = document.getElementById('price');
    const totalPriceElement = document.getElementById('total-price');
    const quantitySelect = document.getElementById('quantity');
    let basePrice = 99.99;
    let currentQuantity = 1;

    function updatePrice(newPrice) {
        basePrice = parseFloat(newPrice);
        priceElement.textContent = `$${basePrice.toFixed(2)}`;
        updateTotalPrice();
    }

    function updateTotalPrice() {
        const total = basePrice * currentQuantity;
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
        // If PayPal buttons are already rendered, we need to re-render them
        document.querySelector('#paypal-button-container').innerHTML = '';
        renderPayPalButtons();
    }

    function renderPayPalButtons() {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: (basePrice * currentQuantity).toFixed(2)
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    confirmationMessage.classList.remove('d-none');
                    window.scrollTo(0, document.body.scrollHeight);
                });
            }
        }).render('#paypal-button-container');
    }

    // Initial render of PayPal buttons
    renderPayPalButtons();

    // Event listener for quantity changes
    quantitySelect.addEventListener('change', function(event) {
        currentQuantity = parseInt(event.target.value);
        updateTotalPrice();
    });

    // Function to detect and apply color scheme
    function applyColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Apply color scheme on load
    applyColorScheme();

    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyColorScheme);

    // Example of how to update the base price (you can call this function whenever you need to change the price)
    // updatePrice('149.99');
});