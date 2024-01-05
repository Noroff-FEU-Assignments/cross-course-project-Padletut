// Initialize the header and set active menu item on page load
document.addEventListener('DOMContentLoaded', async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');

    try {
        const response = await fetch('header.xml');
        const data = await response.text();
        headerPlaceholder.innerHTML = data;

        // Set active menu item
        setActiveMenuItem();

        // Emit a custom event to signal that the header is loaded
        document.dispatchEvent(new CustomEvent('headerLoaded'));
    } catch (error) {
        console.error('Error loading header:', error);
    }
});

// Function to remove 'enabled' class from all menu items
function removeEnabledClassFromMenu() {
    document.querySelectorAll('.nav__container li a').forEach(span => {
        span.classList.remove('enabled');
    });
}

// Function to set 'enabled' class based on current page
function setActiveMenuItem() {
    removeEnabledClassFromMenu();

    // Get the current URL
    const currentPage = window.location.pathname.split('/').pop();

    // Disable link for current page and enable others
    const menuItems = document.querySelectorAll('.nav__container li a');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        const isCurrentPage = href === currentPage || (href === 'index.html' && currentPage === '');

        if (isCurrentPage) {
            item.classList.remove('enabled');
            item.style.pointerEvents = 'none';
            item.removeAttribute('href');
        } else {
            item.classList.add('enabled');
            item.style.pointerEvents = 'auto';
        }
    });
}
