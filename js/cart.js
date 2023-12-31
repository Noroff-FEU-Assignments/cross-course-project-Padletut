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
    if (!Array.isArray(data) || !collapsibleCartContainer || typeof collapsibleCartContainer !== 'object') return;

    let shoppingCartTotal = 0;
    const shoppingCartStorage = loadFromStorage(cartKey) || [];

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
            const totalItemPrice = product.price * cartItem.quantity;
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
                updateQuantity(cartItem.id, -1, data, collapsibleCartContainer);
                event.stopPropagation();
            });

            buttonsDiv.querySelector('.collapsibleCartContainer-quantity-increase').addEventListener('click', (event) => {
                updateQuantity(cartItem.id, 1, data, collapsibleCartContainer);
                event.stopPropagation();
            });

            buttonsDiv.querySelector('.collapsibleCartContainer-item-remove').addEventListener('click', (event) => {
                removeFromCart(cartItem.id, collapsibleCartContainer, data);
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

    // Add cart footer
    const footer = document.createElement('div');
    footer.className = 'cart-sticky-footer';
    footer.innerHTML = `
        <h3>Total in cart: <span>$${shoppingCartTotal.toFixed(2)}</span></h3>
        <a href="checkout.html" class="checkout-button">Checkout</a>`;
    collapsibleCartContainer.appendChild(footer);
}


function updateProductListCartButtons(cartData) {
    const addToCartButtons = document.querySelectorAll('.products__item-button');

    addToCartButtons.forEach(button => {
        const productId = button.dataset.id;
        const isInCart = cartData.some(item => item.id === productId);

        button.textContent = isInCart ? 'In Cart' : 'Add to Cart';
        button.disabled = isInCart;
        button.classList.toggle('in-cart', isInCart);
        button.classList.toggle('add-to-cart-btn', !isInCart);
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
            updateProductListCartButtons(cartData);
            detail_updateAddToCartButtonState(cartData);
        }

        saveToStorage(cartKey, cartArray);
        renderShoppingCart(data, collapsibleCartContainer); // Re-render the cart to update the page
    }
}

const detail_updateAddToCartButtonState = (cartData) => {
    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    const addToCartButton = document.querySelector('.addToCart');
    if (!addToCartButton) return;
    const buttonText = addToCartButton.querySelector('span');
    const productInCart = cartData.some(item => item.id === id);

    addToCartButton.disabled = productInCart;
    if (productInCart) {
        addToCartButton.classList.add('in-cart');
        buttonText.textContent = 'In Cart';
    } else {
        addToCartButton.classList.remove('in-cart');
        buttonText.textContent = 'Add to Cart';
    }
};

// Function to remove an item from the cart
export function removeFromCart(id, collapsibleCartContainer, data) {
    const cartArray = loadFromStorage(cartKey) || [];
    const updatedCartArray = cartArray.filter(item => item.id !== id);

    saveToStorage(cartKey, updatedCartArray);
    renderShoppingCart(data, collapsibleCartContainer);
}


export function decrementQuantity(id, collapsibleCartContainer, data) {
    const cartArray = loadFromStorage(cartKey) || [];
    const index = cartArray.findIndex(item => item.id === id);

    if (index !== -1 && cartArray[index].quantity > 1) {
        cartArray[index].quantity -= 1;
        saveToStorage(cartKey, cartArray);
        renderShoppingCart(data, collapsibleCartContainer);
    }
}