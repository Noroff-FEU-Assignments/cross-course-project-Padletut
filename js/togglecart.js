import { fetchProducts } from './fetch.js';
import { renderShoppingCart } from './renderCart.js';

// Function to initialize the cart on page load if needed

export const initializeCart = async (collapsibleCartContainer, loaderContainer) => {
    try {
        const productsData = await fetchProducts(collapsibleCartContainer, loaderContainer);
        renderShoppingCart(productsData);
        if (loaderContainer) {
            loaderContainer.style.display = "none";
        }
        return productsData;
    } catch (error) {
        console.error('Error initializing cart:', error);
    }
};

// Function to toggle cart visibility and refresh contents
export const toggleCartVisibility = (cartElement) => {
    const isCartVisible = cartElement.style.right === '0px';
    cartElement.style.right = isCartVisible ? '-100%' : '0px';
};

// Function to close cart when clicking outside
export const closeCartOnClickOutside = (cartElement) => {
    document.addEventListener('click', function (event) {
        const isClickInsideCart = cartElement.contains(event.target);
        const isClickOnCartIcon = event.target.closest('.cart');

        if (!isClickInsideCart && !isClickOnCartIcon) {
            cartElement.style.right = '-100%';
        }
    });
};

