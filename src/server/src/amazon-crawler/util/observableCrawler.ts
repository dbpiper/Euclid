import Crawler, { CrawlerOptions, OnEventFunction, Response } from 'crawler';
import { Subject } from 'rxjs';

class ObservableCrawler extends Crawler {
  public crawlerResult$: Subject<Response>;

  constructor(options: CrawlerOptions) {
    const observableCallback = (
      error: Error | string | undefined,
      res: Response,
      done: () => void,
    ): void => {
      if (error) {
        this.crawlerResult$.error(error);
      } else {
        this.crawlerResult$.next(res);
      }
      done();
    };
    const promiseOptions = {
      ...options,
      callback: observableCallback,
    };
    super(promiseOptions);
    this.crawlerResult$ = new Subject();
  }

  public queue(optionsOrUri: CrawlerOptions | string) {
    super.queue(optionsOrUri);
  }
  public setLimiterProperty(limiter: string, property: string, value: number) {
    super.setLimiterProperty(limiter, property, value);
  }
  public on(event: string, callback: OnEventFunction) {
    super.on(event, callback);
  }
  public queueSize() {
    return super.queueSize();
  }
}

export default ObservableCrawler;
