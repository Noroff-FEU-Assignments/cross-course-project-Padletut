import * as Constants from "./constants.js";
import { cartKey } from "./constants.js";
import { loadFromStorage } from "./storage/local.js";
import { fetchProducts } from "./fetch.js";
import { goToTop } from "./gototop.js";
import { removeFromCart, updateQuantity } from "./handlecart.js";
import { renderShoppingCart } from "./renderCart.js";
import { toggleCartVisibility, initializeCart, closeCartOnClickOutside } from "./togglecart.js";

let checkoutTotal = 0;
let currency;
const rightBarContainer = document.querySelector('.right-bar-checkoutpage');
const leftBarContainer = document.querySelector('.left-bar-checkoutpage');

if (Constants.checkoutPage) {
  // Initialize the cart on page load
  document.addEventListener('headerLoaded', async () => {
    const cartIcon = document.querySelector('.cart');
    const collapsibleCart = document.getElementById('collapsible-cart');
    const loaderContainer = document.getElementById('loader');

    // Initialize the cart with products
    await initializeCart(collapsibleCart, loaderContainer);

    // Toggle cart visibility when the cart icon is clicked
    cartIcon.addEventListener('click', () => toggleCartVisibility(collapsibleCart));

    // Close cart when clicking outside
    closeCartOnClickOutside(collapsibleCart);
  });

  // Initialize the checkout page
  document.addEventListener('headerLoaded', async () => {
    const data = await fetchProducts(Constants.productContainer, Constants.loaderContainer);
    renderCheckout(data);
  });
}


export function renderCheckout(data) {
  const checkoutContainer = Constants.checkoutContainer;
  if (!Array.isArray(data) || !checkoutContainer || typeof checkoutContainer !== 'object') return;

  const checkoutStorage = loadFromStorage(cartKey) || [];

  // Clear the container first
  checkoutContainer.innerHTML = '';

  // Create the title
  const titleElement = document.createElement('h2');
  titleElement.textContent = 'Checkout';
  checkoutContainer.appendChild(titleElement);

  checkoutTotal = 0;

  checkoutStorage.forEach(cartItem => {
    const product = data.find(item => item.id === cartItem.id);
    let salePrice = parseFloat(product.prices.sale_price / 100).toFixed(2);
    currency = product.prices.currency_prefix;

    if (product) {
      const totalItemPrice = salePrice * cartItem.quantity;
      checkoutTotal += totalItemPrice;

      // Create checkout item container
      const checkoutItemDiv = document.createElement('div');
      checkoutItemDiv.className = 'left-bar__checkout';
      checkoutItemDiv.dataset.id = cartItem.id;

      // Populate the checkout item with product data
      checkoutItemDiv.innerHTML = `
        <figure class="left-bar__checkout-imageArea">
          <img src="${product.images[0].thumbnail}" alt="${product.name}">
        </figure>
        <div class="left-bar__checkout-textArea">
          <h3>${product.name}</h3>
          <span class="left-bar__price">${product.prices.currency_prefix} ${totalItemPrice.toFixed(2)}</span>
          <div class="left-bar__quantity">
            Quantity: 
          </div>
        </div>`;

      checkoutItemDiv.addEventListener('click', (event) => {
        if (event.target.closest('.quantity-selector') || event.target.closest('.left-bar__remove')) {
          event.preventDefault();
          return;
        }
        window.location.href = `productdetail.html?id=${product.id}`;
      });


      // Create quantity selector
      const quantitySelector = document.createElement('select');
      quantitySelector.dataset.id = cartItem.id;
      quantitySelector.className = 'quantity-selector';
      for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === cartItem.quantity) option.selected = true;
        quantitySelector.appendChild(option);
      }

      // Append the quantity selector to the checkout item
      checkoutItemDiv.querySelector('.left-bar__quantity').appendChild(quantitySelector);

      // Create remove button
      const removeButton = document.createElement('button');
      removeButton.className = 'left-bar__remove';
      removeButton.dataset.id = cartItem.id;
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        removeFromCart(cartItem.id, Constants.collapsibleCartContainer, checkoutContainer, data);
      });

      checkoutItemDiv.querySelector('.left-bar__checkout-textArea').appendChild(removeButton);
      checkoutContainer.appendChild(checkoutItemDiv);

      // Attach event listener for quantity change
      quantitySelector.addEventListener('change', (event) => {
        event.stopPropagation();
        const newQuantity = parseInt(event.target.value);
        updateQuantity(cartItem.id, newQuantity, Constants.collapsibleCartContainer, checkoutContainer, data, true);
      });
    }
  });

  // Create and append the checkout summary
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'checkout-summary';
  summaryDiv.innerHTML = `
    Items <span>${currency} ${checkoutTotal.toFixed(2)}</span>
    Shipping <span>${currency} 10.00</span>
    Tax <span>${currency} ${(checkoutTotal * 0.25).toFixed(2)}</span>
    Total <span>${currency} ${((checkoutTotal * 1.25) + 10).toFixed(2)}</span>
  `;
  checkoutContainer.appendChild(summaryDiv);

  // Checkout Now button
  const checkoutLabel = document.createElement('label');
  checkoutLabel.id = 'checkout-label';
  checkoutLabel.innerHTML = `
    <object data="/svg/creditcard.svg"></object>Checkout Now
  `;
  checkoutLabel.onclick = goToTop;
  checkoutContainer.appendChild(checkoutLabel);
}

if (Constants.checkoutContainer) {
  Constants.checkoutContainer.querySelectorAll('.quantity-selector').forEach(selector => {
    selector.addEventListener('change', (event) => {
      const id = event.target.getAttribute('data-id');
      const newQuantity = parseInt(event.target.value);
      updateQuantity(id, newQuantity);
    });
  });
}


document.onclick = function (event) {

  if (event.target.matches('#checkout-label')) {
    leftBarContainer.style.display = "none";
    rightBarContainer.style.display = "flex";
    goToTop();
  }
}

const placeOrderButton = document.getElementById('submit-label');

if (placeOrderButton) {
  placeOrderButton.addEventListener('click', function () {
    // Clear cart from local storage
    localStorage.removeItem(Constants.cartKey);
    renderShoppingCart(Constants.collapsibleCartContainer, Constants.cartKey);
  });
}