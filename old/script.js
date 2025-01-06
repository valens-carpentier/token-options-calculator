let tokenPrice;
let myChart = null; 
let calculMethod;
let tokenId = "";

async function tokenDropDown() {
    
    const tokenIds = ['aave', 'safe','arbitrum','optimism'];

    const dropdownElement = document.querySelector('#token-dropdown');

    for (let tokenId of tokenIds) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}`);
            const data = await response.json();

            const nameUrl = data.name;

            let option = document.createElement("option");
            option.text = nameUrl;
            option.value = tokenId; 

            dropdownElement.add(option);
        } catch (error) {
            console.error(`Error fetching data for ${tokenId}:`, error);
        }
    }

    // Set the default selected token and fetch its price
    dropdownElement.value = tokenIds[0];
    await fetchInitialTokenPrice(tokenIds[0]);
}

async function fetchInitialTokenPrice(initialTokenId) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${initialTokenId}`);
        const data = await response.json();
        
        tokenPrice = data.market_data.current_price.eur;
        updateDisplay();

        // Update the logo as well
        const logoUrl = data.image.small;
        const logoElement = document.querySelector('#token-logo');
        logoElement.src = logoUrl;
        logoElement.alt = `${initialTokenId} Logo`;
    } catch (error) {
        console.error('Error fetching initial token data:', error);
    }
}

function getTokenLogo() {
    document.querySelector('#token-dropdown').addEventListener("change", function(event) {
        
        tokenId = event.target.value;
        console.log(tokenId);

        fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}`)
            .then(response => response.json())
            .then(data => {
                
                const logoUrl = data.image.small;
                
                const logoElement = document.querySelector('#token-logo');
                logoElement.src = logoUrl;
                logoElement.alt = `${tokenId} Logo`;
            })
            .catch(error => {
                console.error('Error fetching token data:', error);
            });
    });
};

function getTokenPrice() {
    document.querySelector('#token-dropdown').addEventListener("change", function(event) {
        
        tokenId = event.target.value;

        fetch(`https://api.coingecko.com/api/v3/coins/${tokenId}`)
            .then(response => response.json())
            .then(data => {
                
                const priceUrl = data.market_data.current_price.eur;
                
                tokenPrice = priceUrl;
                updateDisplay();
            })
            .catch(error => {
                console.error('Error fetching token data:', error);
            });
    });
};

const tokenPriceDisplay = document.querySelector('#tokenPrice'); 
const tokenOptions = document.querySelector("#tokenOptions");
const fullyLapsedMonths = document.querySelector("#fullyLapsedMonths");
const vestingPeriod = document.querySelector("#vestingPeriod");
const vestedTokenOptions = document.querySelector("#vestedTokenOptions");
const tokenFiatValueInput = document.querySelector("#tokenFiatValue");
const btnCalculate = document.querySelector("#btnCalculate");
const btnClear = document.querySelector('#btnClear');

const createDisplayElement = () => {
    const displayElement = document.createElement('p');
    displayElement.classList.add('display-element'); 
    return displayElement;
}

const priceDisplay = createDisplayElement();
const vestedTokenOptionsDisplay = createDisplayElement();
const tokenFiatValueDisplay = createDisplayElement();

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
    priceDisplay.textContent = tokenPrice.toFixed(2);
}

function getVestedTokenOptions() {

    document.querySelector('#calculation-dropdown').addEventListener("change", function(event) {
        calculMethod = event.target.value;
    });

    btnCalculate.addEventListener("click", function() {
        vestedTokenOptions.innerHTML = ''; 

        if (calculMethod === "exponential") {
            vestedTokenOptionsValue = getExponentialVesting();  
        } else if (calculMethod === "linear") {
            vestedTokenOptionsValue = getLinearVesting(); 
        } else if (calculMethod === "cliff") {
            vestedTokenOptionsValue = getCliffVesting(); 
        }

        vestedTokenOptionsDisplay.textContent = vestedTokenOptionsValue.toFixed(0);
        vestedTokenOptions.appendChild(vestedTokenOptionsDisplay);

        }
)};

