let safePrice;

async function getSafePrice() {
    const apiKey = 'CG-zPaTYWgDN5xhKZpmdfJsvmRJ';
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=safe&vs_currencies=eur';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Public proxy URL
  
    const options = {
        method: 'get',
        headers: {
            'x-cg-demo-api-key': apiKey
        },
        muteHttpExceptions: true
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
const priceDisplay = document.createElement('p');
tokenPriceDisplay.appendChild(priceDisplay);

function updateDisplay() {
    priceDisplay.textContent = safePrice;
}

getSafePrice().then(() => {
    updateDisplay();
});
