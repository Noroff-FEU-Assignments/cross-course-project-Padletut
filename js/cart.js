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