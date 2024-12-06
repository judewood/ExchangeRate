
export interface CurrencyResult {
  result: string;
}
export interface CurrencyCodes extends CurrencyResult{
  supported_codes: string[][];
}

export interface CurrencyRate extends CurrencyResult {
  base_code: string;
  conversion_rate: number;
}
