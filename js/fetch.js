import { saveToStorage } from "./storage/local.js";
import { idKey, url } from "./constants.js";
import { initializeCarousel } from "./carousel.js";

export async function fetchProducts(productContainer, loaderContainer, renderFunction) {
    try {
        const response = await fetch(url);

        if (response.status === 404) {
            productContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        }

        const data = await response.json();

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


export async function fetchProductsForCarousel(productContainer, loaderContainer, renderFunction) {
    try {
        const response = await fetch(url);

        if (response.status === 404) {
            productContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        }

        const data = await response.json();

        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer[1].style.display = "none";
        }

        const productList = [];

        for (let i = 0; i < data.length; i++) {
            productList.push(data[i].id);
        }

        // Initialize the carousel with a random set of 5 products
        const randomProducts = data.sort(() => 0.5 - Math.random()).slice(0, 5);
        initializeCarousel('.carousel__track', randomProducts);

        renderFunction(data);
        saveToStorage(idKey, productList);
        return data;
    }
    catch (error) {
        productContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        console.warn(error);
    }
}

export async function fetchSingleProduct(id, detailContainer, url, createHtml) {
    try {
        const response = await fetch(`${url}/${id}`);
        const details = await response.json();
        createHtml(details);
    }
    catch (error) {
        console.warn(error);
        detailContainer.innerHTML = "Error loading page";
    }
}