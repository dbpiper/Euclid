# Contributing Guide

## Table of Contents

- [Build System and Task Runners](#build-system-and-task-runners)
  - [Build System Overview](#build-system-overview)
  - [Advantages of the hybrid npm/gulp approach](#advantages-of-the-hybrid-npm/gulp-approach)
  - [Spawning Processes](#spawning-processes)
    - [Special Case for Spawning Processes](#special-case-for-spawning-processes)
- [Style Guide](#style-guide)
  - [Line Endings](#line-endings)
- [Git Usage and Branching Strategy](#git-usage-and-branching-strategy)
- [Development Configuration](https://github.com/dbpiper/Euclid/blob/docs/development-configuration.md)

## Build System and Task Runners

### Build System Overview

The build system in Euclid is comprised of two different, but related task running
systems: npm scripts and gulp, in addition to webpack for the client-side
bundling. Most web developers are familiar with npm scripts, and they have become
the de facto standard for task running on smaller projects. However, they are
quite bulky when trying to run lots of non-trivial complex tasks. Thus, a
proper, more fully-featured task runner like gulp is used to supplement npm
scripts in Euclid.

Essentially, npm scripts provide the task running API or the front-end interface
for the task running system. Gulp provides the back-end and is where most of
the complex logic is handled. Everything that can be done in gulp _should be_.

### Advantages of the hybrid npm/gulp approach

Commands are run via npm scripts, that is the "API" of the build process is
exposed via npm. Thus, for example to run the pre-commit scripts
from the terminal you would run `npm run preCommit`. This just
_happens_ to call a gulp task via `npx gulp preCommit`. This way
the build process is more familiar, and users/me don't have to
think about the fact that the tasks are running in gulp
instead of npm. Furthermore, this means that if there was some theoretical
problem with using gulp as the back-end, then we could simply switch it out
with no change to the exposed API, which is a **very** good thing!

This is also nice because _oh-my-zsh_ provides a [npm auto-completion
plugin](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins#np://github.com/robbyrussell/oh-my-zsh/kiwi/Plugins#npm)
but as far as I can tell does _not_ provide a gulp one. So this
makes using tasks much more user-friendly. Furthermore, this
method means that there is a clear distinction between
"public" tasks and "private" internal ones. The public ones
are exported and have an npm script API. The private ones are
_not_ exported and don't have a npm script API.

Another benefit of this approach, is that the npm script API
tasks can have **any** name desired, rather than the severe
restrictions that come from using functions as task using
the modern gulp style. This means that the gulp task back-end
have function-style names (no colons or dashes in the names)
and the npm script task front-end can have standard script-style names
(with colons and dashes).

### Spawning Processes

There are two main cases for handling spawning of processes using this approach

- [The standard approach](#advantages-of-the-hybrid-npm/gulp-approach)
  If the process will terminate on its own, without a signal such as `SIGTERM`
  then simply run it using a _gulp_ task which calls the appropriate _npm script_
  interface.

- [Special Case for Spawning Processes](#special-case-for-spawning-processes)
  If the process will not terminate on its own, then run it directly using the
  root _gulp_ task. That is, _don't_ use _npm scripts_ or other _gulp_ tasks at
  all! You must also make sure to `spawn` it **without** using a shell as it will
  not terminate in this case!

#### Special Case for Spawning Processes

If you need to run a non-self-terminating process that is, one that you must
manually/programmatically kill with a signal such as `SIGTERM` then you
must start the command running the server directly, using `spawn` or a wrapper
such as my `terminal-spawn` library.

For example: a `node` server, or the `serve` module or _Storybook_ via
`start-storybook`. In this case, the process must be run **directly** rather
than through npm. In other words the `gulp (root)` task **must** run the command
itself, bypassing the nice npm scrips API. In addition the command must be spawned
without using the `spawn` shell option as this would make it not terminate also.

This would look something like this, using my _terminal-spawn_ library:

```ts
terminalSpawn('npx serve -s build', {
  cwd: _clientDirectory,
  shell: false,
});
```

So if there is something that needs to be programmatically/manually killed
with a `SIGTERM` then it should be done in this way.

## Style Guide

- [SQL Style Guide](https://www.sqlstyle.guide) -- though no manual SQL should be _needed/written_.
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)
- [markdownlint for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) or [markdownlint for Node.js](https://github.com/DavidAnson/markdownlint)
- Using [Ryan Florence's React Directory Structure](https://gist.github.com/ryanflorence/daafb1e3cb8ad740b346)
  with some modifications for the client-side structure
- [JSDoc](https://github.com/jsdoc3/jsdoc) for Documentation I'm personally
  using [Document This](https://marketplace.visualstudio.com/items?itemName=joelday.docthis)
  which is a VS Code extension that will automatically generate JSDoc comments.
  This is optional, however it is very helpful.
- The JSON files should all be sorted in alphabetical order. I am personally
  using the VS Code extension [Sort JSON objects](https://marketplace.visualstudio.com/items?itemName=richie5um2.vscode-sort-json)
  to help with this, but it can be done manually if desired.

The project uses the above style guides in their own relevant domains. However,
it should be noted that it is _not_ following the suggestion from the Airbnb
style guide that JSX syntax should only be in .jsx files. The reason given
is that this is not standard JavaScript and thus does not belong in a .js file.
However, .jsx files are _not_ supported by React Native and are _not_
recommended by the React team. Furthermore, the create-react-app doesn't use
them anymore. So it seems prudent to follow the industry rather than Airbnb in
this case.

For Markdown some linting that is compatible with [markdownlint for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) _must_ be used. Since [markdownlint for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) uses [markdownlint for Node.js](https://github.com/DavidAnson/markdownlint) this is the obvious choice if you
have some objection to writing your Markdown in VS Code, say if you use NeoVim.
However, since I personally use VS Code, this will not be supported or
or documented by me.

_Note_ I actually do use NeoVim for some things, such as writing git commit messages.
However, I personally like to have a rendered preview which VS Code
provides that would require a ton of customization to achieve in NeoVim.
Furthermore copy-pasting links and general interaction with the clipboard
are _not_ NeoVim's strong suit.

### Line Endings

- All linebreaks should be LF and not CRLF.

  The main reason for this is
  compatibility with \*nix systems of which nearly any modern software project
  will have some. Specifically: Docker, WSL, Native, VMs, etc.

  For interoperability with these systems it is just easier to _always_ use LF
  for linebreaks. In addition [ESLint's linebreak-style rule](https://eslint.org/docs/rules/linebreak-style)
  is enabled in the Airbnb style guide which we are using.
  To enable LF always add the following lines to git config
  (that is `.git/config`):

  ```gitconfig
  autocrlf = false
  eol = lf
  ```

## Git Usage and Branching Strategy

This project uses the [GitHub flow branching style](https://help.github.com/en/articles/github-flow)
with the following changes:

- Nearly all branches should have associated issues and issue numbers
  to help maintain better documentation and tracking of changes.
- Branch names should start with "GH-" and the issue number such as
  `GH-42-compute-answer-to-the-universe`.
- All CI related changes done in one "session" or short-period of time, and
  with related fixes should be squashed with a [squash rebase](https://blog.carbonfive.com/2017/08/28/always-squash-and-rebase-your-git-commits/) in the branch where they happen.
  This is because CI's such as [Travis CI](https://travis-ci.com/) which is what
  Euclid uses make testing and running builds without making commits very difficult.
  So instead this policy exists so that there aren't tons of commits in there which
  were just trying to fix Travis.
- Once CI fixes are squashed they should be pushed to the branch, since it is a
  GitHub branch it must be done with force push, however this should be done in
  the safest way possible, namely [with lease and ref](https://www.jvt.me/posts/2018/09/18/safely-force-git-push/)
  That is you'd run the command: `git push --force-with-lease=HEAD` when ready
  to push the squashed CI changes. In some cases you may need to use
  `git push --force-with-lease` if the rebase tries to force you to do a merge
  due to git detecting a divergent head. In this case you should ensure that
  no one else has checked out your branch and that you understand the risks!
- Almost no changes that take more than a few hours/one day should be squashed
  as we want to maintain clean log of history, however this means that we run
  _very_ strict pre-commit and pre-push scripts. These scripts try to help ensure
  that **no** commits break the build and that everything passes linting, including commit message.
  Essentially we want to be able to see exactly what was done, why it was done,
  when it was done, and by whom. Squashing 5 commits that took place over a week
  violates the "when" and the "why" to some degree since it would just look like
  one big commit.
- All commits should be signed by the same GPG key that is used to unlock
  `git-crypt`, that is the one that you use when you run `git-crypt unlock`. This
  helps to establish a clear chain of _who_ is writing the commits and ensures
  that they are the same one who has been given access to the repository/git-crypt.
