import Globalize from 'globalize';
import _ from 'lodash';
import moment from 'moment';
import { map } from 'rxjs/operators';
import ObservableCrawler from './util/observableCrawler';

// tslint:disable-next-line: no-unsafe-any no-var-requires
Globalize.load(require('cldr-data').entireSupplemental());
// tslint:disable-next-line: no-unsafe-any no-var-requires
Globalize.load(require('cldr-data').entireMainFor('en'));
// tslint:disable-next-line: no-unsafe-any no-var-requires
Globalize.loadTimeZone(require('iana-tz-data'));

Globalize.locale('en-US');

export interface AmazonProduct {
  asin: string;
  url: string;
  name: string;
  seller: string;
  rating: number;
  customerReviews: number;
  answeredQuestions: number;
  style: object;
  price: string;
  onSale: boolean;
  amazonChoice: string[];
  isPrime: boolean;
  bestSeller: string[];
  imageUrl: string;
  manufacturerOrBrand: string;
  modelNumber: string;
  date: number;
}

const _parseStyleVariationsList = ($: CheerioAPI, styleDiv: Cheerio) =>
  styleDiv
    .find('.twisterTextDiv.text')
    .map((_i, element) =>
      $(element)
        .text()
        .trim(),
    )
    .get();

// this is helpful so that the Amazon style categories we store don't have
// an ugly colon at the end; that is we want 'Style' not 'Style:'.
const _removeEndingColonFromStyleName = (styleName: string) => {
  const lastColonI = styleName.lastIndexOf(':');
  // make sure it's the last character...
  if (lastColonI === styleName.length - 1) {
    return styleName.substring(0, lastColonI);
  }

  // something went wrong, just use the raw version
  return styleName;
};

const _parseStyleList = ($: CheerioAPI) =>
  $('#twister_feature_div #twister > div')
    .map((_i, element) => {
      const styles = {
        styleType: _removeEndingColonFromStyleName(
          $(element)
            .find('.a-row .a-form-label')
            .text()
            .trim(),
        ),
        selectedStyle: $(element)
          .find('.a-row .selection')
          .text()
          .trim(),
        variations: _parseStyleVariationsList($, $(element).find('ul')),
      };

      return styles;
    })
    .get();

const _parsePrice = ($: CheerioAPI) => {
  // the price if it is a "Deal of the Day" item (on sale)
  const dealAmazonPrice = $('#priceblock_dealprice')
    .text()
    .trim();
  // standard 'Amazon' price
  const amazonPrice = $('#priceblock_ourprice')
    .text()
    .trim();

  // if it's on sale then we want to use that price...
  if (dealAmazonPrice) {
    return {
      price: dealAmazonPrice,
      onSale: true,
    };
  }

  // normally we'll just want the standard price though
  return {
    price: amazonPrice,
    onSale: false,
  };
};

const _parseAmazonChoice = ($: CheerioAPI) =>
  $('#acBadge_feature_div')
    .find('.ac-badge-wrapper')
    .map((_i, element) =>
      $(element)
        .find('.ac-for-text .ac-keyword-link')
        .text()
        .trim(),
    )
    .get();

const _parseIsPrime = ($: CheerioAPI) => {
  const primeText = $('.a-icon.a-icon-prime').attr('aria-label');

  if (primeText && primeText.length > 0) {
    return true;
  }

  return false;
};

const _removeSeeTopTextBestSeller = (bestSellerText: string) => {
  const seeTopX = bestSellerText.lastIndexOf('(See Top ');

  if (seeTopX > 0) {
    return bestSellerText.substring(0, seeTopX);
  }

  // if we didn't find any see top x text, then just return the standard text
  return bestSellerText;
};

const _findBestSellerNode = ($: CheerioAPI) => {
  const bestSellerTitleText = 'Best Sellers Rank';

  return $('.a-section')
    .find('table')
    .find(`*:contains(${bestSellerTitleText})`)
    .last()
    .parent()
    .find('td > span')
    .find('span')
    .map((_i, element) =>
      _removeSeeTopTextBestSeller(
        $(element)
          .text()
          .trim(),
      ).trim(),
    )
    .get();
};

const _parseManufacturer = ($: CheerioAPI) => {
  const manufacturerTitleText = 'Manufacturer';
  return $('.a-section')
    .find('table')
    .find(`*:contains(${manufacturerTitleText})`)
    .find('td.a-size-base')
    .text()
    .trim();
};

const _parseBrand = ($: CheerioAPI) => {
  const brandTitleText = 'Brand';
  return $('.a-section')
    .find('table')
    .find(`*:contains(${brandTitleText})`)
    .find('td.a-size-base')
    .text()
    .trim();
};

const _parseManufacturerOrBrand = ($: CheerioAPI) => {
  const manufacturer = _parseManufacturer($);
  const brand = _parseBrand($);

  if (manufacturer) {
    return manufacturer;
  }

  return brand;
};

const _parseModelNumber = ($: CheerioAPI) => {
  const modelNumberTitleText = 'Item model number';
  return $('.a-section')
    .find('table')
    .find(`*:contains(${modelNumberTitleText})`)
    .find('td.a-size-base')
    .text()
    .trim();
};

const _parseImageUrl = ($: CheerioAPI) =>
  // plain 'src' gives us a binary blob, so we'll just use this for now
  // this can be investigated in the future if needed. However, since I have no
  // idea if we'll even use the image I'm using this hack for now.
  $('#landingImage').attr('data-old-hires');

const scrapeProductPage = (asin: string) =>
  new Promise<AmazonProduct | Error>((resolve, reject) => {
    const crawler = new ObservableCrawler({
      maxConnections: 10,
    });
    crawler.queue(`https://www.amazon.com/dp/${asin}/`);

    crawler.crawlerResult$
      .pipe(
        map(response => {
          const $ = response.$;
          const url = response.options.uri;

          const amazonPriceObject = _parsePrice($);
          if (url) {
            const amazonProduct: AmazonProduct = {
              asin,
              url,
              name: $('#productTitle')
                .text()
                .trim(),
              seller: $('#bylineInfo')
                .text()
                .trim(),
              rating: Globalize.parseNumber(
                $('.a-icon-alt')
                  .text()
                  .trim()
                  .split(' ')[0],
              ),
              customerReviews: Globalize.parseNumber(
                $('#acrCustomerReviewLink #acrCustomerReviewText')
                  .first()
                  .text()
                  .trim()
                  .split(' ')[0],
              ),
              // we need to use parseFloat here as it will ignore non-numeric
              // characters, whereas Number constructor and Globalize.parseNumber
              // will give 'NaN'; since if there are more than 1000 answers instead
              //  of a real number here Amazon gives us '1000+'.
              answeredQuestions: parseFloat(
                $('#ask_feature_div .a-size-base')
                  .text()
                  .trim()
                  .split(' ')[0],
              ),
              style: _parseStyleList($),
              price: amazonPriceObject.price,
              onSale: amazonPriceObject.onSale,
              amazonChoice: _parseAmazonChoice($),
              isPrime: _parseIsPrime($),
              bestSeller: _findBestSellerNode($),
              imageUrl: _parseImageUrl($),
              manufacturerOrBrand: _parseManufacturerOrBrand($),
              modelNumber: _parseModelNumber($),
              date: moment.utc().unix(),
            };
            return amazonProduct;
          }

          // something went wrong; we'll just ignore this product
          return undefined;
        }),
      )
      .subscribe(amazonProduct => {
        if (amazonProduct) {
          resolve(amazonProduct);
        } else {
          reject(new Error(`unable to scrape product: ${asin}`));
        }
      });
  });

export { scrapeProductPage };
