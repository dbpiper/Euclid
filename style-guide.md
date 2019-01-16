# Style Guide

* [SQL Style Guide](https://www.sqlstyle.guide) -- though no manual SQL should be *needed/written*.
* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)
* [markdownlint for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) or [markdownlint for Node.js](https://github.com/DavidAnson/markdownlint)
* Using [Ryan Florence's React Directory Structure](https://gist.github.com/ryanflorence/daafb1e3cb8ad740b346) with some modifications for the client-side structure

The project uses the above style guides in their own relevant domains. However,
it should be noted that it is *not* following the suggestion from the Airbnb
style guide that JSX syntax should only be in .jsx files. The reason given
is that this is not standard JavaScript and thus does not belong in a .js file.
However, .jsx files are *not* supported by React Native and are *not*
recommended by the React team. Furthermore, the create-react-app doesn't use
them anymore. So it seems prudent to follow the industry rather than Airbnb in
this case.

For Markdown some linting that is compatible with [markdownlint for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) *must* be used. Since [markdownlint for VS Code](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) uses [markdownlint for Node.js](https://github.com/DavidAnson/markdownlint) this is the obvious choice if you
have some objection to writing your Markdown in VS Code, say if you use VIM.
However, since I personally use VS Code, this will not be supported or
or documented by me.

*Note* I actually do use VIM for some things, such as writing git commit messages. However, I personally like to have a rendered preview which VS Code
provides that would require a ton of customization to achieve in VIM.
Furthermore copy-pasting links and general interaction with the clipboard
are *not* VIM's strong suit.

## Line Endings

* All linebreaks should be LF and not CRLF.

  The main reason for this is
compatibility with *nix systems of which nearly any modern software project
will have some. Specifically: Docker, WSL, Native, VMs, etc.

  For interoperability with these systems it is just easier to *always* use LF
for linebreaks. In addition [ESLint's linebreak-style rule](https://eslint.org/docs/rules/linebreak-style)
is enabled in the Airbnb style guide which we are using.
To enable LF always add the following lines to git config
(that is `.git/config`):

  ```gitconfig
  autocrlf = false
  eol = lf
  ```
