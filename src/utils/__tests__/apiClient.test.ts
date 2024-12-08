import { CurrencyCodes } from "../../models/currency";
import * as apiFuncs from "../apiClient";

import { API_KEY, EXCHANGE_URL } from "../../consts";

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

// commented out while I work out how to mock either fetch or getApiResponse
// describe.skip("getWithRetries", () => {
//   let spy: any;
//   beforeAll(() => {
//     spy = jest.fn();
//     spy = jest.spyOn(apiFuncs, "getApiResponse");
//   });
//   afterEach(() => spy.mockRestore());
//   afterAll(() => {
//     jest.restoreAllMocks();
//   });

//   let result: CurrencyResult = {
//     result: "success",
//   };
//   let resp: ApiResponse<CurrencyResult> = {
//     status: 200,
//     body: result,
//   };

//   spy.mockImplementation(() => {
//     Promise.resolve(resp);
//   });

//   it("returns expected result", async () => {
//     let result = await apiFuncs.getWithRetries<CurrencyCodes>("url");
//     console.log(result);
//   });
// });
