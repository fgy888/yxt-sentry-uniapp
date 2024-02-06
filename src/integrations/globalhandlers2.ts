/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { convertIntegrationFnToClass, defineIntegration, getCurrentHub } from '@sentry/core';
import type {
    Client,
    // Event,
    Integration,
    IntegrationClass,
    //   IntegrationFn,
    // Primitive,
    // StackParser,
} from '@sentry/types';
import {
    //   addGlobalErrorInstrumentationHandler,
    //   addGlobalUnhandledRejectionInstrumentationHandler,
    // getLocationHref,
    // isErrorEvent,
    // isPrimitive,
    // isString,
    logger,
} from '@sentry/utils';

// import type { BrowserClient } from '../client';
// import { DEBUG_BUILD } from '../debug-build';
// import { eventFromUnknownInput } from '../eventbuilder';
// import { shouldIgnoreOnError } from '../helpers';
import { sdk } from "../crossPlatform";
declare const uni: any;  // uniapp


type GlobalHandlersIntegrationsOptionKeys = 'onerror' | 'onunhandledrejection';

type GlobalHandlersIntegrations = Record<GlobalHandlersIntegrationsOptionKeys, boolean>;

const INTEGRATION_NAME = 'GlobalHandlers';

const _globalHandlersIntegration = ((options: Partial<GlobalHandlersIntegrations> = {}) => {
    const _options = {
        onerror: true,
        onunhandledrejection: true,
        onpagenotfound: true,
        onmemorywarning: false, // h5会报错
        ...options,
    };

    return {
        name: INTEGRATION_NAME,
        setupOnce() {
            Error.stackTraceLimit = 50;
            if (_options.onerror) {
                logger.log("Global Handler attached: onError");
                _installGlobalOnErrorHandler();
            }

            if (_options.onunhandledrejection) {
                logger.log("Global Handler attached: onunhandledrejection");
                _installGlobalOnUnhandledRejectionHandler();
            }

            if (_options.onpagenotfound) {
                logger.log("Global Handler attached: onPageNotFound");
                _installGlobalOnPageNotFoundHandler();
            }

            if (_options.onmemorywarning) {
                logger.log("Global Handler attached: onMemoryWarning");
                _installGlobalOnMemoryWarningHandler();
            }

        },
        setup() {
            //   if (_options.onerror) {
            //     _installGlobalOnErrorHandler(client);
            //     globalHandlerLog('onerror');
            //   }
            //   if (_options.onunhandledrejection) {
            //     _installGlobalOnUnhandledRejectionHandler(client);
            //     globalHandlerLog('onunhandledrejection');
            //   }
        },
    };
})

// satisfies IntegrationFn;

export const globalHandlersIntegration = defineIntegration(_globalHandlersIntegration);

/**
 * Global handlers.
 * @deprecated Use `globalHandlersIntegration()` instead.
 */
// eslint-disable-next-line deprecation/deprecation
export const GlobalHandlers = convertIntegrationFnToClass(
    INTEGRATION_NAME,
    globalHandlersIntegration,
) as IntegrationClass<Integration & { setup: (client: Client) => void }> & {
    new(options?: Partial<GlobalHandlersIntegrations>): Integration;
};



// function _getUnhandledRejectionError(error: unknown): unknown {
//     if (isPrimitive(error)) {
//         return error;
//     }

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const e = error as any;

//     // dig the object of the rejection out of known event types
//     try {
//         // PromiseRejectionEvents store the object of the rejection under 'reason'
//         // see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
//         if ('reason' in e) {
//             return e.reason;
//         }

//         // something, somewhere, (likely a browser extension) effectively casts PromiseRejectionEvents
//         // to CustomEvents, moving the `promise` and `reason` attributes of the PRE into
//         // the CustomEvent's `detail` attribute, since they're not part of CustomEvent's spec
//         // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent and
//         // https://github.com/getsentry/sentry-javascript/issues/2380
//         else if ('detail' in e && 'reason' in e.detail) {
//             return e.detail.reason;
//         }
//     } catch { } // eslint-disable-line no-empty

//     return error;
// }

// /**
//  * Create an event from a promise rejection where the `reason` is a primitive.
//  *
//  * @param reason: The `reason` property of the promise rejection
//  * @returns An Event object with an appropriate `exception` value
//  */
// function _eventFromRejectionWithPrimitive(reason: Primitive): Event {
//     return {
//         exception: {
//             values: [
//                 {
//                     type: 'UnhandledRejection',
//                     // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
//                     value: `Non-Error promise rejection captured with value: ${String(reason)}`,
//                 },
//             ],
//         },
//     };
// }

