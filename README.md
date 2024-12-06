# Jude's Notes
The code checks that the supplied 2 currency codes are recognised by exchangerate-api.com and then requests the exchange rate between them treating the first input as the base currency.
Requests to exchangerate-api.com have configurable number of retries (default to 3 and capped at 10) 

## Variation from spec
I got a 2 week api key (see consts) that I am using to both verify the user supplied currency codes against (we can only accept currency codes that are supported by exchangerate-api.com) 
I am also using this api key to get the exchange rate since the endpoint with the api key  (https://v6.exchangerate-api.com/v6/YOUR-API-KEY/pair/EUR/GBP) better reflects the production solution so prevents rework later

### Testing:
I have added some unit tests but I am having problems getting jest spyOn to mock a generic function or to mock fetch. I have added one test but skipped it. The tests I want to add would be to

To test getWithRetries<T> verify that when I mock getApiResponse<T> that 
1. OK responses return expected and are not retried
2. Non retryable responses return expected and are not retried
3. Retryable responses return expected and are retried the set number of retries
4. Number of  retries is capped at 10 

Tests similar to above for isValidCurrency and getExchangeRate. I need to get mocking of generic functions fixed to do these too

### further work
For production we would want the code to issue a separate warning if the api key failed so this can be alerted on
The api key should be moved to an environment setting so if can be updated and separately secured
Tenants may have their own api keys and, if so, the code should reflect this. 
In production we may want to cache exchange rates depending on how often they are updated. This would also buffer the system if exchangerate-api.com had an outage 

# README

## Task

### Requirements

* We want to create an endpoint that returns an up-to-date exchange rate pairing.

* User can specify two currencies to return the exchange rate between them.

* Maximum of 3 retries to external API before it fails.

### Notes

Setup correct level of tests that you feel is necessary to cover the requirements, example tests are in the repository.

### Resources

 - API endpoint: https://open.er-api.com/v6/latest/GBP
    - Note that `GBP` can be substituted out for the currency you wish to view exchange rates for, e.g. USD, JPY, NOK
 - Docs: https://www.exchangerate-api.com/docs/overview

Please make any notes around implementation that you considered and disregarded or anything you would have implemented if you had more time.