let safePrice;
let myChart = null; 

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
    priceDisplay.textContent = safePrice.toFixed(2);
}

function getvestedTokenOptions() {
    btnCalculate.addEventListener("click", function() {
            vestedTokenOptions.innerHTML = ''; 
            vestedTokenOptionsValue = ((tokenOptionsValue*(fullyLapsedMonthsValue**2))/(vestingPeriodValue**2));
            vestedTokenOptionsDisplay.textContent = vestedTokenOptionsValue.toFixed(0);
            vestedTokenOptions.appendChild(vestedTokenOptionsDisplay);
        }
    )};

function getTokenFiatValue() {
    btnCalculate.addEventListener("click", function() {
            tokenFiatValueInput.innerHTML = ''; 
            let tokenFiatValue = vestedTokenOptionsValue * safePrice;
            tokenFiatValueDisplay.textContent = tokenFiatValue.toFixed(0);
            tokenFiatValueInput.appendChild(tokenFiatValueDisplay);
        }
    )};

function getVestingTable() {

    tokenOptionsValue = tokenOptions.value;
    fullyLapsedMonthsValue = fullyLapsedMonths.value;
    vestingPeriodValue = vestingPeriod.value;

    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Month</th><th>Vested Token Options</th><th>Value</th></tr>`;

    for (let i = 1; i <= vestingPeriodValue; i++) {
        const currentVestedTokenOptions = (tokenOptionsValue * (i ** 2)) / (vestingPeriodValue ** 2);
        const currentTokenFiatValue = currentVestedTokenOptions * safePrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${currentVestedTokenOptions.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</td>
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

getSafePrice().then(() => {
    updateDisplay();
    getTokenOptions();
    getfullyLapsedMonths();
    getVestingPeriod();
    getvestedTokenOptions();
    getTokenFiatValue();
});

document.querySelector('#btnCalculate').addEventListener('click', () => {
    getVestingTable();
    buildGraph();
});