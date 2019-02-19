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

* Prisma's `docker-compose.yml` file should have the host set to
  `host.docker.internal`
and *not* `localhost` due an issue with host redirection of localhost in docker.
See [Prisma cannot run command "prisma deploy" because prisma in docker cannot run](https://github.com/prisma/prisma/issues/2761) and [From inside of a Docker container, how do I connect to the localhost of the machine](https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach)

## Development Environments on Windows

### 1. WSL with `docker-machine`

WSL combined with a terminal emulator such as ConEmu is used for development.
This approach uses as few VMs as possible, and relies heavily on X Servers
running on Windows, specifically MobaXterm.

Actual code is written in the editor of choice such as VS Code, or even
NeoVim.

**Pros**:

* Doesn't use any VMs
* Is fast

**Cons**:

* Requires fighting with WSL and Windows constantly, i.e. unimplemented
features, X11 GUI application problems, etc.
* Complicated to configure due to a ton of different applications running

#### Workflow

* WSL terminals running in ConEmu are used for accessing git, and running various
npm scripts.
* Powershell is used to deploy the Prisma server using `docker-compose up -d`
from the `src/client` directory and is used to manage the `docker-host`
VM created by `docker-machine` with the Docker Toolbox.
* MobaXterm is used to run Cypress tests, since the
alternative of using WSL terminal and launching an X11 window
which connects to VcXsrv doesn't work correctly, specifically when this approach is used the Cypress windows breaks when anything is changed in the test cases.

### 2. Linux VM

This approach is very flexible and capable as it interacts with Windows
as little as possible! WSL is only used as a wrapper to SSH into the Linux
VM. Then everything is done in the terminal emulator such as ConEmu, just as with WSL in #1, however in this case there is almost no fighting with Windows or WSL!

**Pros**:

* No fighting with Windows or WSL!
* The power and flexibility of a full Linux environment!

**Cons**:

* Slightly slower due to virtualization
* Does require some fighting with VirtualBox, such as:
  * sharing the host directories and/or drives
  * [enabling Symlinks in shared directories](https://stackoverflow.com/questions/23936458/correct-way-to-setup-virtualbox-4-3-to-use-symlinks-on-guest-for-meteor)
  * getting good performance from the VM
  * optionally getting access to the Linux guest using
  something like Samba

I am personally using #2 now as I have been struggling with #1 for awhile and have concluded that it is not worth the problems, since #2 exists.

## Steps to run

1. Start the Prisma container by running `docker-compose up -d`.
2. Deploy the Prisma API by running `prisma deploy`.
