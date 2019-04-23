import _ from 'lodash';
import { forkJoin, from } from 'rxjs';
import { filter, map, mergeMap, pluck } from 'rxjs/operators';
import { AmazonProduct, scrapeProductPage } from './scrapeProductPage';
import ObservableCrawler from './util/observableCrawler';

const isError = <T>(errorable: T | Error): errorable is Error =>
  errorable instanceof Error;

const crawlResultsPage = (
  productSearchPageUrl: string,
): Promise<AmazonProduct[]> =>
  new Promise(async (resolve, reject) => {
    try {
      const crawler = new ObservableCrawler({
        maxConnections: 10,
      });

      crawler.queue(productSearchPageUrl);

      crawler.crawlerResult$
        .pipe(
          pluck('$'),
          map($ => {
            const asins: string[] = $('#mainResults > ul')
              .find('li.s-result-item:not(AdHolder)')
              .map((_i, element) => {
                const asin = $(element)
                  .attr('data-asin')
                  .trim();

                return asin;
              })
              .get();

            return asins;
          }),
          mergeMap(asins =>
            forkJoin(
              _.map(asins, (asin: string) => from(scrapeProductPage(asin))),
            ),
          ),
          // this filter removes all errors, however TS can't detect this :(
          // so we also need a cast in subscribe
          filter(product => {
            // console.log(product);
            if (!isError(product)) {
              return true;
            }

            return false;
          }),
        )
        .subscribe(product => {
          if (!isError(product)) {
            resolve(product as (AmazonProduct[]));
          } else {
            reject(product);
          }
        });
    } catch (error) {
      reject(error);
    }
  });

const crawlAmazon = async () => {
  try {
    const scrapedProducts = await crawlResultsPage(
      'https://www.amazon.com/s/ref=lp_1292110011_nr_n_0?fst=as%3Aoff&rh=n%3A172282%2Cn%3A%21493964%2Cn%3A541966%2Cn%3A1292110011%2Cn%3A595048&bbn=1292110011&ie=UTF8&qid=1556035817&rnid=1292110011',
    );

    console.log(scrapedProducts);
  } catch (error) {
    console.error(error);
  }
};

export { crawlAmazon };
