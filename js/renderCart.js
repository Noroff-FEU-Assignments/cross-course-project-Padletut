import * as Constants from './constants.js';
import { updateQuantity, removeFromCart, updateProductListCartButtons, updateCartItemCount, detail_updateAddToCartButtonState } from "./handlecart.js";
import { loadFromStorage } from "./storage/local.js";

// Function to render the shopping cart
export function renderShoppingCart(data, collapsibleCartContainer) {
    if (!Array.isArray(data) || !collapsibleCartContainer || typeof collapsibleCartContainer !== 'object') return;

    let shoppingCartTotal = 0;
    const shoppingCartStorage = loadFromStorage(Constants.cartKey) || [];

    // Clear existing content
    collapsibleCartContainer.innerHTML = '';

    // Add cart header
    const header = document.createElement('div');
    header.className = 'cart-sticky-header';
    header.innerHTML = `
        <button class="cart-close-button">X</button>
        <h2 id="cartTitle">Shopping Cart</h2>`;
    collapsibleCartContainer.appendChild(header);

    // Add cart items
    shoppingCartStorage.forEach(cartItem => {
        const product = data.find(item => item.id === cartItem.id);
        if (product) {
            const totalItemPrice = product.discountedPrice * cartItem.quantity;
            shoppingCartTotal += totalItemPrice;

            // Create cart item elements
            const itemLink = document.createElement('a');
            itemLink.href = `productdetail.html?id=${product.id}`;
            itemLink.className = 'collapsibleCartContainer-item-link';
            const itemDiv = document.createElement('div');
            itemDiv.className = 'collapsibleCartContainer-item';
            itemDiv.id = cartItem.id;
            itemDiv.setAttribute('data-id', cartItem.id);
            itemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="collapsibleCartContainer-image">
                <div class="collapsibleCartContainer-item-info">
                    <h2 class="collapsibleCartContainer-title">${product.title}</h2>
                    <span class="collapsibleCartContainer-price">$${totalItemPrice.toFixed(2)}</span>
                </div>`;

            itemLink.appendChild(itemDiv);
            collapsibleCartContainer.appendChild(itemLink);

            // Buttons container
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'collapsibleCartContainer-item-buttons';
            buttonsDiv.innerHTML = `
                <button class="collapsibleCartContainer-quantity-decrease" aria-label="Decrease quantity">-</button>
                <span class="collapsibleCartContainer-quantity-number">Qty ${cartItem.quantity}</span>
                <button class="collapsibleCartContainer-quantity-increase" aria-label="Increase quantity">+</button>
                <button class="collapsibleCartContainer-item-remove">Remove</button>`;

            // Attach event listeners to buttons
            buttonsDiv.querySelector('.collapsibleCartContainer-quantity-decrease').addEventListener('click', (event) => {
                updateQuantity(cartItem.id, -1, collapsibleCartContainer, Constants.checkoutContainer, data);
                event.stopPropagation();
            });

            buttonsDiv.querySelector('.collapsibleCartContainer-quantity-increase').addEventListener('click', (event) => {
                updateQuantity(cartItem.id, 1, collapsibleCartContainer, Constants.checkoutContainer, data);
                event.stopPropagation();
            });

            buttonsDiv.querySelector('.collapsibleCartContainer-item-remove').addEventListener('click', (event) => {
                removeFromCart(cartItem.id, collapsibleCartContainer, Constants.checkoutContainer, data);
                event.stopPropagation();
            });

            document.addEventListener('click', (event) => {
                if (event.target.matches('.cart-close-button')) {
                    // Close the cart
                    collapsibleCartContainer.style.right = '-100%';
                    event.preventDefault();
                }
            });

            collapsibleCartContainer.appendChild(buttonsDiv);
        }
    });

    updateProductListCartButtons(shoppingCartStorage);
    detail_updateAddToCartButtonState(shoppingCartStorage);
    updateCartItemCount(shoppingCartStorage.length);


    // Add cart footer
    const footer = document.createElement('div');
    footer.className = 'cart-sticky-footer';
    footer.innerHTML = `
        <h3>Total in cart: <span>$${shoppingCartTotal.toFixed(2)}</span></h3>
        <a href="checkout.html" class="checkout-button">Checkout</a>`;
    collapsibleCartContainer.appendChild(footer);
}