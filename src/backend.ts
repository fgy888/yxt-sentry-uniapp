import { ClientOptions } from "@sentry/types";
// import { addExceptionMechanism, resolvedSyncPromise } from '@sentry/utils';

// import { eventFromString, eventFromUnknownInput } from './eventbuilder';
// import { XHRTransport } from "./transports/index";

/**
 * Configuration options for the Sentry Miniapp SDK.
 * Sentry Miniapp SDK 的配置选项。
 * @see MiniappClient for more information.
 */
export interface MiniappOptions extends ClientOptions {
  /**
   * A pattern for error URLs which should not be sent to Sentry.
   * To whitelist certain errors instead, use 
   * By default, all errors will be sent.
   */
  blacklistUrls?: Array<string | RegExp>;

  /**
   * A pattern for error URLs which should exclusively be sent to Sentry.
   * This is the opposite of 
   * By default, all errors will be sent.
   */
  whitelistUrls?: Array<string | RegExp>;

  extraOptions?: Object;
}