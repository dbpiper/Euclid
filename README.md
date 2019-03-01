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

**[Contributing](docs/CONTRIBUTING.md)**

**[Development Configuration](docs/development-configuration.md)**

## Steps to run

See [Development Configuration](docs/development-configuration.md) for
information on what is needed to work on the project. Especially see, the
[CI script](https://github.com/dbpiper/Euclid/.travis.yml) as it provides
consistent up-to-date information on exactly what is needed.

**Essentially you need to:**

1. Get permission to access the project as we use [`git-crypt`](https://github.com/AGWA/git-crypt)
to encrypt sensitive files. Then we have to add your GPG key to the project.
2. Clone the repository and unlock the encrypted files with `git-crypt unlock`.
3. run `npm run installStandard` to install the packages, or `npm run installFromLock`
if you want to use the `package-lock.json` files instead.
4. Setup the docker containers as detailed in the files above.
5. Pull the data into the server by running the following inside
the `src/server` directory: `npm run download-data`.
6. Then run `npm run start` from inside both the client and server directories.
7. The site will be running on `localhost:5000`.
