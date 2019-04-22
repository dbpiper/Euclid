import Globalize from 'globalize';
import _ from 'lodash';
// tslint:disable-next-line: no-submodule-imports
import { map } from 'rxjs/operators';
import ObservableCrawler from './util/observableCrawler';

// tslint:disable-next-line: no-unsafe-any no-var-requires
Globalize.load(require('cldr-data').entireSupplemental());
// tslint:disable-next-line: no-unsafe-any no-var-requires
Globalize.load(require('cldr-data').entireMainFor('en'));
// tslint:disable-next-line: no-unsafe-any no-var-requires
Globalize.loadTimeZone(require('iana-tz-data'));

Globalize.locale('en-US');

const parseStyleVariationsList = ($: CheerioAPI, styleDiv: Cheerio) =>
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
const removeEndingColonFromStyleName = (styleName: string) => {
  const lastColonI = styleName.lastIndexOf(':');
  // make sure it's the last character...
  if (lastColonI === styleName.length - 1) {
    return styleName.substring(0, lastColonI);
  }

  // something went wrong, just use the raw version
  return styleName;
};

const parseStyleList = ($: CheerioAPI) =>
  $('#twister_feature_div #twister > div')
    .map((_i, element) => {
      const styles = {
        styleType: removeEndingColonFromStyleName(
          $(element)
            .find('.a-row .a-form-label')
            .text()
            .trim(),
        ),
        selectedStyle: $(element)
          .find('.a-row .selection')
          .text()
          .trim(),
        variations: parseStyleVariationsList($, $(element).find('ul')),
      };

      return styles;
    })
    .get();

const parsePrice = ($: CheerioAPI) => {
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

const parseAmazonChoice = ($: CheerioAPI) =>
  $('#acBadge_feature_div')
    .find('.ac-badge-wrapper')
    .map((_i, element) =>
      $(element)
        .find('.ac-for-text .ac-keyword-link')
        .text()
        .trim(),
    )
    .get();

const parseIsPrime = ($: CheerioAPI) => {
  const primeText = $('.a-icon.a-icon-prime').attr('aria-label');

  if (primeText && primeText.length > 0) {
    return true;
  }

  return false;
};

const removeSeeTopTextBestSeller = (bestSellerText: string) => {
  const seeTopX = bestSellerText.lastIndexOf('(See Top ');

  if (seeTopX > 0) {
    return bestSellerText.substring(0, seeTopX);
  }

  // if we didn't find any see top x text, then just return the standard text
  return bestSellerText;
};

const findBestSellerNode = ($: CheerioAPI) => {
  const bestSellerTitleText = 'Best Sellers Rank';

  return $('.a-section')
    .find('table')
    .find(`*:contains(${bestSellerTitleText})`)
    .last()
    .parent()
    .find('td')
    .map((_i, element) =>
      removeSeeTopTextBestSeller(
        $(element)
          .text()
          .trim(),
      ).trim(),
    )
    .get();
};

const parseManufacturer = ($: CheerioAPI) => {
  const manufacturerTitleText = 'Manufacturer';
  return $('.a-section')
    .find('table')
    .find(`*:contains(${manufacturerTitleText})`)
    .find('td.a-size-base')
    .text()
    .trim();
};

const parseBrand = ($: CheerioAPI) => {
  const brandTitleText = 'Brand';
  return $('.a-section')
    .find('table')
    .find(`*:contains(${brandTitleText})`)
    .find('td.a-size-base')
    .text()
    .trim();
};

const parseManufacturerOrBrand = ($: CheerioAPI) => {
  const manufacturer = parseManufacturer($);
  const brand = parseBrand($);

  if (manufacturer) {
    return manufacturer;
  }

  return brand;
};

const parseModelNumber = ($: CheerioAPI) => {
  const modelNumberTitleText = 'Item model number';
  return $('.a-section')
    .find('table')
    .find(`*:contains(${modelNumberTitleText})`)
    .find('td.a-size-base')
    .text()
    .trim();
};

const parseImageUrl = ($: CheerioAPI) =>
  // plain 'src' gives us a binary blob, so we'll just use this for now
  // this can be investigated in the future if needed. However, since I have no
  // idea if we'll even use the image I'm using this hack for now.
  $('#landingImage').attr('data-old-hires');

const crawlPage = (productPath: string) => {
  const crawler = new ObservableCrawler({
    maxConnections: 10,
  });
  crawler.queue(`https://www.amazon.com/${productPath}`);
  crawler.queue(
    'https://web.archive.org/web/20190417162011/https://www.amazon.com/Thermacell-Cartridge-Repellent-Protection-Mosquito-Free/dp/B01BGHU7R6?th=1',
  );

  crawler.queue(
    'https://www.amazon.com/Toshiba-HDTB410XK3AA-Canvio-Portable-External/dp/B079D359S6/',
  );

  crawler.queue(
    'https://www.amazon.com/AmazonBasics-KU-0833-Wired-Keyboard/dp/B005EOWBHC/',
  );

  crawler.crawlerResult$
    .pipe(
      map(response => {
        const $ = response.$;

        const amazonPriceObject = parsePrice($);
        const amazonProduct = {
          url: response.options.uri,
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
          style: parseStyleList($),
          price: amazonPriceObject.price,
          onSale: amazonPriceObject.onSale,
          amazonChoice: parseAmazonChoice($),
          isPrime: parseIsPrime($),
          bestSeller: findBestSellerNode($),
          imageUrl: parseImageUrl($),
          manufacturerOrBrand: parseManufacturerOrBrand($),
          modelNumber: parseModelNumber($),
        };
        return amazonProduct;
      }),
    )
    .subscribe(amazonProduct => console.log(amazonProduct));
};

export { crawlPage };
