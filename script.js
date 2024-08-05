let safePrice;

async function getSafePrice() {
    const apiKey = 'CG-zPaTYWgDN5xhKZpmdfJsvmRJ';
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=safe&vs_currencies=eur';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; 
  
    const options = {
        method: 'get',
        headers: {
            'x-cg-demo-api-key': apiKey
        },
        muteHttpExceptions: true,
    };
  
    try {
        let response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        safePrice = data.safe.eur;
        console.log('Safe Price: ' + safePrice);
  
        return safePrice;

    } catch (error) {
        console.error('Error fetching the safe price:', error);
    }
}


const tokenPriceDisplay = document.querySelector('#safePrice'); 
const tokenOptions = document.querySelector("#tokenOptions");
const fullyLapsedMonths = document.querySelector("#fullyLapsedMonths");
const vestingPeriod = document.querySelector("#vestingPeriod");
const vestedTokenOptions = document.querySelector("#vestedTokenOptions");
const tokenFiatValueInput = document.querySelector("#tokenFiatValue");
const btnCalculate = document.querySelector("#btnCalculate");

const priceDisplay = document.createElement('p');
const vestedTokenOptionsDisplay = document.createElement('p');
const tokenFiatValueDisplay = document.createElement('p');

tokenPriceDisplay.appendChild(priceDisplay);

let tokenOptionsValue = 0;
let fullyLapsedMonthsValue = 0;
let vestingPeriodValue = 0;
let vestedTokenOptionsValue = 0;
let tokenFiatValue = 0;

function getTokenOptions() {
    document.addEventListener("input", function(event) {
        tokenOptionsValue = tokenOptions.value;
    });
}

function getfullyLapsedMonths() {
    document.addEventListener("input", function(event) {
        fullyLapsedMonthsValue = fullyLapsedMonths.value;
    });
}

function getVestingPeriod() {
    document.addEventListener("input", function(event) {
        vestingPeriodValue = vestingPeriod.value;
    });
}

function updateDisplay() {
    priceDisplay.textContent = safePrice;
}

function getvestedTokenOptions() {
    btnCalculate.addEventListener("click", function() {
            vestedTokenOptionsValue = ((tokenOptionsValue*(fullyLapsedMonthsValue**2))/(vestingPeriodValue**2));
            vestedTokenOptionsDisplay.textContent = vestedTokenOptionsValue;
            vestedTokenOptions.appendChild(vestedTokenOptionsDisplay);
        }
    )};

function getTokenFiatValue() {
    btnCalculate.addEventListener("click", function() {
            let tokenFiatValue = vestedTokenOptionsValue * safePrice;
            tokenFiatValueDisplay.textContent = tokenFiatValue;
            tokenFiatValueInput.appendChild(tokenFiatValueDisplay);
        }
    )};

getSafePrice().then(() => {
    updateDisplay();
    getTokenOptions();
    getfullyLapsedMonths();
    getVestingPeriod();
    getvestedTokenOptions();
    getTokenFiatValue();
});