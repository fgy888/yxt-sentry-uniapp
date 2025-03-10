import { BaseClient, Scope } from "@sentry/core";
import type {
  Event,
  EventHint,
  ParameterizedString,
  Severity,
  SeverityLevel,
} from '@sentry/types';
import { eventFromException, eventFromMessage } from './eventbuilder';

import { MiniappOptions } from "./backend";
import { SDK_NAME, SDK_VERSION } from "./version";

/**
 * All properties the report dialog supports
 */
// export interface ReportDialogOptions {
//   [key: string]: any;
//   eventId?: string;
//   dsn?: DsnLike;
//   user?: {
//     email?: string;
//     name?: string;
//   };
//   lang?: string;
//   title?: string;
//   subtitle?: string;
//   subtitle2?: string;
//   labelName?: string;
//   labelEmail?: string;
//   labelComments?: string;
//   labelClose?: string;
//   labelSubmit?: string;
//   errorGeneric?: string;
//   errorFormEntry?: string;
//   successMessage?: string;
//   /** Callback after reportDialog showed up */
//   onLoad?(): void;
// }

/**
 * The Sentry Miniapp SDK Client.
 *
 * @see MiniappOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
export class MiniappClient extends BaseClient<MiniappOptions> {
  /**
   * Creates a new Miniapp SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  public constructor(options: MiniappOptions) {
    super(options);
  }

  /**
 * @inheritDoc
 */
  public eventFromException(exception: unknown, hint?: EventHint): PromiseLike<Event> {
    return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
  }

  /**
   * @inheritDoc
   */
  public eventFromMessage(
    message: ParameterizedString,
    // eslint-disable-next-line deprecation/deprecation
    level: Severity | SeverityLevel = 'info',
    hint?: EventHint,
  ): PromiseLike<Event> {
    return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
  }

  /**
   * Sends user feedback to Sentry.
   */
  // public captureUserFeedback(feedback: UserFeedback): void {
  //   if (!this._isEnabled()) {
  //     DEBUG_BUILD && logger.warn('SDK not enabled, will not capture user feedback.');
  //     return;
  //   }

  //   const envelope = createUserFeedbackEnvelope(feedback, {
  //     metadata: this.getSdkMetadata(),
  //     dsn: this.getDsn(),
  //     tunnel: this.getOptions().tunnel,
  //   });

  //   // _sendEnvelope should not throw
  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   this._sendEnvelope(envelope);
  // }

  /**
   * @inheritDoc
   */
  protected _prepareEvent(event: Event, hint: EventHint, scope?: Scope): PromiseLike<Event | null> {
    event.platform = event.platform || 'javascript';
    //       event.sdk = {
    //   ...event.sdk,
    //   name: SDK_NAME,
    //   packages: [
    //     ...((event.sdk && event.sdk.packages) || []),
    //     {
    //       name: "npm:sentry-uniapp",
    //       version: SDK_VERSION
    //     }
    //   ],
    //   version: SDK_VERSION
    // };
    event.sdk = {
      ...event.sdk,
      name: SDK_NAME,
      packages: [
        ...((event.sdk && event.sdk.packages) || []),
        {
          name: SDK_NAME,
          version: SDK_VERSION
        }
      ],
      version: SDK_VERSION
    };
    return super._prepareEvent(event, hint, scope);
  }

  /**
   * Sends client reports as an envelope.
   */
  // private _flushOutcomes(): void {
  //   const outcomes = this._clearOutcomes();

  //   if (outcomes.length === 0) {
  //     DEBUG_BUILD && logger.log('No outcomes to send');
  //     return;
  //   }

  //   // This is really the only place where we want to check for a DSN and only send outcomes then
  //   if (!this._dsn) {
  //     DEBUG_BUILD && logger.log('No dsn provided, will not send outcomes');
  //     return;
  //   }

  //   DEBUG_BUILD && logger.log('Sending outcomes:', outcomes);

  //   const envelope = createClientReportEnvelope(outcomes, this._options.tunnel && dsnToString(this._dsn));

  //   // _sendEnvelope should not throw
  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   this._sendEnvelope(envelope);
  // }

  // /**
  //  * @inheritDoc
  //  */
  // protected _prepareEvent(event: Event, scope?: Scope, hint?: EventHint): PromiseLike<Event | null> {
  //   event.platform = event.platform || "javascript";
  //   event.sdk = {
  //     ...event.sdk,
  //     name: SDK_NAME,
  //     packages: [
  //       ...((event.sdk && event.sdk.packages) || []),
  //       {
  //         name: "npm:sentry-uniapp",
  //         version: SDK_VERSION
  //       }
  //     ],
  //     version: SDK_VERSION
  //   };

  //   return super._prepareEvent(event, scope, hint);
  // }

  /**
   * Show a report dialog to the user to send feedback to a specific event.
   * 向用户显示报告对话框以将反馈发送到特定事件。---> 小程序上暂时用不到&不考虑。
   *
   * @param options Set individual options for the dialog
   */
  // public showReportDialog(options: ReportDialogOptions = {}): void {
  //   // doesn't work without a document (React Native)
  //   console.log('sentry-uniapp 暂未实现该方法', options);
  // }
}