/**
 * This function creates a stack from an old, error-less onerror handler.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function _eventFromIncompleteOnError(msg: any, url: any, line: any, column: any): Event {
//     const ERROR_TYPES_RE =
//         /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;

//     // If 'message' is ErrorEvent, get real message from inside
//     let message = isErrorEvent(msg) ? msg.message : msg;
//     let name = 'Error';

//     const groups = message.match(ERROR_TYPES_RE);
//     if (groups) {
//         name = groups[1];
//         message = groups[2];
//     }

//     const event = {
//         exception: {
//             values: [
//                 {
//                     type: name,
//                     value: message,
//                 },
//             ],
//         },
//     };

//     return _enhanceEventWithInitialFrame(event, url, line, column);
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function _enhanceEventWithInitialFrame(event: Event, url: any, line: any, column: any): Event {
//     // event.exception
//     const e = (event.exception = event.exception || {});
//     // event.exception.values
//     const ev = (e.values = e.values || []);
//     // event.exception.values[0]
//     const ev0 = (ev[0] = ev[0] || {});
//     // event.exception.values[0].stacktrace
//     const ev0s = (ev0.stacktrace = ev0.stacktrace || {});
//     // event.exception.values[0].stacktrace.frames
//     const ev0sf = (ev0s.frames = ev0s.frames || []);

//     const colno = isNaN(parseInt(column, 10)) ? undefined : column;
//     const lineno = isNaN(parseInt(line, 10)) ? undefined : line;
//     const filename = isString(url) && url.length > 0 ? url : getLocationHref();

//     // event.exception.values[0].stacktrace.frames
//     if (ev0sf.length === 0) {
//         ev0sf.push({
//             colno,
//             filename,
//             function: '?',
//             in_app: true,
//             lineno,
//         });
//     }

//     return event;
// }

// function globalHandlerLog(type: string): void {
//     logger.log(`Global Handler attached: ${type}`);
// }

// function getOptions(): { stackParser: StackParser; attachStacktrace?: boolean } {
//     const client = getClient<any>();
//     const options = (client && client.getOptions()) || {
//         //@ts-ignore
//         stackParser: () => [],
//         attachStacktrace: false,
//     };
//     return options;
// }



let _onErrorHandlerInstalled = false;
/** JSDoc */
function _installGlobalOnErrorHandler(): void {
    if (_onErrorHandlerInstalled) {
        return;
    }
    if (typeof uni === "object") {
        // 解决APP端无法捕获问题
        uni.onCreateVueApp((app: any) => {
            app.config.errorHandler = function (em: any, _vm: any, _info: any) {
                let emVal = ''
                if (!em.message) {
                    emVal = JSON.stringify(em)
                } else {
                    emVal = em.stack
                }
                console.error(emVal);
                const currentHub = getCurrentHub();
                const error = typeof emVal === 'string' ? new Error(emVal) : emVal
                currentHub.captureException(error);
            }
        })
    } else {
        if (!!sdk.onError) {
            const currentHub = getCurrentHub();
            // https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onError.html
            sdk.onError((err: string | object) => {
                // console.info("sentry-uniapp", error);
                const error = typeof err === 'string' ? new Error(err) : err
                currentHub.captureException(error);
            });
        }
    }
    _onErrorHandlerInstalled = true;
}

/** JSDoc */
let _onUnhandledRejectionHandlerInstalled = false;
function _installGlobalOnUnhandledRejectionHandler(): void {
    if (_onUnhandledRejectionHandlerInstalled) {
        return;
    }

    if (!!sdk.onUnhandledRejection) {
        const currentHub = getCurrentHub();
        /** JSDoc */
        interface OnUnhandledRejectionRes {
            reason: string | object;
            promise: Promise<any>;
        }

        // https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onUnhandledRejection.html
        sdk.onUnhandledRejection(
            ({ reason, promise }: OnUnhandledRejectionRes) => {
                // console.log(reason, typeof reason, promise)
                // 为什么官方文档上说 reason 是 string 类型，但是实际返回的确实 object 类型
                const error = typeof reason === 'string' ? new Error(reason) : reason
                currentHub.captureException(error, {
                    data: promise,
                });
            }
        );
    }

    _onUnhandledRejectionHandlerInstalled = true;
}

let _onPageNotFoundHandlerInstalled = false;
/** JSDoc */
function _installGlobalOnPageNotFoundHandler(): void {
    if (_onPageNotFoundHandlerInstalled) {
        return;
    }
    if (!!sdk.onPageNotFound) {
        const currentHub = getCurrentHub();
        sdk.onPageNotFound((res: { path: string }) => {
            const url = res.path.split("?")[0];
            currentHub.setTag("pagenotfound", url);
            currentHub.setExtra("message", JSON.stringify(res));
            currentHub.captureMessage(`页面无法找到: ${url}`);
        });
    }
    _onPageNotFoundHandlerInstalled = true;
}

let _onMemoryWarningHandlerInstalled = false;
/** JSDoc */
function _installGlobalOnMemoryWarningHandler(): void {
    if (_onMemoryWarningHandlerInstalled) {
        return;
    }

    if (!!sdk.onMemoryWarning) {
        const currentHub = getCurrentHub();

        sdk.onMemoryWarning(({ level = -1 }: { level: number }) => {
            let levelMessage = "没有获取到告警级别信息";

            switch (level) {
                case 5:
                    levelMessage = "TRIM_MEMORY_RUNNING_MODERATE";
                    break;
                case 10:
                    levelMessage = "TRIM_MEMORY_RUNNING_LOW";
                    break;
                case 15:
                    levelMessage = "TRIM_MEMORY_RUNNING_CRITICAL";
                    break;
                default:
                    return;
            }

            currentHub.setTag("memory-warning", String(level));
            currentHub.setExtra("message", levelMessage);
            currentHub.captureMessage(`内存不足告警`);
        });
    }

    _onMemoryWarningHandlerInstalled = true;
}