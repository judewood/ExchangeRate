import * as apiFuncs from "../apiClient";

import { API_KEY, EXCHANGE_URL } from "../../consts";
import { ApiResponse } from "../../models/api";
import fetchMock from "jest-fetch-mock";

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

describe("performs expected number of retries", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.mockClear();
  });

  it("performs no retries when downstream response is not retryable", async () => {
    const expected: ApiResponse<string> = {
      status: 400,
      body: "anything",
    };
    fetchMock.mockResponse(
      JSON.stringify({ status: expected.status, body: expected.body }),
      { status: expected.status }
    );
    const url = `${EXCHANGE_URL}/${API_KEY}/pair/USD/GBP`;
    await apiFuncs.getWithRetries<string>(url, 3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

    it("performs retries when downstream returns retryable status", async () => {
      const expected: ApiResponse<string> = {
        status: 500,
        body: "anything",
      };
      fetchMock.mockResponse(
        JSON.stringify({ status: expected.status, body: expected.body }),
        { status: expected.status }
      );
      const url = `${EXCHANGE_URL}/${API_KEY}/pair/USD/GBP`;
      await apiFuncs.getWithRetries<string>(url, 5);
      expect(fetchMock).toHaveBeenCalledTimes(6);
    });
});