function getExponentialVesting() {
        return ((tokenOptionsValue*(fullyLapsedMonthsValue**2))/(vestingPeriodValue**2));
    }
    
function getLinearVesting() {
        return ((tokenOptionsValue*fullyLapsedMonthsValue))/(vestingPeriodValue);
    }
    
function getCliffVesting() {
        let cliffPeriod = 6;
        return ((tokenOptionsValue))/(vestingPeriodValue-cliffPeriod);
    }



function getTokenFiatValue() {
    btnCalculate.addEventListener("click", function() {
            tokenFiatValueInput.innerHTML = ''; 
            let tokenFiatValue = vestedTokenOptionsValue * tokenPrice;
            tokenFiatValueDisplay.textContent = tokenFiatValue.toFixed(0);
            tokenFiatValueInput.appendChild(tokenFiatValueDisplay);
        }
    )};

function getVestingTable() {

    tokenOptionsValue = tokenOptions.value;
    fullyLapsedMonthsValue = fullyLapsedMonths.value;
    vestingPeriodValue = vestingPeriod.value;
    let cumulativeVestedValue = 0;

    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Month</th><th>Vested Token Options</th><th>Value</th></tr>`;

    document.querySelector('#calculation-dropdown').addEventListener("change", function(event) {
        calculMethod = event.target.value;
    });

    for (let i = 1; i <= vestingPeriodValue; i++) {

        if (calculMethod === "exponential") {
            vestedTokenOptionsValue = (tokenOptionsValue * (i ** 2)) / (vestingPeriodValue ** 2);
        } else if (calculMethod === "linear") {
            vestedTokenOptionsValue = (tokenOptionsValue * i) / vestingPeriodValue;
        } else if (calculMethod === "cliff") {
            let cliffPeriod = 6;
            if (i < cliffPeriod) {
                vestedTokenOptionsValue = 0;
            } else {
                let monthlyVest = tokenOptionsValue / (vestingPeriodValue - cliffPeriod + 1);
                cumulativeVestedValue += monthlyVest;
                vestedTokenOptionsValue = cumulativeVestedValue;
            }
        }

        const currentTokenFiatValue = vestedTokenOptionsValue * tokenPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${vestedTokenOptionsValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
            <td>${currentTokenFiatValue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>`;
        table.appendChild(row);
    }

    const tableContainer = document.querySelector('#tableContainer');
    tableContainer.innerHTML = ''; 
    tableContainer.appendChild(table);

}

function buildGraph() {
    const table = document.querySelector('table');
    const rows = table.querySelectorAll('tr'); 

    const labels = [];
    const tableTokenFiatValue = [];

    rows.forEach((row, index) => {
        if (index > 0) { 
            const cells = row.querySelectorAll('td');
            labels.push(cells[0].textContent);

            let fiatValueText = cells[2].textContent;
            fiatValueText = fiatValueText.replace(/[^\d,.-]/g, '').replace(',', '.');
                        
            const fiatValue = parseFloat(fiatValueText);
            tableTokenFiatValue.push(fiatValue);
        }
    });

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.querySelector('#valueGraph').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Value',
                    data: tableTokenFiatValue,
                    borderColor: 'rgba(18,255,128)',
                    borderWidth: 1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

function clearData() {
    tokenOptions.value = null;
    fullyLapsedMonths.value = null;
    vestingPeriod.value = null;
    vestedTokenOptions.innerHTML = ""; 
    tokenFiatValueInput.innerHTML = "";
    if (myChart) {
        myChart.destroy();
    }
    tableContainer.innerHTML = ''; 
}


async function initialize() {
    await tokenDropDown();  
    getTokenPrice();      
    getTokenLogo();
    getTokenOptions();
    getfullyLapsedMonths();
    getVestingPeriod();
    getVestedTokenOptions();
    getTokenFiatValue();
    // Remove updateDisplay() from here as it's now called in fetchInitialTokenPrice()
}

initialize(); 

document.querySelector('#btnCalculate').addEventListener('click', () => {
    getVestingTable();
    buildGraph();
});

document.querySelector('#btnClear').addEventListener('click', () => {
    clearData();
});