
export function saveToStorage(key, value) {
    value = JSON.stringify(value);

    localStorage.setItem(key, value);
}

export function loadFromStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    }
    catch (error) {
        console.warn('JSNO Error: ', error);
        return null;
    }
}

export function removeFromStorage(key) {
    localStorage.removeItem(key);
}