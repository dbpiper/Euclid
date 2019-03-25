# Development Configuration

## Table of Contents

- [General Overview](#general-overview)
- [Setup Env Vars](#setup-env-vars)
- [git-crypt](#git-crypt)
- [Prisma](#prisma)
  - [Steps to Run](#steps-to-run)
- [Development Environments on Windows](#development-environments-on-windows)

## General Overview

The [CI script](https://github.com/dbpiper/Euclid/.travis.yml) is a great
introduction to everything that is needed to build and run Euclid.
In general you need:

- [git-crypt](https://github.com/AGWA/git-crypt)
- [NodeJS 11](https://nodejs.org)
- [Prisma](http://prisma.io/) - Though this is used from the package.json
  via `npx` for example: `npx prisma deploy`.
- An editor such as [VS Code](https://code.visualstudio.com/)
- Knowledge of how to use [`git rebase`](https://git-scm.com/docs/git-rebase) for
  [squashing CI commits](https://blog.carbonfive.com/2017/08/28/always-squash-and-rebase-your-git-commits/)
  and how to [**safely** push the changes to an issue branch](https://www.jvt.me/posts/2018/09/18/safely-force-git-push/).
- Ideally a good terminal-based editor such as [NeoVim](https://github.com/neovim/neovim/)
  for writing Git commit messages.

It is strongly recommended to use Linux for development as many of these tools
work **much** better on it than Windows. In fact, even on Windows I personally
used WSL rather than just raw `cmd.exe` as it is way better. I personally am
using Linux in a VirtualBox VM on Windows as I am not currently doing a dual-boot.

## Setup Env Vars

This project follows the philosophies of [_The Twelve-Factor App_](https://12factor.net/)
and its [config section](https://12factor.net/config), meaning that all
deployment information is stored in [dotenv files](https://www.npmjs.com/package/dotenv).
However, it uses a modification for simplicity, the configurations **are** grouped
together. Specifically, there are dotenv files for each deployment, so for
now it is my dev environment and the CI environment. This can technically be
anything, and this approach is only used as there are a limited amount of
deployments and it is simple, and works for now.

So to setup these environment variables do the following:

1. if one of the `.env` files in the `config/dotenvs` works for you, then
   just copy it into the root dir, it will be ignored by git and should just
   be used locally.
2. run the `config/replace-env-vars.sh` script, which does a text
   find-and-replace of the files with env vars in them that aren't code,
   essentially just YAML files for now. These generated files are also
   not checked-in.

All of the `process.env.${VARS}` in the JavaScript/TypeScript code will work
just fine out of the box assuming the completion of #1, so there is no need
to configure them.

## git-crypt

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
_Note_ the files must be staged using `git add FILENAME` in order for the
encryption to actually happen with `git-crypt`. Thus you would need
to do this _before_ you run the verification step (otherwise it would just
always say that the files are unencrypted :) ).

## Prisma

- Prisma's `docker-compose.yml` file should have the host set to
  `host.docker.internal`
  and _not_ `localhost` due an issue with host redirection of localhost in docker.
  See [Prisma cannot run command "prisma deploy" because prisma in docker cannot run](https://github.com/prisma/prisma/issues/2761) and [From inside of a Docker container, how do I connect to the localhost of the machine](https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach)

### Steps to Run

1. Start the Prisma container by running `docker-compose up -d`.
2. Deploy the Prisma API by running `prisma deploy`.

## Development Environments on Windows

### 1. WSL with `docker-machine`

WSL combined with a terminal emulator such as ConEmu is used for development.
This approach uses as few VMs as possible, and relies heavily on X Servers
running on Windows, specifically MobaXterm.

Actual code is written in the editor of choice such as VS Code, or even
NeoVim.

**Pros**:

- Doesn't use any VMs
- Is fast

**Cons**:

- Requires fighting with WSL and Windows constantly, i.e. unimplemented
  features, X11 GUI application problems, etc.
- Complicated to configure due to a ton of different applications running

#### Workflow

- WSL terminals running in ConEmu are used for accessing git, and running various
  npm scripts.
- Powershell is used to deploy the Prisma server using `docker-compose up -d`
  from the `src/client` directory and is used to manage the `docker-host`
  VM created by `docker-machine` with the Docker Toolbox.
- MobaXterm is used to run Cypress tests, since the
  alternative of using WSL terminal and launching an X11 window
  which connects to VcXsrv doesn't work correctly, specifically when this approach is used the Cypress windows breaks when anything is changed in the test cases.

### 2. Linux VM

This approach is very flexible and capable as it interacts with Windows
as little as possible! WSL is only used as a wrapper to SSH into the Linux
VM. Then everything is done in the terminal emulator such as ConEmu, just as with WSL in #1, however in this case there is almost no fighting with Windows or WSL!

**Pros**:

- No fighting with Windows or WSL!
- The power and flexibility of a full Linux environment!

**Cons**:

- Slightly slower due to virtualization
- Does require some fighting with VirtualBox, such as:
  - sharing the host directories and/or drives _only use for non-dev purposes!_
  - [enabling Symlinks in shared directories](https://stackoverflow.com/questions/23936458/correct-way-to-setup-virtualbox-4-3-to-use-symlinks-on-guest-for-meteor)
  - getting good performance from the VM
  - optionally getting access to the Linux guest using
    something like Samba
  - should use [`mirror`](https://github.com/stephenh/mirror) for
    mirroring files.

I am personally using #2 now as I have been struggling with #1 for awhile and have concluded that it is not worth the problems, since #2 exists.

[`mirror`](https://github.com/stephenh/mirror) should be setup for this workflow
to function. This way `git`, `npm install`, and tests can be run on the Linux
guest VM and development can happen in VS Code on the Windows host. Any changes
in either one will be sent over to the other and the two copies kept in sync.

This requires that the time be synchronized between the two!
In addition, there seems to be a bug with `mirror` and VS Code, so both must
be stopped in order to run `npm install` which makes this workflow very annoying.
