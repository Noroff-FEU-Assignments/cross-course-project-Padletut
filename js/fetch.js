//import { renderShoppingCart } from "./script.js";
import { saveToStorage } from "./storage/local.js";
import { idKey } from "./constants.js";

export async function fetchProducts(productContainer, loaderContainer, renderFunction) {

    const url = "https://api.noroff.dev/api/v1/rainy-days";
    let globalData;

    try {
        const response = await fetch(url);

        if (response.status === 404) {
            productContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        }

        const data = await response.json();
        globalData = data;

        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer[1].style.display = "none";
        }

        const productList = [];

        for (let i = 0; i < data.length; i++) {

            productList.push(data[i].id);
        }
        renderFunction(data);
        saveToStorage(idKey, productList);
        return data;
    }
    catch (error) {
        productContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        console.warn(error);
    }
}