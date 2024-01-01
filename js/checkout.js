import { cartKey } from "./constants.js";
import { loadFromStorage, saveToStorage } from "./storage/local.js";
import { fetchProducts } from "./fetch.js";
import { goToTop } from "./gototop.js";


let checkoutTotal = 0;
let globalData;

const checkoutContainer = document.querySelector(".left-bar-checkoutpage");


fetchProducts(checkoutContainer, undefined, renderCheckout)

  .then(data => {
    const checkoutStorage = loadFromStorage(cartKey);
    globalData = data;
    renderCheckout(data, checkoutStorage);
  })
  .catch(error => {
    console.error(error);
  });


function removeFromCheckout(productId, data, checkoutStorage) {

  // Remove the item with the matching productId
  checkoutStorage = checkoutStorage.filter(item => item.id !== productId);
  saveToStorage(cartKey, checkoutStorage);

  // Re-render the checkout page
  renderCheckout(data, checkoutStorage);
}

function renderCheckout(data, checkoutStorage) {
  if (!checkoutStorage) return;

  checkoutContainer.innerHTML = "<h2>Checkout</h2>";
  checkoutTotal = 0;

  checkoutStorage.forEach(cartItem => {
    const product = data.find(item => item.id === cartItem.id);
    if (product) {
      const totalItemPrice = product.price * cartItem.quantity;
      checkoutTotal += totalItemPrice;

      // Create quantity selector HTML string
      let quantitySelectorHTML = `<select data-id="${cartItem.id}" class="quantity-selector">`;
      for (let i = 1; i <= 10; i++) {
        quantitySelectorHTML += `<option value="${i}" ${i === cartItem.quantity ? 'selected' : ''}>${i}</option>`;
      }
      quantitySelectorHTML += `</select>`;

      checkoutContainer.innerHTML += `<div class="left-bar__checkout" data-id="${cartItem.id}">
          <figure class="left-bar__checkout-imageArea">
            <img src="${product.image}" alt="${product.title}">
          </figure>
          <div class="left-bar__checkout-textArea">
            <h3>${product.title}</h3>
            <span class="left-bar__price">$${totalItemPrice.toFixed(2)}</span>
            <div class="left-bar__quantity">
              Quantity: ${quantitySelectorHTML}
            </div>
            <button class="left-bar__remove" data-id="${cartItem.id}">Remove</button>
          </div>
        </div>`;
    }
  });

  checkoutContainer.innerHTML += `<div class="checkout-summary">
                          Items
                          <span>$ ${checkoutTotal.toFixed(2)}</span>
                          Shipping
                          <span>$ 10.00</span>
                          Tax
                          <span>$ ${(checkoutTotal * (25 / 100)).toFixed(2)}</span>
                          <span class="checkout-summary__total">
                          Total
                          </span>
                          <span>$ ${((checkoutTotal * 1.25) + 10).toFixed(2)}</span>
                    </div>
                    <label for="checkoutnow" id="checkout-label" onclick="goToTop()">
                    <object data="/svg/creditcard.svg"></object>Checkout Now</label>`;

  addRemoveEventListeners(checkoutStorage);
  addQuantityChangeListeners(checkoutStorage, data);
}

function addQuantityChangeListeners(checkoutStorage, data) {
  document.querySelectorAll('.quantity-selector').forEach(selector => {
    selector.addEventListener('change', (event) => {
      const id = event.target.getAttribute('data-id');
      const newQuantity = parseInt(event.target.value);
      updateCartItemQuantity(id, newQuantity, checkoutStorage, data);
    });
  });
}

function updateCartItemQuantity(productId, newQuantity, checkoutStorage, data) {
  const productIndex = checkoutStorage.findIndex(item => item.id === productId);
  if (productIndex !== -1) {
    checkoutStorage[productIndex].quantity = newQuantity;
    saveToStorage(cartKey, checkoutStorage);
    renderCheckout(data, checkoutStorage);
  }
}


function addRemoveEventListeners(checkoutStorage) {
  document.querySelectorAll(".left-bar__remove").forEach(button => {
    button.addEventListener("click", event => {
      const idToRemove = event.target.closest('.left-bar__checkout').dataset.id;
      removeFromCheckout(idToRemove, globalData, checkoutStorage);
    });
  });
}

document.onclick = function (event) {
  if (event.target.matches('#checkoutnow')) {
    goToTop();
  }
}