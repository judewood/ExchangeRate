import { logger } from "@app/logger";
import { getExchangeRate, isValidCurrency } from "@app/currency/currency";
import type { Request, Response } from "express";

export const exchangeHandler = async (_req: Request, res: Response) => {
  if (
    !(await isValidCurrency(_req.params?.["curr1"])) ||
    !(await isValidCurrency(_req.params?.["curr2"]))
  ) {
    logger.info(
      `Invalid currency code supplied curr1: ${_req.params?.["curr1"]}, curr2: ${_req.params?.["curr2"]}`
    );
    res.status(400).send("Two valid currency symbols are required");
    return;
  }
  const base: string = _req.params?.["curr1"]!;
  const compare: string = _req.params?.["curr2"]!;
  let exchangeRate = await getExchangeRate(base, compare);
  if (!exchangeRate) {
    res.status(500).send("Exchange rate is not available at this time");
    return;
  }
  res.send(
    `The exchange rate between ${base} and ${compare} is ${exchangeRate}`
  );
};
