import * as Constants from './constants.js';

document.addEventListener('DOMContentLoaded', function () {


    if (Constants.submitButton.disabled) {
        Constants.submitLabel.classList.add('disabled'); // Add the class if the button is disabled
    } else {
        Constants.submitLabel.classList.remove('disabled'); // Remove it if the button is enabled
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
        } else if (input === Constants.emailInput && !/\S+@\S+\.\S+/.test(input.value)) {
            input.classList.remove('valid');
            input.classList.add('error');
            input.insertAdjacentHTML('afterend', '<span class="error-message">Email is incorrectly formatted.</span>');
        } else {
            input.classList.remove('error');
            input.classList.add('valid');
            input.insertAdjacentHTML('afterend', '<span class="valid-mark">&#10004;</span>');
        }
    }

    Constants.inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
            validateInput(input);

            // Enable or disable submit button based on validation
            const allFieldsValid = Constants.inputs.every(function (input) {
                return input.classList.contains('valid');
            });
            Constants.submitButton.disabled = !allFieldsValid;
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

    // You may also want to prevent the default form submission and validate all fields when attempting to submit
    Constants.submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form from submitting
        Constants.inputs.forEach(validateInput);
        const allFieldsValid = Constants.inputs.every(function (input) {
            return input.classList.contains('valid');
        });

        if (allFieldsValid) {
            // Perform the form submission logic here, or remove event.preventDefault() above to allow the form to submit
        }
    });
});
