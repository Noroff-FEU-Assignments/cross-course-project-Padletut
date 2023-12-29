// togglecart.js
import { fetchProducts } from './fetch.js';
import { renderShoppingCart } from './cart.js';
import { cartKey } from './constants.js';
import { loadFromStorage } from './storage/local.js';

// Function to toggle cart visibility and refresh contents
export const toggleCartVisibility = (cartElement, collapsibleCartContainer, loaderContainer) => {
    const isCartVisible = cartElement.style.right === '0px';
    cartElement.style.right = isCartVisible ? '-100%' : '0px';

    // Refresh the cart if it is about to be shown
    if (!isCartVisible) {
        const cartData = loadFromStorage(cartKey) || [];
        fetchProducts(collapsibleCartContainer, loaderContainer, (data) => {
            // Ensure productContainer is a DOM element
            if (collapsibleCartContainer instanceof HTMLElement) {
                renderShoppingCart(data, cartData, collapsibleCartContainer);
            }
        });
    }
};

// Function to initialize the cart on page load if needed
export const initializeCart = async (collapsibleCartContainer, loaderContainer) => {
    const productsData = await fetchProducts(collapsibleCartContainer, loaderContainer, renderShoppingCart);
    return productsData;
};

// Function to close cart when clicking outside
export const closeCartOnClickOutside = (cartElement) => {
    document.addEventListener('click', function (event) {
        const isClickInsideCart = cartElement.contains(event.target);
        const isClickOnCartIcon = event.target.closest('.cart'); // Modify this selector to match your cart icon

        if (!isClickInsideCart && !isClickOnCartIcon) {
            cartElement.style.right = '-100%'; // Adjust this as per your cart's closing logic
        }
    });
};

