/**
 * Author: Michael Barrows
 * Date: February 2018
 */

/**
 * Currency Converter Object
 * this object is used to store various properties of the currency converter
 * and to perform it's operations. The stored properties include: the currency
 * to be converted to, the original and sale amounts to be converted, the
 * conversion rate, the amount once it has been converted, and the symbol of
 * the currency.
 */
function CurrencyConverter(currency, original_price, sale_price) {
  this.currency = currency;
  this.original_price = original_price;
  this.sale_price = sale_price;
  this.converted_price = 0;
  this.converted_sale_price = 0;
  this.rate = 0;
  this.symbol = undefined;
}

/**
 * Function that will get the exchange rates, convert the original and sale
 * prices using the exchange rate round the converted currency to two decimal
 * places and display the results to the user.
 */
CurrencyConverter.prototype.convert = function() {
  currency = this.currency;
  original_price = this.original_price;
  sale_price = this.sale_price;
  // The URL of the API that holds the currency conversion rates, appended
  // with the currency code, so as to only get that currency
  var url = 'https://api.fixer.io/latest?base=GBP&symbols=' + currency;
  // Retrieves the exchange rates from the Fixer API
  $.get(url, function(data) {
    // Checks if the currency is US, Australian or Canadian dollars, as these
    // use the same symbol
    if (currency == "USD" || currency == "AUD" || currency == "CAD") {
      // Sets the currency symbol to the dollar sign
      this.symbol =  "$";
      // Checks if the currency is US Dollars, and sets the currency rate to US
      // Dollars if true
      if (currency == "USD") {
        this.rate = data.rates.USD;
        // Checks if the currency is Australian Dollars, and sets the currency
        // rate to Australian Dollars if true
      } else if (currency == "AUD") {
        this.rate = data.rates.AUD;
        // Checks if the currency is Canadian Dollars, and sets the currency
        // rate to Canadian Dollars if true
      } else if (currency == "CAD") {
        this.rate = data.rates.CAD;
      }
      // Checks if the currency is Euro's, and sets the currency rate and symbol
      // to Euro's if true
    } else if (currency == "EUR") {
      this.symbol = "€";
      this.rate = data.rates.EUR;
      // Checks if the currency is the Japanese Yen and sets the currency rate
      // and symbol the Japanese Yen if true
    } else if (currency == "JPY") {
      this.symbol = "¥";
      this.rate = data.rates.JPY;
      // If one of the above currencies was not found prior, the currency is
      // assumed to be GBP and the rate is manually set to 1
    } else {
      this.symbol = "£";
      this.rate = 1;
    }
    // The original price and sale price are converted to the new currency and
    // rounded to two decimal places
    this.converted_price = (original_price * this.rate).toFixed(2);
    this.converted_sale_price = (sale_price * this.rate).toFixed(2);

    // The converted amounts are displayed where the original amounts were with
    // the currency symbol changed
    document.getElementById('ComparePrice-product-template').getElementsByClassName('money')[0].innerHTML = this.symbol + this.converted_price;
    document.getElementById('ProductPrice-product-template').getElementsByClassName('money')[0].innerHTML = this.symbol + this.converted_sale_price;
  });
};

// Waits until the DOM is ready to be manipulated before any of the containing
// code can be run
$(document).ready(function(){
  // sets the first currency used
  var currency_class = "gbp";
  // stores the original and sale prices in GBP so these can be retrieved late
  var original_price_gbp = document.getElementById('ComparePrice-product-template').getElementsByClassName('money')[0].innerHTML.slice(1);
  var original_sale_price_gbp = document.getElementById('ProductPrice-product-template').getElementsByClassName('money')[0].innerHTML.slice(1);
  // Function used to change the flag displayed when the dropdown field is clicked
  $('select#currency').on('click', function(event) {
    // gets the dropdown field
    var currency = $('select[name="currency"]').val();
    // removes the last used currency class from the select and therefore removes
    // the flag
    document.getElementById('currency').classList.remove(currency_class);
    // Checks if GBP is the currency and sets the flag by adding a class
    if (currency == "GBP") {
      document.getElementById('currency').classList.add("gbp");
      currency_class = "gbp";
    // Checks if USD is the currency and sets the flag by adding a class
    } else if (currency == "USD") {
      document.getElementById('currency').classList.add("usd");
      currency_class = "usd";
    // Checks if EUR is the currency and sets the flag by adding a class
    } else if (currency == "EUR") {
      document.getElementById('currency').classList.add("eur");
      currency_class = "eur";
    // Checks if JPY is currency and sets the flag by adding a class
    } else if (currency == "JPY") {
      document.getElementById('currency').classList.add("jpy");
      currency_class = "jpy";
    // Checks if AUD is currency and sets the flag by adding a class
    } else if (currency == "AUD") {
      document.getElementById('currency').classList.add("aud");
      currency_class = "aud";
    // Checks if CAD is currency and sets the flag by adding a class
    } else if (currency == "CAD") {
      document.getElementById('currency').classList.add("cad");
      currency_class = "cad";
    }
  });

  // Event handler for the submit button on the currency converter form
  $('form#currencyconverter').on('submit', function(event) {
    // Prevents the form from being submitted
    event.preventDefault();

    // Gets the user selected currency from the form and stores its value
    var currency = $('select[name="currency"]').val();

    // Creates a new currency converter with the user selected currency,
    // original and sale amounts as parameters
    var converter = new CurrencyConverter(currency, original_price_gbp, original_sale_price_gbp);
    // calls the converters convert method
    converter.convert();
  });
});
