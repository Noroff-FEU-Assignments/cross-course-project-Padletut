import { cartKey } from "./constants.js";
import { loadFromStorage, saveToStorage } from "./storage/local.js";
import { fetchProducts } from "./fetch.js";


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


function removeFromCheckout(event, key, data, checkoutStorage) {

  const checkoutItemElement = event.target.closest(".left-bar__remove");

  if (!checkoutItemElement) return;

  const checkoutItemId = checkoutItemElement.id;

  const checkoutItemToRemove = checkoutStorage.indexOf(checkoutItemId);
  if (checkoutItemToRemove !== -1) {
    checkoutStorage.splice(checkoutItemToRemove, 1);
    saveToStorage(key, checkoutStorage);

    checkoutContainer.innerHTML = "";
    checkoutTotal = 0;
    renderCheckout(data, checkoutStorage);
  }
}


function renderCheckout(data, checkoutStorage) {


  if (!checkoutStorage) return;

  checkoutTotal = 0;


  for (const checkoutItemId of checkoutStorage) {

    const product = data.find(item => item.id === checkoutItemId);

    if (product) {
      checkoutTotal += product.price;
      checkoutContainer.innerHTML += `<div class="left-bar__checkout">
            <figure class="left-bar__checkout-imageArea">
              <img src="${product.image}" alt="${product.title}">
            </figure>
            <div class="left-bar__checkout-textArea">
              <h3>${product.title}</h3>
              <span class="left-bar__price">$${product.price}</span>
              <div class="left-bar__quantity">
                <label for="${product.id}">Quantity</label>
                <select name="quantity" class="quantity" id="${product.id}">
                  <option value="1pcs">1 pcs</option>
                  <option value="2pcs">2 pcs</option>
                  <option value="3pcs">3 pcs</option>
                  <option value="4pcs">4 pcs</option>
                  <option value="5pcs">5 pcs</option>
                  <option value="6pcs">6 pcs</option>
                </select>
              </div>
              <div class="left-bar__remove" id="${checkoutItemId}">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12.082 2.8562V3.61898H15.8959V5.14455H15.1332V15.0607C15.1332 15.8998 14.4466 16.5863 13.6076 16.5863H5.97976C5.14069 16.5863 4.45419 15.8998 4.45419 15.0607V5.14455H3.69141V3.61898H7.50532V2.8562H12.082ZM5.97976 15.0607H13.6076V5.14455H5.97976V15.0607ZM7.50532 6.67012H9.03089V13.5352H7.50532V6.67012ZM12.082 6.67012H10.5565V13.5352H12.082V6.67012Z"
                    fill="#001F27" />
                </svg>
                <span>Remove from cart</span>
              </div>
            </div>
          </div>`;
    }
  }
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
                                    </div>`;

  addRemoveEventListeners(checkoutStorage);
}

function addRemoveEventListeners(checkoutStorage) {
  const removeButtons = document.querySelectorAll(".left-bar__remove");
  removeButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      removeFromCheckout(event, cartKey, globalData, checkoutStorage);
    });
  });
}
