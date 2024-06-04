import * as Constants from './constants.js';
import { renderCarousel } from './carousel.js';

// Purpose: Contains functions to filter products based on search term, color and size.


// Function to filter products based on search term, color, size, on sale and gender
export function filterProducts(data, searchTerm = null, colorFilter = null, sizeFilter = null, onSale = null, genderFilter = null) {
    let filteredData = data;

    if (onSale) {
        filteredData = filteredData.filter(product => product.on_sale);
    }

    if (genderFilter) {
        filteredData = filteredData.filter(product =>
            product.attributes.some(attr =>
                attr.name === "Gender" && attr.terms.some(term => term.name === genderFilter)
            )
        );
    }


    if (searchTerm) {
        filteredData = filteredData.filter(product => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const isMatch = product.attributes.some(attribute =>
                attribute.terms.some(term => term.slug.toLowerCase().includes(lowerCaseSearchTerm)) ||
                product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.tags.includes(lowerCaseSearchTerm)
            );
            return isMatch;
        });
    }


    if (colorFilter !== 'All') {
        filteredData = filteredData.filter(product => product.attributes.find(attr => attr.name === 'Color' && attr.terms.map(term => term.name).includes(colorFilter)));
    }

    if (sizeFilter && sizeFilter.length > 0) {
        filteredData = filteredData.filter(product =>
            product.attributes.some(attr =>
                attr.name === 'Size' && attr.terms.some(term => sizeFilter.includes(term.name))
            )
        );
    }

    if (colorFilter === 'All' && sizeFilter && sizeFilter.length > 0) {
        filteredData = filteredData.filter(product =>
            product.attributes.some(attr =>
                attr.name === 'Size' && attr.terms.some(term => sizeFilter.includes(term.name))
            )
        );
    }

    return filteredData;
}

// listen for changes in "Constants.searchInput" search input, "Constants.colorfilter" color and "Constants.sizefilter" size filters and update the product list accordingly
export function filterProductsOnInput(data, renderFunction, searchInput, colorFilter, sizeFilter, onSale, genderFilter) {

    if (Constants.productContainer) {

        // Search input
        searchInput.form.addEventListener('input', (event) => {
            event.preventDefault();
            const searchTerm = searchInput.value;
            //convert colorFilter and sizeFilter to arrays
            const colorFilterArray = Array.from(colorFilter);
            const sizeFilterArray = Array.from(sizeFilter);
            // get currently selected color and size filters
            const selectedColor = colorFilterArray.find(filter => filter.checked)?.value || null;
            const selectedSize = sizeFilterArray.find(filter => filter.checked)?.name || null;
            if (!searchInput.value) {
                const filteredData = filterProducts(data, searchTerm, selectedColor, selectedSize, Constants.onSale, genderFilter);
                renderFunction(filteredData);
            } else {
                const filteredData = filterProducts(data, searchTerm, selectedColor, selectedSize, false, genderFilter);
                renderFunction(filteredData);
            }
        });

        // Search button
        const searchProductsButton = document.getElementById('search-products-button');
        searchProductsButton.addEventListener('click', (event) => {
            event.preventDefault();
            const searchTerm = searchInput.value;
            const colorFilterArray = Array.from(colorFilter);
            const sizeFilterArray = Array.from(sizeFilter);
            const selectedColor = colorFilterArray.find(filter => filter.checked)?.value || null;
            const selectedSize = sizeFilterArray.find(filter => filter.checked)?.name || null;

            if (!searchTerm) {
                const filteredData = filterProducts(data, searchTerm, selectedColor, selectedSize, Constants.onSale, genderFilter);
                renderFunction(filteredData);
            } else {
                const filteredData = filterProducts(data, searchTerm, selectedColor, selectedSize, false, genderFilter);
                renderFunction(filteredData);
            }
        });

        // Color filters
        colorFilter.forEach(filter => {
            filter.addEventListener('change', () => {
                const checkedSizes = Array.from(sizeFilter).filter(filter => filter.checked).map(filter => filter.name);
                const colorFilterArray = Array.from(colorFilter);
                const searchTerm = searchInput.value;
                const selectedColor = colorFilterArray.find(filter => filter.checked)?.value || null;
                const onSale = Constants.onSale && checkedSizes.length === 0 && selectedColor === 'All';
                if (searchTerm) {
                    const filteredData = filterProducts(data, searchTerm, selectedColor, checkedSizes.length ? checkedSizes : null, false, genderFilter);
                    renderFunction(filteredData);
                } else {
                    const filteredData = filterProducts(data, searchTerm, selectedColor, checkedSizes.length ? checkedSizes : null, onSale, genderFilter);
                    renderFunction(filteredData);
                }
            });
        });

        // Size filters
        sizeFilter.forEach(filter => {
            filter.addEventListener('change', () => {
                const checkedSizes = Array.from(sizeFilter).filter(filter => filter.checked).map(filter => filter.name);
                const colorFilterArray = Array.from(colorFilter);
                const searchTerm = searchInput.value;
                const selectedColorFilter = colorFilterArray.find(filter => filter.checked);
                const selectedColor = selectedColorFilter ? selectedColorFilter.value : null;
                const onSale = Constants.onSale && checkedSizes.length === 0 && (selectedColor === 'All' || selectedColor === null);
                if (searchTerm) {
                    const filteredData = filterProducts(data, searchTerm, selectedColor, checkedSizes.length ? checkedSizes : null, false, genderFilter);
                    renderFunction(filteredData);
                } else {
                    const filteredData = filterProducts(data, searchTerm, selectedColor, checkedSizes.length ? checkedSizes : null, onSale, genderFilter);
                    renderFunction(filteredData);
                }
            });
        });

        // Initial rendering of products
        const checkedSizes = Array.from(sizeFilter).filter(filter => filter.checked).map(filter => filter.name);
        const colorFilterArray = Array.from(colorFilter);
        const selectedColorFilter = colorFilterArray.find(filter => filter.checked);
        const selectedColor = selectedColorFilter ? selectedColorFilter.value : null;
        const onSale = Constants.onSale && checkedSizes.length === 0 && (selectedColor === 'All' || selectedColor === null);
        const filteredData = filterProducts(data, searchInput.value, selectedColor, null, onSale, genderFilter);
        renderFunction(filteredData);

    }
}

// Load carousel products with a random set of 5 products
export function loadCarouselProducts(data) {
    if (Constants.carouselContainer) {
        if (data.length > 0) {
            const randomProducts = data.sort(() => 0.5 - Math.random()).slice(0, 5);
            renderCarousel('.carousel__track', randomProducts);
        }
    }
}