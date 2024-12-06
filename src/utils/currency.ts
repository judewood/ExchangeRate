import { logger } from "../logger";
import { API_KEY, EXCHANGE_URL } from "../consts";
import { getWithRetries } from "./apiClient";
import { ApiResponse } from "../models/api";
import {
  CurrencyCodes,
  CurrencyRate,
  CurrencyResult,
} from "../currency/currency";

export const isValidCurrency = async (
  input: string | undefined
): Promise<boolean> => {
  if (!input || input.length < 3) {
    logger.info(`Invalid currency code: ${input}`);
    return false;
  }
  input = input.trim().toUpperCase();
  try {
    const url = `${EXCHANGE_URL}/${API_KEY}/codes`;
    const response = await getWithRetries<CurrencyCodes>(url);
    if (ExchangeApiReportedFail(response)) {
      logger.warn(`unrecognised currency code: ${input}`);
      return false;
    }
    if (!response) {
      logger.warn(`failed to check currency code: ${input}`);
      return false;
    }
    return (
      response!.body!.supported_codes.filter((p) => p[0] === input).length > 0
    );
  } catch (error: any) {
    logger.warn(
      `failed to check if ${input} is valid currency code: ${error.message}`
    );
    return false;
  }
};

export const getExchangeRate = async (
  baseCurr: string,
  compareCurr: string
): Promise<number | undefined> => {
  const url = `${EXCHANGE_URL}/${API_KEY}/pair/${baseCurr}/${compareCurr}`;
  const response = await getWithRetries<CurrencyRate>(url);
  if (ExchangeApiReportedFail(response)) {
    logger.warn(
      `failed to get currency exchange rate for base: ${baseCurr} compared to ${compareCurr}`
    );
    return undefined;
  }
  return response!.body!.conversion_rate;
};

export function ExchangeApiReportedFail(
  resp: ApiResponse<CurrencyResult | undefined | null> | undefined | null
): boolean {
  return (
    !resp?.body?.result || resp.body.result.trim().toLowerCase() != "success"
  );
}
