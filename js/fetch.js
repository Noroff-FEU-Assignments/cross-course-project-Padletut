import * as Constants from "./constants.js";
import { loadFromStorage, saveToStorage } from "./storage/local.js";
import { renderCarousel } from "./carousel.js";



export async function fetchProducts(productContainer, loaderContainer) {

    try {
        let productStorage = loadFromStorage(Constants.productStorageKey) || { timestamp: 0, data: [] };

        // Check if data is in local storage and it's less than 1 minute old
        if (productStorage.data.length > 0 && new Date().getTime() - productStorage.timestamp < 60000) {
            return productStorage.data;
        } else {
            const response = await fetch(Constants.url);
            const data = await response.json();
            if (!response.ok) {
                productContainer.innerHTML = `<div class="${productContainer}"><h2>Ooops...something went wrong while loading the page</h2></div>`;
                return;
            }
            productStorage = { timestamp: new Date().getTime(), data };
            saveToStorage(Constants.productStorageKey, productStorage);
        }

        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer.forEach(element => element.style.display = "none");
        }

        const productList = productStorage.data.map(product => product.id);
        saveToStorage(Constants.idKey, productList);

        if (loaderContainer) {
            loaderContainer.style.display = "none";
        }
        return productStorage.data;
    }
    catch (error) {
        productContainer.innerHTML = `<div class="${productContainer}"><h2>Ooops...something went wrong while loading the page</h2></div>`;
        console.warn(error);
    }
}

export async function fetchProductsForCarousel(carouselContainer, loaderContainer, genderFilter = null) {
    try {
        let productStorage = loadFromStorage(Constants.productStorageKey) || { timestamp: 0, data: [] };

        let data = productStorage.data;
        // If data is not in local storage or it's more than 1 minute old, fetch it
        if (data.length === 0 || new Date().getTime() - productStorage.timestamp >= 60000) {
            const response = await fetch(Constants.url);
            if (!response.ok) {
                carouselContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
                return;
            }

            data = await response.json();
            // Save data and timestamp to local storage
            productStorage = { timestamp: new Date().getTime(), data };
            saveToStorage(Constants.productStorageKey, productStorage);
        }

        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer[1].style.display = "none";
        }

        let filteredData = data;
        if (genderFilter) {
            filteredData = data.filter(product => product.attribute.terms[0].name === genderFilter);
        }

        const productList = filteredData.map(product => product.id);

        // Initialize the carousel with a random set of 5 products
        const randomProducts = filteredData.sort(() => 0.5 - Math.random()).slice(0, 5);
        renderCarousel('.carousel__track', randomProducts);

        saveToStorage(Constants.idKey, productList);
        return filteredData;
    }
    catch (error) {
        carouselContainer.innerHTML = '<div class="products__content__header"><h2>Ooops...something went wrong while loading the page</h2></div>';
        console.warn(error);
    }
}

export async function fetchSingleProduct(id, detailContainer, url, loaderContainer) {
    try {
        let productStorage = loadFromStorage(Constants.singleProductStorageKey) || { timestamp: 0, data: [] };

        let data = productStorage.data.find(product => product.id === id);
        // If data is not in local storage or it's more than 1 minute old, fetch it
        if (!data || new Date().getTime() - productStorage.timestamp >= 60000) {
            const response = await fetch(`${url}/${id}`);
            if (!response.ok) {
                detailContainer.innerHTML = "Error loading page";
                return;
            }
            data = await response.json();
            // Update the product in local storage
            const index = productStorage.data.findIndex(product => product.id === id);
            if (index !== -1) {
                productStorage.data[index] = data;
            } else {
                productStorage.data.push(data);
            }
            productStorage.timestamp = new Date().getTime();
            saveToStorage(Constants.singleProductStorageKey, productStorage);
        }

        // Check if loaderContainer exists before trying to access its properties
        if (loaderContainer && loaderContainer.length > 0) {
            loaderContainer.forEach(element => element.style.display = "none");
        }

        return data;
    }
    catch (error) {
        console.warn(error);
        detailContainer.innerHTML = "Error loading page";
    }
}