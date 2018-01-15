const moment = require('moment');

const PageObjectModel = require('./pageObjectModel.js');

const siteName = 'Tajawel';
const website = 'http://www.tajawal.ae/';

const origins = ['Beirut', 'Doha', 'Dubai', 'Amman', 'Kuwait'];
const destinations = ['Beirut', 'Doha', 'Dubai', 'Amman', 'Kuwait'];

describe(`${siteName} landing page`, function () {
  const random = Math.floor(Math.random() * origins.length);
  const origin = origins[random];
  let destination = destinations[Math.floor(Math.random() * destinations.length)];
  // to avoid selecting same origin and destination
  while (origin === destination) {
    destination = destinations[Math.floor(Math.random() * destinations.length)];
  }

  // 1- Navigate to required domain name (you can find in below).
  browser.get(website);

  // 2- Pass the below search params in to search module and search: 
  // - Random array of origins (length 5)
  $(PageObjectModel.origin).sendKeys(origin);
  browser.wait(() => $(PageObjectModel.origin + ' + ul:not(.hidden) li').isPresent());
  $(PageObjectModel.origin).sendKeys(protractor.Key.ENTER);
  browser.sleep(500);

  // - Random array of destinations (length 5)
  $(PageObjectModel.destination).sendKeys(destination);
  browser.wait(() => $(PageObjectModel.destination + ' + ul:not(.hidden) li').isPresent());
  $(PageObjectModel.destination).sendKeys(protractor.Key.ENTER);

  // - Random dates
  browser.driver.executeScript("document.querySelector('" + PageObjectModel.fromDatepicker + "').click()");
  browser.wait(() => $('.pika-single:not(.is-hidden)').isPresent());
  browser.driver.executeScript("document.querySelector('" + PageObjectModel.calendarSelected + "').nextElementSibling.querySelector('" + PageObjectModel.calendarButton + "').dispatchEvent(new Event('mousedown'))");
  browser.wait(() => $('.pika-single:not(.is-hidden)').isPresent());
  browser.driver.executeScript("document.querySelector('" + PageObjectModel.calendarEndRage + "').nextElementSibling.querySelector('" + PageObjectModel.calendarButton + "').dispatchEvent(new Event('mousedown'))");

  // - 2Adults
  //open passengers dropdown
  $(PageObjectModel.passengersDropdown).click();
  //increment adult to 2
  $(PageObjectModel.adults).click();
  //close passengers dropdown
  $(PageObjectModel.passengersDropdown).click();

  // store values for next page
  const fromDateInputValue = $(PageObjectModel.fromDatepicker).getAttribute('value');
  const toDateInputValue = $(PageObjectModel.toDatepicker).getAttribute('value');
  const originInputValue = $(PageObjectModel.origin).getAttribute('value');
  const destinationInputValue = $(PageObjectModel.destination).getAttribute('value');
  const results = Promise.all([originInputValue, destinationInputValue, fromDateInputValue, toDateInputValue]);

  // wait for all values to be resolved.
  browser.wait(results);

  // click "flights-search-cta"
  // wait for search to finish by watching loader and then looking for summary
  // NOTE: we need the ignoreSynchronization flag because the navigation looks to be
  // outside of Angular and 
  $(PageObjectModel.searchFlightsBtn).click();
  browser.ignoreSynchronization = true;
  browser.wait(() => $(PageObjectModel.searchFareLoader).isPresent());
  browser.wait(() => $(PageObjectModel.flightSummary.from).isPresent());
  browser.controlFlow().execute(() => browser.ignoreSynchronization = false);
  browser.sleep(1000);
  // 3- On listing page provide below requirements and proceed to second page: 
  //  - Assert that Assert that above search params are correct on modify search component.
  const originSearchSummary = $(PageObjectModel.flightSummary.from).getText();
  const destinationSearchSummary = $(PageObjectModel.flightSummary.to).getText();
  const fromDateSearchSummary = $(PageObjectModel.flightSummary.fromDate).getText();
  const toDateSearchSummary = $(PageObjectModel.flightSummary.toDate).getText();
  const travellerCount = $(PageObjectModel.flightSummary.travellerCount).getText();

  // NOTE - it looks like Firefox crashes here sometimes
  //browser.sleep(2000);
  // - Filter results to (EK IATA code) Emirates carrier (if found), if not found filter to any specific carrier.
  browser.executeScript("$('" + PageObjectModel.firstDepartingFlightAirline + "').click();");
  browser.executeScript("try { $($('" + PageObjectModel.ekIATACode + "').get(0).parentNode.nextElementSibling).click(); } catch (e) {}");
  browser.executeScript("$('" + PageObjectModel.firstReturnFlightAirline + "').click();");
  browser.executeScript("try { $($('" + PageObjectModel.xyIATACode + "').get(0).parentNode.nextElementSibling).click(); } catch (e) {}");
  // see if we have results, if not deselect one
  $('translate').isPresent()
    .then(function (isPresent) {
      if (isPresent) {
        browser.executeScript("arguments[0].click();", $(PageObjectModel.resetReturnFlightAirlineChoice).getWebElement());
      }
    });

  browser.wait(() => $(PageObjectModel.firstFlightSelectButton).isPresent());

  // get the price
  const priceElementText = $(PageObjectModel.firstFlightPrice).getText();
  browser.wait(priceElementText);

  // click the first result
  $(PageObjectModel.firstFlightSelectButton).click();
  browser.ignoreSynchronization = true;
  browser.wait(() => $(PageObjectModel.continueToPaymentButton).isPresent());
  browser.controlFlow().execute(() => browser.ignoreSynchronization = false);
  //4- On travelers details page provide below requirements and proceed to second page: 

  // assertions - get the total displayed in the cart
  const cartTotalPassengerPage = $('.traveller-details__cart-total .total-payment__title .pull-right').getText();
  const pricesForEachPassenger = Promise.all([
    $$('.tj-rate__price').get(0),
    $$('.tj-rate__price').get(1),
    $$('.tj-rate__price').get(2),
    $$('.tj-rate__price').get(3)
  ]);

  // - Fill travelers details with proper entries 
  element(by.cssContainingText('#flights-summary-travelers-form-title-0 option', 'Mr')).click();
  $('#flights-summary-travelers-form-first-name-0').sendKeys('John');
  $('#flights-summary-travelers-form-middle-name-0').sendKeys('Paul');
  $('#flights-summary-travelers-form-last-name-0').sendKeys('Smith');
  element(by.cssContainingText('#flights-summary-travelers-form-title-1 option', 'Mrs')).click();
  $('#flights-summary-travelers-form-first-name-1').sendKeys('Mary');
  $('#flights-summary-travelers-form-middle-name-1').sendKeys('Sarah');
  $('#flights-summary-travelers-form-last-name-1').sendKeys('Smith');

  // handle the traveller info when date of birth, document type, etc
  // we only do this is we're asked for the birthday, etc
  browser.wait($('#flights-summary-travelers-form-birthDay-0 option:nth-child(2)').isPresent()
    .then(function (isPresent) {
      if (isPresent) {
        // we loop twice - once for each passenger and we're giving them the same birthdate, etc
        for (var i = 0; i < 2; i++) {
          $('#flights-summary-travelers-form-birthDay-' + i + ' option:nth-child(2)').click();
          $('#flights-summary-travelers-form-birthMonth-' + i + ' option:nth-child(2)').click();
          element(by.cssContainingText('#flights-summary-travelers-form-birthYear-' + i + ' option', '1980')).click();
          $('#flights-summary-travelers-form-countryId-' + i + ' option:nth-child(2)').click();
          $('#flights-summary-travelers-form-passport-details-' + i + ' option:nth-child(2)').click();
          $('#flights-summary-travelers-form-idNumber-' + i).sendKeys('424242424242' + i);
          $('#flights-summary-travelers-form-identityCountryId-' + i + ' option:nth-child(2)').click();
          $('#flights-summary-travelers-form-idExpiryDateDay-' + i + ' option:nth-child(2)').click();
          $('#flights-summary-travelers-form-idExpiryDateMonth-' + i + ' option:nth-child(2)').click();
          $('#flights-summary-travelers-form-idExpiryDateYear-' + i + ' option:nth-child(2)').click();
        }
      }
      return true;
    }));

  element(by.cssContainingText('#flights-summary-travelers-form-contact-title option', 'Mr')).click();
  $('#flights-summary-travelers-form-contact-fname').sendKeys('Paul');
  $('#flights-summary-travelers-form-contact-lname').sendKeys('Smith');
  $('#flights-summary-travelers-form-contact-email').sendKeys('paul.smith@tajawal.ae');
  $('#flights-summary-travelers-form-contact-phone').sendKeys('45182000');

  // continue to the payment page
  $(PageObjectModel.continueToPaymentButton).click();
  browser.ignoreSynchronization = true;
  browser.wait(() => $('#flights-payment-paynow').isPresent());
  browser.controlFlow().execute(() => browser.ignoreSynchronization = false);

  // 5 - On payment page: 
  const pricingPagePrice = $('.cart-total .total-payment__title .pull-right').getText();

  $('#common-credit-card-holder').sendKeys('John P Smith');
  // this is a fake number from Stripe
  $('#common-credit-card-number').sendKeys('4242424242424242');
  $('[name="expiry_month"] option:nth-child(2)').click();
  $('[name="expiry_year"] option:nth-child(2)').click();
  $('#common-credit-card-cvv').sendKeys('123');
  $('#flights-payment-paynow').click();

  // sleep for long enough to take a good screenshot
  browser.sleep(1500);

  afterAll(function() {
    // then disable angular so we shut down cleanly.
    browser.waitForAngularEnabled(false);
  });

  it('Search Summary has same params as home page', function () {
    expect(travellerCount).toEqual('2');
    results
      .then(function (results) {
        expect(originSearchSummary).toEqual(results[0].split(' ')[0]);
        expect(destinationSearchSummary).toEqual(results[1].split(' ')[0]);
        expect(fromDateSearchSummary).toEqual(moment(results[2], 'YYYY-MM-DD').format('DD MMM YYYY'));
        expect(toDateSearchSummary).toEqual(moment(results[3], 'YYYY-MM-DD').format('DD MMM YYYY'));
        return true;
      });
  });

  it('Passenger Page has correct prices', function () {
    cartTotalPassengerPage.then(function (text) {
      // parse "AED 1,900.00" by splitting it out.
      const price = Number(text.split(' ')[1]);
      expect(price).toEqual(Number(priceElementText));

      // here we're add up all the prices listed for each passenger and ensure it matches our
      // expected total.
      return pricesForEachPassenger.then(function (results) {
        const totalPrice = results.reduce(function (total, price) {
          return total + Number(price);
        }, 0);
        expect(price).toEqual(totalPrice);
      });
    });
});
    it("Pricing Page has correct price", function () {
      pricingPagePrice.then(function (text) {
        // parse "AED 1,900.00" by splitting it out.
        const price = Number(text.split(' ')[1]);
        expect(price).toEqual(Number(priceElementText));
      });
    })
  
});