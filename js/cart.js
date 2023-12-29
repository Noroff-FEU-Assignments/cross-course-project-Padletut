import { cartKey } from "./constants.js";
import { loadFromStorage, saveToStorage } from "./storage/local.js";


// Function to add an item to the shopping cart
export function addToShoppingCart(id, data, collapsibleCartContainer) {
    const cartArray = loadFromStorage(cartKey) || [];
    const existingItemIndex = cartArray.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
        cartArray[existingItemIndex].quantity += 1;
    } else {
        const newItem = { id, quantity: 1 };
        cartArray.push(newItem);
    }

    saveToStorage(cartKey, cartArray);

    // Re-render the shopping cart to reflect the changes
    renderShoppingCart(data, collapsibleCartContainer);
}

// Function to render the shopping cart
export function renderShoppingCart(data, collapsibleCartContainer) {
    if (!Array.isArray(data) || !collapsibleCartContainer || typeof collapsibleCartContainer !== 'object') return; // Ensure data is an array and container is defined and an object

    let shoppingCartTotal = 0;
    const shoppingCartStorage = loadFromStorage(cartKey) || [];

    collapsibleCartContainer.innerHTML = `<div class="cart-sticky-header">
                                            <button class="cart-close-button">X</button>
                                            <h2 id="cartTitle">Shopping Cart</h2>
                                          </div>
                                          `;


    shoppingCartStorage.forEach(cartItem => {
        const product = data.find(item => item.id === cartItem.id);
        if (product) {
            const totalItemPrice = product.price * cartItem.quantity;
            shoppingCartTotal += totalItemPrice;

            collapsibleCartContainer.innerHTML += `
                                                <div class="collapsibleCartContainer-item" id="${cartItem.id}" data-id="${cartItem.id}">
                                                    <img src="${product.image}" alt="${product.title}" class="collapsibleCartContainer-image">
                                                    <div class="collapsibleCartContainer-item-info">
                                                        <h2 class="collapsibleCartContainer-title">${product.title}</h2>
                                                        <span class="collapsibleCartContainer-price">$${totalItemPrice.toFixed(2)}</span>
                                                        <div class="collapsibleCartContainer-quantity">
                                                            <button class="collapsibleCartContainer-quantity-decrease" aria-label="Decrease quantity">-</button>
                                                            <span class="collapsibleCartContainer-quantity-number">Qty ${cartItem.quantity}</span>
                                                            <button class="collapsibleCartContainer-quantity-increase" aria-label="Increase quantity">+</button>
                                                        </div>
                                                        <button class="collapsibleCartContainer-item-remove">Remove</button>
                                                    </div>
                                                </div>`;
        }
    });

    collapsibleCartContainer.innerHTML += `<div class="cart-sticky-footer">
                                              <h3>Total in cart: <span>$${shoppingCartTotal.toFixed(2)}</span></h3>
                                              <a href="checkout.html" class="checkout-button">Checkout</a>
                                           </div>`;


    const cartData = loadFromStorage(cartKey) || [];
    const closeButton = collapsibleCartContainer.querySelector('.cart-close-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            collapsibleCartContainer.style.right = '-100%'; // Or your logic to hide the cart
        });
    }
    updateAddToCartButtons(cartData);
    attachCartEventListeners(collapsibleCartContainer, data);
}

function updateAddToCartButtons(cartData) {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        const productId = button.dataset.id;
        const isInCart = cartData.some(item => item.id === productId);

        button.textContent = isInCart ? 'In Cart' : 'Add to Cart';
        button.disabled = isInCart;
        button.classList.toggle('in-cart', isInCart);
    });
}



// Function to attach event listeners to cart items
function attachCartEventListeners(collapsibleCartContainer, data) {
    const cartItems = collapsibleCartContainer.querySelectorAll('.collapsibleCartContainer-item');

    cartItems.forEach(item => {
        item.querySelector('.collapsibleCartContainer-quantity-decrease').addEventListener('click', () => {
            updateQuantity(item.getAttribute('data-id'), -1, data, collapsibleCartContainer);
            event.stopPropagation();
        });

        item.querySelector('.collapsibleCartContainer-quantity-increase').addEventListener('click', () => {
            updateQuantity(item.getAttribute('data-id'), 1, data, collapsibleCartContainer);
            event.stopPropagation();
        });

        item.querySelector('.collapsibleCartContainer-item-remove').addEventListener('click', () => {
            removeFromCart(item.getAttribute('data-id'), collapsibleCartContainer, data);
            event.stopPropagation();
        });
    });
}

// Function to update the quantity of a cart item
function updateQuantity(id, change, data, collapsibleCartContainer) {
    const cartArray = loadFromStorage(cartKey) || [];
    const itemIndex = cartArray.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        cartArray[itemIndex].quantity += change;

        if (cartArray[itemIndex].quantity <= 0) {
            cartArray.splice(itemIndex, 1); // Remove the item if quantity is 0 or less
            const cartData = loadFromStorage(cartKey) || [];
            updateAddToCartButtons(cartData);
        }

        saveToStorage(cartKey, cartArray);
        renderShoppingCart(data, collapsibleCartContainer); // Re-render the cart to update the page
    }
}

// Function to remove an item from the cart
export function removeFromCart(id, collapsibleCartContainer, data) {
    const cartArray = loadFromStorage(cartKey) || [];
    // Filter out the item with the matching id
    const updatedCartArray = cartArray.filter(item => item.id !== id);

    // Save the updated cart back to storage
    saveToStorage(cartKey, updatedCartArray);
    // Re-render the cart to update the page
    const cartData = loadFromStorage(cartKey) || [];
    updateAddToCartButtons(cartData);
    renderShoppingCart(data, collapsibleCartContainer);
}

export function decrementQuantity(id, collapsibleCartContainer, data) {
    const cartArray = loadFromStorage(cartKey) || [];
    const index = cartArray.findIndex(item => item.id === id);

    if (index !== -1 && cartArray[index].quantity > 1) {
        cartArray[index].quantity -= 1;
        saveToStorage(cartKey, cartArray);
        const cartData = loadFromStorage(cartKey) || [];
        updateAddToCartButtons(cartData);
        renderShoppingCart(data, collapsibleCartContainer);
    }
}