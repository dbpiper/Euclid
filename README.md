# Euclid

A website dedicated to tracking consumer goods price information.
The original intention was to provide more detailed financial analytic
capabilities to something like [PC Part Picker's Price Trends](https://pcpartpicker.com/trends/price/memory/) as I found myself checking it very often as I have a personal interest in the price trends of things like:

* RAM
* Hard Drives
* GPUs
* ...

In addition, I have found myself very disappointed with the analytic capabilities of this tool, for example it doesn't even let me see the exact data points or numbers on the graph. Much less more detailed Statistics about the data. So this is the main purpose of Euclid.

However, upon reflection it seems that (at least upon first glance to me) the exact same mechanism that can be used to track *all* types of consumer goods. So things like Smartphone prices or Food prices can theoretically also be tracked which could prove interesting as well.

## [Style Guidelines](docs/style-guide.md)

## [Development Configuration](docs/development-configuration.md)

## Steps to run

1. Start the Prisma container by running `docker-compose up -d`.
2. Deploy the Prisma API by running `prisma deploy`.
