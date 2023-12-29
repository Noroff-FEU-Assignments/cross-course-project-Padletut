import { cartKey } from "./constants.js";
import { loadFromStorage, saveToStorage } from "./storage/local.js";


// Function to add an item to the shopping cart
export function addToShoppingCart(id, data, shoppingCartContainer) {
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
    renderShoppingCart(data, shoppingCartContainer);
}

// Function to render the shopping cart
export function renderShoppingCart(data, shoppingCartContainer) {
    if (!Array.isArray(data) || !shoppingCartContainer || typeof shoppingCartContainer !== 'object') return; // Ensure data is an array and container is defined and an object

    let shoppingCartTotal = 0;
    const shoppingCartStorage = loadFromStorage(cartKey) || [];

    shoppingCartContainer.innerHTML = "<h2>My Cart</h2>";

    shoppingCartStorage.forEach(cartItem => {
        const product = data.find(item => item.id === cartItem.id);
        if (product) {
            const totalItemPrice = product.price * cartItem.quantity;
            shoppingCartTotal += totalItemPrice;

            shoppingCartContainer.innerHTML += `
                                                <div class="right-bar__cart-item" id="${cartItem.id}" data-id="${cartItem.id}">
                                                    <img src="${product.image}" alt="${product.title}" class="right-bar__cart-item-image">
                                                    <div class="right-bar__cart-item-info">
                                                        <h3 class="right-bar__cart-item-title">${product.title}</h3>
                                                        <span class="right-bar__cart-item-price">$${totalItemPrice.toFixed(2)}</span>
                                                        <div class="right-bar__cart-item-quantity">
                                                            <button class="right-bar__cart-quantity-decrease" aria-label="Decrease quantity">-</button>
                                                            <span class="right-bar__cart-quantity-number">Qty ${cartItem.quantity}</span>
                                                            <button class="right-bar__cart-quantity-increase" aria-label="Increase quantity">+</button>
                                                        </div>
                                                        <button class="right-bar__cart-item-remove">Remove</button>
                                                    </div>
                                                </div>`;
        }
    });

    shoppingCartContainer.innerHTML += `<h3>Total in cart: <span>$${shoppingCartTotal.toFixed(2)}</span></h3>
                                        <a href="checkout.html" class="checkout-button">Checkout</a>`;

    const cartData = loadFromStorage(cartKey) || [];
    updateAddToCartButtons(cartData);
    attachCartEventListeners(shoppingCartContainer, data);
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
function attachCartEventListeners(shoppingCartContainer, data) {
    const cartItems = shoppingCartContainer.querySelectorAll('.right-bar__cart-item');

    cartItems.forEach(item => {
        item.querySelector('.right-bar__cart-quantity-decrease').addEventListener('click', () => {
            updateQuantity(item.getAttribute('data-id'), -1, data, shoppingCartContainer);
        });

        item.querySelector('.right-bar__cart-quantity-increase').addEventListener('click', () => {
            updateQuantity(item.getAttribute('data-id'), 1, data, shoppingCartContainer);
        });

        item.querySelector('.right-bar__cart-item-remove').addEventListener('click', () => {
            removeFromCart(item.getAttribute('data-id'), shoppingCartContainer, data);
        });
    });
}

// Function to update the quantity of a cart item
function updateQuantity(id, change, data, shoppingCartContainer) {
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
        renderShoppingCart(data, shoppingCartContainer); // Re-render the cart to update the page
    }
}

// Function to remove an item from the cart
export function removeFromCart(id, shoppingCartContainer, data) {
    const cartArray = loadFromStorage(cartKey) || [];
    // Filter out the item with the matching id
    const updatedCartArray = cartArray.filter(item => item.id !== id);

    // Save the updated cart back to storage
    saveToStorage(cartKey, updatedCartArray);
    // Re-render the cart to update the page
    const cartData = loadFromStorage(cartKey) || [];
    updateAddToCartButtons(cartData);
    renderShoppingCart(data, shoppingCartContainer);
}

export function decrementQuantity(id, shoppingCartContainer, data) {
    const cartArray = loadFromStorage(cartKey) || [];
    const index = cartArray.findIndex(item => item.id === id);

    if (index !== -1 && cartArray[index].quantity > 1) {
        cartArray[index].quantity -= 1;
        saveToStorage(cartKey, cartArray);
        const cartData = loadFromStorage(cartKey) || [];
        updateAddToCartButtons(cartData);
        renderShoppingCart(data, shoppingCartContainer);
    }
}