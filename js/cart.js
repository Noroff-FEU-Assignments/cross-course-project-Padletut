import { cartKey } from "./constants.js";
import { loadFromStorage, saveToStorage } from "./storage/local.js";

const queryString = document.location.search;
const cartContainer = document.querySelector(".right-bar__cart");

export function addToShoppingCart(id) {
    let cartArray = loadFromStorage(cartKey);

    if (cartArray === null) {
        cartArray = [];
    }

    cartArray.push(id);
    saveToStorage(cartKey, cartArray);
}

export function removeFromCart(event, cartKey, data, shoppingCartContainer) {

    const shoppingCartItemElement = event.target.closest(".right-bar__cart");


    if (!shoppingCartItemElement) return;

    const shoppingCartStorage = loadFromStorage(cartKey);
    const shoppingCartItemId = shoppingCartItemElement.id;

    const shoppingCartItemToRemove = shoppingCartStorage.indexOf(shoppingCartItemId);
    if (shoppingCartItemToRemove !== -1) {
        shoppingCartStorage.splice(shoppingCartItemToRemove, 1);
        saveToStorage(cartKey, shoppingCartStorage);
        renderShoppingCart(data, shoppingCartContainer);
    }
}

export function renderShoppingCart(data, shoppingCartContainer) {

    let shoppingCartTotal = 0;
    const shoppingCartStorage = loadFromStorage(cartKey);

    shoppingCartContainer.innerHTML = "";
    shoppingCartTotal = 0;

    shoppingCartContainer.innerHTML = `<h2>My Cart</h2>`;


    if (!shoppingCartStorage) return;

    shoppingCartTotal = 0;

    for (const shoppingCartItemId of shoppingCartStorage) {

        const product = data.find(item => item.id === shoppingCartItemId);


        if (product) {
            shoppingCartTotal += product.price;

            shoppingCartContainer.innerHTML += `<div class="right-bar__cart" id="${shoppingCartItemId}">
                <figure class="right-bar__cart-imageArea">
                    <img src="${product.image}" alt="${product.title}">
                </figure>
                <div class="right-bar__cart-textArea">
                    <h3>${product.title}</h3>
                    <span>$${product.price}</span>
                </div>
            </div>`;
        }

    }
    shoppingCartContainer.innerHTML += `<h3>Total in cart: <span>$${shoppingCartTotal.toFixed(2)}</span></h3>`;

    return shoppingCartContainer;

}

