import {
  ExchangeApiReportedFail,
  getExchangeRate,
  isValidCurrency,
} from "../utils/currency";
import { ApiResponse } from "../models/api";
import { CurrencyResult } from "@app/currency/currency";

describe("ExchangeApiReportedFail returns whether downstream indicates request is retryable", () => {
  let result: CurrencyResult = {
    result: "success",
  };
  let response: ApiResponse<CurrencyResult | undefined | null> = {
    status: 200,
    body: result,
  };
  it.each(["success", "   SUccess "])(
    "when the input is '%s' expecting false",
    (input) => {
      let result: CurrencyResult = {
        result: input,
      };
      response.body = result;
      expect(ExchangeApiReportedFail(response)).toBe(false);
    }
  );
  it("returns true for null response", () => {
    expect(ExchangeApiReportedFail(null)).toBe(true);
  });
  it("returns true for undefined response", () => {
    expect(ExchangeApiReportedFail(undefined)).toBe(true);
  });
  it("returns true for null body", () => {
    response.body = null;
    expect(ExchangeApiReportedFail(response)).toBe(true);
  });
  it("returns true for undefined body", () => {
    response.body = undefined;
    expect(ExchangeApiReportedFail(response)).toBe(true);
  });
});

describe("isValidCurrency", () => {
  it.each(["usd", "   uSd ", "USD"])(
    "when the input is '%s' expecting true",
    async (input) => {
      const result = await isValidCurrency(input);
      expect(result).toBe(true);
    }
  );
  it("returns false for invalid currency code", async () => {
    const result = await isValidCurrency("XXX");
    expect(result).toBe(false);
  });
});

describe("getExchangeRate", () => {
  it("returns expected exchange rate", async () => {
    const result = await getExchangeRate("GBP", "GBP");
    expect(result).toEqual(1);
  });
});
