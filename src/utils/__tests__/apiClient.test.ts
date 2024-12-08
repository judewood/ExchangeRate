import { CurrencyCodes } from "../../models/currency";
import * as apiFuncs from "../apiClient";

import { API_KEY, EXCHANGE_URL } from "../../consts";
import { ApiResponse } from "../../models/api";

describe("notRetryable returns whether downstream indicates request is retryable", () => {
  it.each([408, 403, 500, 502, 503, 504, 522, 524])(
    "when the input is '%p' expecting false",
    (input) => {
      expect(apiFuncs.notRetryable(input)).toBe(false);
    }
  );
  it.each([400, 404, 405])(
    //sample set
    "when the input is '%p' expecting true",
    (input) => {
      expect(apiFuncs.notRetryable(input)).toBe(true);
    }
  );
});

describe("getDelays", () => {
  it("returns expected array", () => {
    let expected: number[];
    expected = [1, 2, 4, 8];
    let result = apiFuncs.getDelays(4);
    expect(result.length).toEqual(expected.length);
    result.forEach((element, index) => {
      expect(element).toEqual(expected[index]);
    });
  });
});

describe("getWithRetries", () => {
  it("returns expected result", async () => {
    const url = `${EXCHANGE_URL}/${API_KEY}/pair/USD/GBP`;
    let result = await apiFuncs.getWithRetries<CurrencyCodes>(url);
    expect(result?.body?.result).toEqual("success");
  });
});

// still working out the syntax - seems jest cannot resolve the generic type
// because 'Type parameters don't exist in the runtime, so there's no way for Jest to check them'
describe.skip("getWithRetries new", () => {
  const resp: ApiResponse<unknown> = {
    status: 200,
    body: "anything",
  };

  it("returns expected result", async () => {
    const url = `${EXCHANGE_URL}/${API_KEY}/pair/USD/GBP`;
    const spy = jest
      .spyOn(apiFuncs, "getApiResponse")
      .mockReturnValue(Promise.resolve(resp));
    let result = await apiFuncs.getWithRetries<string>(url);
    expect(spy).toHaveBeenCalledTimes(1);  //never gets called when test run
    expect(result?.body).toEqual(resp.body);
  });
});
