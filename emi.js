const loanAmountInput = document.getElementById('LoanAmount');
const interestRateInput = document.getElementById('interestRate');
const loanTenureInput = document.getElementById('loanTenure');

const loanAmountSlider = document.getElementById('LoanAmountSlider');
const interestRateSlider = document.getElementById('interestRateSlider');
const loanTenureSlider = document.getElementById('loanTenureSlider');

const emiAmountElement = document.getElementById('emiAmount');
const principalAmountElement = document.getElementById('principalAmount');
const totalInterestElement = document.getElementById('totalInterest');
const totalPaymentElement = document.getElementById('totalPayment');

const calculateBtn = document.getElementById('CalculateBtn');
const resetBtn = document.getElementById('ResetBtn');
const chartContainer = document.querySelector('.chart-container');
const mainContainer = document.querySelector('.main-container');




let emiChart; // Variable to store the chart instance


// Function to format number with Indian comma style (e.g., 1,00,000)
function formatINR(value) {
    let num = value.replace(/,/g, ''); // Remove existing commas
    let x = num.split('.');
    let lastThree = x[0].slice(-3);
    let otherNumbers = x[0].slice(0, -3);
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    let formattedNumber = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return x.length > 1 ? formattedNumber + '.' + x[1] : formattedNumber;
}


// ✅ Function to remove commas before calculations
function removeCommas(value) {
    return value.replace(/,/g, '');
}
// Validate input
function validateLoanAmount() {
    let value = parseFloat(removeCommas(loanAmountInput.value)); // Ensure numeric value

    if (value % 100 !== 0) { 
        alert("Loan amount should be in multiples of 100 (e.g., 10000, 10100, 10200).");
        loanAmountInput.value = formatINR(Math.floor(value / 100) * 100); // Round down & format
        loanAmountSlider.value = Math.floor(value / 100) * 100; // Sync slider
    }
}


// ✅ Sync Loan Amount Input and Slider (with INR formatting)
loanAmountInput.addEventListener('input', () => {
    let numericValue = removeCommas(loanAmountInput.value); // Remove commas
    if (!isNaN(numericValue) && numericValue !== "") {
        loanAmountInput.value = formatINR(numericValue); // Format as INR
        loanAmountSlider.value = numericValue; // Sync slider
    }
    validateInput(loanAmountInput, 10000, 10000000, null, true); // Check multiples of 100
    validateLoanAmount(); // 🔹 Call validateLoanAmount to ensure it checks multiples of 100
});



//  Update Loan Amount when slider is moved
loanAmountSlider.addEventListener('input', () => {
    loanAmountInput.value = formatINR(loanAmountSlider.value);
});

//  Sync Interest Rate Input and Slider
interestRateInput.addEventListener('input', () => {
    interestRateSlider.value = interestRateInput.value; // Sync slider
    validateInput(interestRateInput, 1, 100, interestRateError); // Normal validation
});

loanTenureInput.addEventListener('input', () => {
    loanTenureSlider.value = loanTenureInput.value; // Sync slider
    validateInput(loanTenureInput, 1, 50, loanTenureError); // Normal validation
});

//  Sync Loan Tenure Input and Slider
interestRateSlider.addEventListener('input', () => {
    interestRateInput.value = interestRateSlider.value;
});
loanTenureSlider.addEventListener('input', () => {
    loanTenureInput.value = loanTenureSlider.value;
});

function validateInput(input, min, max, errorElement, checkMultipleOf100 = false) {
    let value = parseFloat(removeCommas(input.value)); // Ensure numeric value without commas

    if (isNaN(value) || value < min || value > max || (checkMultipleOf100 && value % 100 !== 0)) {
        input.style.border = "2px solid red";  // Show red border on invalid input
        if (errorElement) errorElement.style.display = "block"; // Show error message
        return false; 
    } else {
        input.style.border = "1px solid #ccc";  // Reset border when input is valid
        if (errorElement) errorElement.style.display = "none"; // Hide error message
        return true;
    }
}






// Validate immediately on input change

interestRateInput.addEventListener('input', () => {
    interestRateSlider.value = interestRateInput.value; // Sync slider with input
    validateInput(interestRateInput, 1, 100, interestRateError);
    calculateEMI();
});

loanTenureInput.addEventListener('input', () => {
    loanTenureSlider.value = loanTenureInput.value; // Sync slider with input
    validateInput(loanTenureInput, 1, 50, loanTenureError);
    calculateEMI();
});

calculateBtn.addEventListener('click', () => {
    let isValidLoanAmount = validateInput(loanAmountInput, 10000, 10000000, null);
    let isValidInterestRate = validateInput(interestRateInput, 1, 100, interestRateError);
    let isValidLoanTenure = validateInput(loanTenureInput, 1, 50, loanTenureError);

    if (isValidLoanAmount && isValidInterestRate && isValidLoanTenure) {
        document.querySelector('.main-container').style.maxWidth = '800px'; // Expand width
        calculateEMI();
    }
});

resetBtn.addEventListener('click', () => {
    let container = document.querySelector('.main-container');
    container.style.maxWidth = '400px';  // Reset width
    container.style.height = 'auto'; // Prevent extra space
    container.style.overflow = 'hidden'; // Hide any leftover spacing
});




// ✅ EMI Calculation Function
function calculateEMI() {
    const principal = parseFloat(removeCommas(loanAmountInput.value)); // Remove commas before calculation
    const interestRate = parseFloat(interestRateInput.value) / 12 / 100;
    const tenure = parseFloat(loanTenureInput.value) * 12;

    const emi = (principal * interestRate * Math.pow(1 + interestRate, tenure)) / (Math.pow(1 + interestRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;

    emiAmountElement.textContent = `₹ ${emi.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    principalAmountElement.textContent = `₹ ${principal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}.00`;
    totalInterestElement.textContent = `₹ ${totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    totalPaymentElement.textContent = `₹ ${totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

    // Show the chart-container
    chartContainer.style.display = 'flex'; // Make it visible

    // Update Chart
    if (emiChart) emiChart.destroy();
    emiChart = new Chart(document.getElementById('emiChart'), {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, totalInterest],
                backgroundColor: ['#007bff', '#dc3545']
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            // Format value with Indian commas and 2 decimal places
                            return `₹ ${formatINR(tooltipItem.raw.toFixed(2).toString())}`;
                        }
                    }
                }
            }
        }
    });
    
} 

// ✅ Attach Calculate EMI function to button
calculateBtn.addEventListener('click', calculateEMI);

// ✅ Reset fields function
resetBtn.addEventListener('click', () => {
    // Reset the input fields to their initial values
    loanAmountInput.value = formatINR("100000");
    interestRateInput.value = "12";
    loanTenureInput.value = "1";

    loanAmountSlider.value = "100000";
    interestRateSlider.value = "12";
    loanTenureSlider.value = "1";

    emiAmountElement.textContent = "₹ 0.00";
    principalAmountElement.textContent = "₹ 0.00";
    totalInterestElement.textContent = "₹ 0.00";
    totalPaymentElement.textContent = "₹ 0.00";

    // Hide the chart container
    chartContainer.style.display = 'none'; // Hide chart container when reset is clicked

    // If a chart is present, destroy it
    if (emiChart) emiChart.destroy();

    // Reset the width and height of the main container
    const container = document.querySelector('.main-container');
    container.style.maxWidth = '400px';  // Reset width
    container.style.height = 'auto';     // Prevent extra space
    container.style.overflow = 'hidden'; // Hide any leftover spacing
});



// ✅ Initial Input Sync on Load

loanAmountInput.value = formatINR(numericValue);



