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

## Style Guidelines

[Software Style Guide](style-guide.md)

## Tools

### Tern.js

I have chosen to use Tern.js to provide type information to the project
rather than using TypeScript (which was the original plan). This
was based on reading [Eric Elliott's opinions on the topic](https://medium.com/@_ericelliott/yep-i-suspect-a-large-number-of-converts-are-just-beginning-to-wake-up-to-the-typescript-hangover-978d1708e36e)
essentially that TypeScript has a lot of drawbacks and a high cost relative
to its benefits and that you can get many of the same benefits without
the cost by using Tern.js. He talked about this in [You Might Not Need TypeScript (or Static Types)](https://medium.com/javascript-scene/you-might-not-need-typescript-or-static-types-aa7cb670a77b)
a few years ago also.

### git-crypt

This project encrypts secret information such as: API keys, usernames, and
passwords using the `git-crypt` tool. Simply install it and then someone
who already has access (such as me) will need to use the command
`git-crypt add-gpg-user USER_ID` and commit the change to the repo.
The `USER_ID` parameter is an identifier for the gpg key that
you will be using to unlock the repo with.

Then you simply clone the repo as usual and run `git-crypt unlock` to
get access to the secret files.

Files that contain sensitive information should be encrypted.

To encrypt files add a rule in `.gitattributes` for the file.
For example adding:

  ```gitattributes
  *-secret* filter=git-crypt diff=git-crypt
  ```

to `.gitattributes` encrypts all files with "-secret" somewhere in their name.

They should be verified as encrypted by using the
`git crypt status` command, or
[manually](https://github.com/AGWA/git-crypt/issues/129).
Only once they have been verified should they be committed and pushed.
*Note* the files must be staged using `git add FILENAME` in order for the
encryption to actually happen with `git-crypt`. Thus  you would need
to do this *before* you run the verification step (otherwise it would just
always say that the files are unencrypted :) ).

## Development Setup

* PostgreSQL service must be started by running `sudo service postgresql start`.
* Prisma's `docker-compose.yml` file should have the host set to
  `host.docker.internal`
and *not* `localhost` due an issue with host redirection of localhost in docker.
See [Prisma cannot run command "prisma deploy" because prisma in docker cannot run](https://github.com/prisma/prisma/issues/2761)

## Steps to run

1. PostgreSQL service must be started by running `sudo service postgresql start`.
2. Start the Prisma container by running `docker-compose up -d`.
3. Deploy the Prisma API by running `prisma deploy`.
