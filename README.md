# Euclid
A website dedicated to tracking PC part price information.

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


## Development Setup

* PostgreSQL service must be started by running `sudo service postgresql start`.
* Prisma's `docker-compose.yml` file should have the host set to `host.docker.internal`
and *not* `localhost` due an issue with host redirection of localhost in docker.
See [Prisma cannot run command "prisma deploy" because prisma in docker cannot run](https://github.com/prisma/prisma/issues/2761)
