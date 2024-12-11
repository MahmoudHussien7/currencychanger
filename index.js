const api = "https://api.exchangerate-api.com/v4/latest/USD";

// Fetch exchange rates from the API
async function fetchExchangeRates() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return null;
  }
}

// Update prices for all pricing cards dynamically
async function updatePrices(selectedCurrency) {
  const rates = await fetchExchangeRates();

  if (!rates) {
    alert("Unable to fetch exchange rates. Please try again later.");
    return;
  }

  // Loop through all pricing cards and update prices
  document.querySelectorAll(".pricing-card").forEach((card) => {
    const priceElement = card.querySelector(".pricing-price");
    const basePriceUSD = parseFloat(priceElement.dataset.priceUsd);
    const renewalPriceUSD = parseFloat(priceElement.dataset.renewalUsd);

    // Convert prices based on selected currency
    const convertedPrice = (basePriceUSD * rates[selectedCurrency]).toFixed(2);
    const convertedRenewalPrice = (
      renewalPriceUSD * rates[selectedCurrency]
    ).toFixed(2);

    // Update the HTML with converted prices
    priceElement.innerHTML = `${selectedCurrency} ${convertedPrice} <small>Annual Renewal: ${selectedCurrency} ${convertedRenewalPrice}</small>`;
  });
}

// Add event listener to all currency changers
document.querySelectorAll(".currency-changer").forEach((changer) => {
  changer.addEventListener("change", (e) => {
    const selectedCurrency = e.target.value;

    if (selectedCurrency) {
      updatePrices(selectedCurrency);
    } else {
      // Reset all prices to default USD values
      document.querySelectorAll(".pricing-card").forEach((card) => {
        const priceElement = card.querySelector(".pricing-price");
        const basePriceUSD = priceElement.dataset.priceUsd;
        const renewalPriceUSD = priceElement.dataset.renewalUsd;

        priceElement.innerHTML = `$${basePriceUSD} <small>Annual Renewal: USD ${renewalPriceUSD}</small>`;
      });
    }
  });
});
