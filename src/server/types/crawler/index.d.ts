import crawler from 'crawler';

import cheerio from 'cheerio';
import { IncomingMessage } from 'http';
import Request, { Options } from 'request';

declare module 'crawler' {
  export type Encoding = string | null;

  export type HttpRequestMethods =
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH';

  export interface Response extends IncomingMessage {
    statusCode: number;
    $: typeof cheerio;
    charset: Encoding;
    body: string | Buffer;
    headers: object;
    request: Request;
    options: CrawlerOptions;
  }

  export type CallbackFunction = (
    error: Error | string | undefined,
    res: Response,
    done: () => void,
  ) => void;

  export interface CrawlerOptions extends Options {
    // Basic request options
    uri?: string;
    timeout?: number;
    callback?: CallbackFunction;

    // Schedule options
    maxConnections?: number;
    rateLimit?: number;
    priorityRange?: number;
    priority?: number;

    // Retry options
    retries?: number;
    retryTimeout?: number;

    // Server-side DOM options
    jQuery?: boolean | string | object;

    // Charset encoding
    forceUTF8?: boolean;
    incomingEncoding?: Encoding;

    // Cache
    skipDuplicates?: boolean;

    // Http headers
    rotateUA?: boolean;
    userAgent?: string | [];
    referer?: boolean;
    headers?: object;

    // Other options
    skipEventRequest?: boolean;
    autoWindowClose?: boolean;
    gzip?: boolean;
    method?: HttpRequestMethods;
    homogeneous?: boolean;
  }

  export type OnEventFunction = (options: CrawlerOptions) => void;

  declare class Crawler {
    constructor(options: CrawlerOptions);
    public queue(optionsOrUri: CrawlerOptions | string): void;
    public setLimiterProperty(
      limiter: string,
      property: string,
      value: number,
    ): void;
    public on(event: string, callback: OnEventFunction): void;
    public queueSize(): number;
  }

  export default Crawler;
}
