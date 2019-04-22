import { AmazonProduct, scrapeProductPage } from './scrapeProductPage';

const isAmazonProduct = (
  product: AmazonProduct | Error,
): product is AmazonProduct => !(product instanceof Error);

const crawlAmazon = async () => {
  try {
    const scrapedProduct = await scrapeProductPage(
      'Thermacell-Cartridge-Repellent-Protection-Mosquito-Free/dp/B01BGHU7R6',
    );

    if (isAmazonProduct(scrapedProduct)) {
      console.log(scrapedProduct);
    }
  } catch (error) {
    console.error(error);
  }
};

export { crawlAmazon };
