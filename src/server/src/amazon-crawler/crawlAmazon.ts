// import CaptchaSolver from 'captcha-solver';
import _ from 'lodash';
// import sizeof from 'object-sizeof';
// import { forkJoin, from } from 'rxjs';
// import { filter, map, mergeMap, pluck } from 'rxjs/operators';
// import { AmazonProduct, scrapeProductPage } from './scrapeProductPage';
// import ObservableCrawler from './util/observableCrawler';

// const isError = <T>(errorable: T | Error): errorable is Error =>
//   errorable instanceof Error;

// const solveCheckCaptcha = ($: CheerioAPI) => {
//   const $('head > title').text();

//   return '';
// };

// const solveCaptcha = ($: CheerioAPI) => {};

// const solveCheckCaptcha = ($: CheerioAPI) => {
//   const title = $('head > title').text();
//   if (title.toLowerCase().includes('robot')) {
//     solveCaptcha($);
//   }
// };

// const crawlResultsPage = (
//   productSearchPageUrl: string,
// ): Promise<AmazonProduct[]> =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const crawler = new ObservableCrawler({
//         maxConnections: 10,
//       });

//       crawler.queue(productSearchPageUrl);

//       crawler.crawlerResult$
//         .pipe(
//           pluck('$'),
//           map($ => {
//             const asins: string[] = $('ul.s-result-list, div.s-result-list')
//               .find(
//                 'li.s-result-item:not(AdHolder), div.s-result-item:not(AdHolder)',
//               )
//               .map((_i, element) => {
//                 const asin = $(element)
//                   .attr('data-asin')
//                   .trim();

//                 return asin;
//               })
//               .get();

//             return asins;
//           }),
//           mergeMap(asins => {
//             const nonEmptyAsins = _.filter(asins, asin => asin.length > 0);
//             return forkJoin(
//               _.map(nonEmptyAsins, (asin: string) =>
//                 from(scrapeProductPage(asin)),
//               ),
//             );
//           }),
//           // this filter removes all errors, however TS can't detect this :(
//           // so we also need a cast in subscribe
//           filter(product => {
//             if (!isError(product)) {
//               return true;
//             }

//             return false;
//           }),
//         )
//         .subscribe(products => {
//           if (!isError(products)) {
//             resolve(products as (AmazonProduct[]));
//           } else {
//             reject(products);
//           }
//         });
//     } catch (error) {
//       reject(error);
//     }
//   });

// const crawlCategoryPage = (categoryPageUrl: string): Promise<AmazonProduct[]> =>
//   new Promise((resolve, reject) => {
//     try {
//       const crawler = new ObservableCrawler({
//         maxConnections: 10,
//       });

//       crawler.queue(categoryPageUrl);

//       crawler.crawlerResult$
//         .pipe(
//           pluck('$'),
//           map($ => {
//             const links: string[] = $('#leftNav > ul > div.a-row')
//               .find('li > span.a-list-item > a.a-link-normal')
//               .map((_i, element) => {
//                 const amazonBaseUrl = 'https://www.amazon.com';
//                 const link = `${amazonBaseUrl}${$(element)
//                   .attr('href')
//                   .trim()}`;

//                 return link;
//               })
//               .get();

//             return links;
//           }),
//           mergeMap(links => {
//             const nonEmptyLinks = _.filter(links, link => link.length > 0);
//             return forkJoin(
//               _.map(nonEmptyLinks, (link: string) =>
//                 from(crawlResultsPage(link)),
//               ),
//             );
//           }),
//           // this filter removes all errors, however TS can't detect this :(
//           // so we also need a cast in subscribe
//           filter(products => {
//             if (!isError(products)) {
//               return true;
//             }

//             return false;
//           }),
//         )
//         .subscribe(products => {
//           const productsFlat = _.flatten(products);
//           resolve(productsFlat);
//         });
//     } catch (error) {
//       reject(error);
//     }
//   });

const crawlAmazon = async () => {
  try {
    // const scrapedProducts = await crawlCategoryPage(
    //   // 'https://www.amazon.com/s/ref=lp_1292110011_nr_n_0?fst=as%3Aoff&rh=n%3A172282%2Cn%3A%21493964%2Cn%3A541966%2Cn%3A1292110011%2Cn%3A595048&bbn=1292110011&ie=UTF8&qid=1556035817&rnid=1292110011',
    //   'https://www.amazon.com/Memory-Cards-External-Storage/b/136-1842006-9564669?ie=UTF8&node=1292110011&ref_=sd_allcat_storage',
    // );
    // const scrapedProducts1 = await crawlResultsPage(
    //   'https://www.amazon.com/s/ref=lp_1292110011_nr_n_0?fst=as%3Aoff&rh=n%3A172282%2Cn%3A%21493964%2Cn%3A541966%2Cn%3A1292110011%2Cn%3A595048&bbn=1292110011&ie=UTF8&qid=1556132545&rnid=1292110011',
    // );
    // console.log(`scrapedProducts1 length:${scrapedProducts1.length}`);
    // const scrapedProducts2 = await crawlResultsPage(
    //   'https://www.amazon.com/s/ref=lp_1292110011_nr_p_n_date_0/133-3966120-4552305?fst=as%3Aoff&rh=n%3A172282%2Cn%3A%21493964%2Cn%3A541966%2Cn%3A1292110011%2Cp_n_date%3A1249033011&bbn=1292110011&ie=UTF8&qid=1556133727&rnid=1249031011',
    // );
    // console.log(`scrapedProducts2 length:${scrapedProducts2.length}`);
    // console.log(scrapedProducts);
    // console.log(sizeof(scrapedProducts));
  } catch (error) {
    console.error(error);
  }
};

export { crawlAmazon };
