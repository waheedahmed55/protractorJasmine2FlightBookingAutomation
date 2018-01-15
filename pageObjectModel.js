module.exports = {
    origin: '#flights-search-origin-1',
    destination: '#flights-search-destination-1',
    passengersDropdown: '#flights-search-open-pax-btn',
    adults: '[data-action="add"][data-pax-type="adult"]',
    fromDatepicker: '#flights-search-mob-date-departureDate-LegIndex[data-key="departureDate"]',
    toDatepicker: '#flights-search-mob-date-departureDate-LegIndex[data-key="returnDate"]',
    calendarSelected: '.pika-lendar .is-selected',
    calendarEndRage: '.pika-lendar .is-selected.is-endrange',
    calendarButton: 'button',
    searchFlightsBtn: '#flights-search-cta',
    searchFareLoader: '.fareLoaderDiv',
    flightSearchSummary: '#flights-results-summary',
    flightSummary: {
      from: '#flights-results-summary [iata="vm.request.goingLeg.originId"] > a',
      to: '#flights-results-summary [iata="vm.request.comingLeg.originId"] > a',
      fromDate: '#flights-results-summary .flight-search-summary__container .row:nth-child(2) .flight-search-summ__item:nth-child(2) p:first-child span',
      toDate: '#flights-results-summary .flight-search-summary__container .row:nth-child(2) .flight-search-summ__item:nth-child(2) p:last-child span',
      travellerCount: '#flights-results-summary .flight-search-summary__container .row:nth-child(2) .flight-search-summ__item:nth-child(4) p span'
    },
    ekIATACode: '.filters__checkbos-fix .filter-options:first-child .form-group .font-base:contains(\"EK: Emirates\")',
    xyIATACode: '.filters__checkbos-fix .filter-options:last-child .form-group .font-base:contains(\"XY: flynas\")',
    firstDepartingFlightAirline: '#flights-filters-airline-leg-0-check-exclude-0',
    firstReturnFlightAirline: '#flights-filters-airline-leg-1-check-exclude-0',
    resetReturnFlightAirlineChoice: '#flights-filters-can-show-airline-cta-1',
    firstFlightSelectButton: '#flights-results-select-cta-btn-desktop-0',
    firstFlightPrice: '#serch-result-item-group-0 .search-result-action-a .search-result-item__itinerary-price-detail .price-display:nth-child(2)',
    continueToPaymentButton: '#flights-summary-go-to-payment-cta'
};