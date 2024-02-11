import * as Constants from './constants.js';
import { loadFromStorage, saveToStorage } from './storage/local.js';
import { renderShoppingCart } from "./renderCart.js";
import { renderCheckout } from "./checkout.js";
import { fetchProducts } from "./fetch.js";

// Function to add an item to the shopping cart
export function addToShoppingCart(id) {
    const cartArray = loadFromStorage(Constants.cartKey) || [];
    const existingItemIndex = cartArray.findIndex(item => item.id === id);

    if (existingItemIndex !== -1) {
        cartArray[existingItemIndex].quantity += 1;
    } else {
        const newItem = { id, quantity: 1 };
        cartArray.push(newItem);
    }

    saveToStorage(Constants.cartKey, cartArray);

    // Re-render the shopping cart to reflect the changes
    fetchProducts(Constants.collapsibleCartContainer, Constants.loaderContainer, renderShoppingCart);
    // renderShoppingCart(data);
}

// Function to update the quantity of a cart item
export function updateQuantity(id, change, collapsibleCartContainer, checkoutContainer, data, isAbsolute = false) {
    const cartArray = loadFromStorage(Constants.cartKey) || [];
    const itemIndex = cartArray.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        // If the change is absolute, set the quantity to that value
        // Otherwise, treat it as a relative change
        cartArray[itemIndex].quantity = isAbsolute ? change : cartArray[itemIndex].quantity + change;

        if (cartArray[itemIndex].quantity <= 0) {
            cartArray.splice(itemIndex, 1);
            // Update the UI elements related to the cart
            const cartData = loadFromStorage(Constants.cartKey) || [];
            //  updateProductListCartButtons(cartData);

            // Call the functions to update the quantity selector
            updateQuantitySelector(cartData, cartArray[itemIndex]?.quantity);
        } else {
            if (cartArray[itemIndex].quantity > 10) {
                cartArray[itemIndex].quantity = 10;
            }
            // Save the updated cart array to storage
            saveToStorage(Constants.cartKey, cartArray);
        }

        // Re-render the cart and checkout with the updated data
        renderShoppingCart(data, collapsibleCartContainer);
        if (checkoutContainer) renderCheckout(data, checkoutContainer);
    }
}


// Function to remove an item from the cart
export function removeFromCart(id, collapsibleCartContainer, checkoutContainer, data) {
    const cartArray = loadFromStorage(Constants.cartKey) || [];
    const updatedCartArray = cartArray.filter(item => item.id !== id);
    saveToStorage(Constants.cartKey, updatedCartArray);

    // Update the "Add to Cart" buttons
    updateProductListCartButtons(updatedCartArray);
    if (document.location.search) {
        detail_updateAddToCartButtonState(updatedCartArray);
    }

    renderShoppingCart(data, collapsibleCartContainer);
    if (checkoutContainer) renderCheckout(data, checkoutContainer);
}

export function updateCartItemCount(count) {
    const cartItemCount = document.querySelector('.cart-item-count');
    const cartItemCountMobile = document.querySelector('.cart-item-count-mobile');
    if (count > 0) {
        cartItemCount.textContent = count;
        cartItemCount.style.visibility = 'visible';
        cartItemCount.style.animation = 'none';
        setTimeout(() => {
            cartItemCount.style.animation = '';
        }, 10);
        cartItemCountMobile.textContent = count;
        cartItemCountMobile.style.visibility = 'visible';
        cartItemCountMobile.style.animation = 'none';
        setTimeout(() => {
            cartItemCountMobile.style.animation = '';
        }, 10);
    } else {
        cartItemCount.style.visibility = 'hidden';
        cartItemCountMobile.style.visibility = 'hidden';
    }
}

// Function to update the add to cart button state on the product list page
export function updateProductListCartButtons(cartData) {

    const addToCartButtons = document.querySelectorAll('.products__item-button');
    addToCartButtons.forEach(button => {
        const productId = Number(button.dataset.id);
        const isInCart = cartData.some(item => item.id === productId);

        if (button.classList.contains('buy-now-btn')) return;
        button.textContent = isInCart ? 'In Cart' : 'Add to Cart';
        button.disabled = isInCart;
        button.classList.toggle('in-cart', isInCart);
        button.classList.toggle('add-to-cart-btn', !isInCart);
    });
}

function updateQuantitySelector(cartData, quantity) {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    quantitySelectors.forEach(selector => {
        if (selector.dataset.id === cartData.id) {
            selector.value = quantity;
        }
    });
}

// Function to update the add to cart button state on the product detail page
export const detail_updateAddToCartButtonState = (cartData) => {

    const queryString = document.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    // convert id string to boolean
    const addToCartButton = document.querySelector('.addToCart');
    if (!addToCartButton) return;
    const buttonText = addToCartButton.querySelector('span');
    const productInCart = cartData.some(item => item.id === Number(id));
    addToCartButton.disabled = productInCart;
    addToCartButton.classList.toggle('in-cart', productInCart);
    buttonText.textContent = productInCart ? 'In Cart' : 'Add to Cart';
}