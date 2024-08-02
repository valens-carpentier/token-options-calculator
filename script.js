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

const priceDisplay = document.createElement('p');
const vestedTokenOptionsDisplay = document.createElement('p');
tokenPriceDisplay.appendChild(priceDisplay);

let tokenOptionsValue = 0;
let fullyLapsedMonthsValue = 0;
let vestingPeriodValue = 0;

function getTokenOptions() {
    document.addEventListener("keydown", function(event) {
        tokenOptionsValue = tokenOptions.value;
        console.log(tokenOptionsValue);
    });
}

function getfullyLapsedMonths() {
    document.addEventListener("keydown", function(event) {
        fullyLapsedMonthsValue = fullyLapsedMonths.value;
        console.log(fullyLapsedMonthsValue);
    });
}

function getVestingPeriod() {
    document.addEventListener("keydown", function(event) {
        vestingPeriodValue = vestingPeriod.value;
        console.log(vestingPeriodValue);
    });
}

function updateDisplay() {
    priceDisplay.textContent = safePrice;
}

function getvestedTokenOptions() {
    document.addEventListener("keydown", function(event) {
        if (event.key === 'Enter') {
            let result = ((tokenOptionsValue*(fullyLapsedMonthsValue**2))/(vestingPeriodValue**2));
            console.log(result);
            vestedTokenOptionsDisplay.textContent = result;
            vestedTokenOptions.appendChild(vestedTokenOptionsDisplay);
        }
    });
}

getSafePrice().then(() => {
    updateDisplay();
    getTokenOptions();
    getfullyLapsedMonths();
    getVestingPeriod();
    getvestedTokenOptions();
});