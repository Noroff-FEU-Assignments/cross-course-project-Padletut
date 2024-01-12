const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const submitButton = document.querySelector('#submit');
const submitLabel = document.querySelector('#submit-label');
const inputs = [nameInput, emailInput, messageInput];

document.addEventListener('DOMContentLoaded', function () {


    if (submitButton.disabled) {
        submitLabel.classList.add('disabled');
    } else {
        submitLabel.classList.remove('disabled');
    }

    function validateInput(input) {
        // Remove previous error message and valid mark
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
        const validMark = input.nextElementSibling;
        if (validMark && validMark.classList.contains('valid-mark')) {
            validMark.remove();
        }

        // Validate input
        if (!input.value) {
            input.classList.remove('valid');
            input.classList.add('error');
            input.insertAdjacentHTML('afterend', '<span class="error-message">This field is required.</span>');
        } else if (input === emailInput && !/\S+@\S+\.\S+/.test(input.value)) {
            input.classList.remove('valid');
            input.classList.add('error');
            input.insertAdjacentHTML('afterend', '<span class="error-message">Email is incorrectly formatted.</span>');
        } else {
            input.classList.remove('error');
            input.classList.add('valid');
            input.insertAdjacentHTML('afterend', '<span class="valid-mark">&#10004;</span>');
        }
    }

    inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
            validateInput(input);

            // Enable or disable submit button based on validation
            const allFieldsValid = inputs.every(function (input) {
                return input.classList.contains('valid');
            });
            submitButton.disabled = !allFieldsValid;
        });
    });

    // Add event listeners to the right and left arrow buttons
    const rightArrow = document.querySelector('#right-arrow');
    const leftArrow = document.querySelector('#left-arrow');
    const carousel = document.querySelector('#carousel');

    if (!rightArrow) return;
    rightArrow.addEventListener('click', function () {
        carousel.scrollLeft += carousel.offsetWidth;
    });

    leftArrow.addEventListener('click', function () {
        carousel.scrollLeft -= carousel.offsetWidth;
    });

    // Prevent the default form submission and validate all fields when attempting to submit
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        inputs.forEach(validateInput);
        const allFieldsValid = inputs.every(function (input) {
            return input.classList.contains('valid');
        });

        if (allFieldsValid) {
            alert('Your message has been sent!');
            inputs.forEach(function (input) {
                input.value = '';
                input.classList.remove('valid');
            });
        } else {
            alert('Please fill out all fields correctly.');
        }
    });
});
