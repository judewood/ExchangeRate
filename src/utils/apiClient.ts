import { logger } from "../logger";
import { ApiResponse } from "../models/api";

export async function getWithRetries<T>(
  url: string,
  retries: number = 3
): Promise<ApiResponse<T> | undefined> {
  logger.debug(`GET request to:${url}`);
  const numAttempts = Math.min(retries, 10) + 1; //apply sanity limit
  const delays = getDelays(numAttempts);
  for (let counter = 0; counter < delays.length; counter++) {
    let response = await getApiResponse<T>(url);
    if (response?.status === 200) {
      return response;
    }
    if (notRetryable(response!.status)) {
      // eg if 404 then no point in retrying
      return undefined;
    }
    await waitMs(delays[counter]!);
  }
  return undefined;
}

export const getDelays = (numRetries: number): number[] => {
  let delaysMS: number[] = new Array(numRetries);
  for (let i = 0; i < delaysMS.length; i++) {
    if (i == 0) {
      delaysMS[0] = 1;
      continue;
    }
    delaysMS[i] = delaysMS[i - 1]! * 2;
  }
  return delaysMS;
};

export const notRetryable = (statusCode: number): boolean => {
  const retryStatuses = [408, 403, 500, 502, 503, 504, 522, 524];
  const cannotRetry = !retryStatuses.includes(statusCode);
  if (cannotRetry) {
    logger.warn(
      `Non retryable response ${statusCode} received from downstream`
    );
  }
  return cannotRetry;
};

async function waitMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getApiResponse<T>(
  url: string
): Promise<ApiResponse<T> | undefined> {
  let response = await fetch(url);
  if (response.ok) {
    logger.debug(`Get request completed: ${response.status}`);
    const result: ApiResponse<T> = {
      status: response.status,
      body: await response.json(),
    };
    return result;
  }
  const result: ApiResponse<T> = {
    status: response.status,
  };
  return result;
}
