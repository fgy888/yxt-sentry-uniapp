import { createTransport } from '@sentry/core';
import type { Transport, TransportMakeRequestResponse, TransportRequest } from '@sentry/types';
import { SyncPromise } from '@sentry/utils';
import { sdk } from "../crossPlatform";

// import type { BrowserTransportOptions } from './types';

/**
 * The DONE ready state for XmlHttpRequest
 *
 * Defining it here as a constant b/c XMLHttpRequest.DONE is not always defined
 * (e.g. during testing, it is `undefined`)
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState}
 */
// const XHR_READYSTATE_DONE = 4;

/**
 * Creates a Transport that uses the XMLHttpRequest API to send events to Sentry.
 */
export function makeXHRTransport(options: any): Transport {
  function makeRequest(request: TransportRequest): PromiseLike<TransportMakeRequestResponse> {
    return new SyncPromise((resolve: any, reject: any) => {
      const http = sdk.request || sdk.httpRequest;
      http({
        url: options.url,
        method: "POST",
        data: request.body,
        header: options.headers,
        // header: {
        //   "content-type": "application/json"
        // },
        success(res: { statusCode: number, header: any }): void {
          // resolve({
          //   status: eventStatusFromHttpCode(res.statusCode)
          // });
          resolve({
            statusCode: res.statusCode,
            headers: {
              'x-sentry-rate-limits': res.header['X-Sentry-Rate-Limits'],
              'retry-after': res.header['Retry-After'],
            },
          });
        },
        fail(error: object): void {
          reject(error);
        }
      });
    });
  }

  return createTransport(options, makeRequest);
}
