# Style Guide

* [SQL Style Guide](https://www.sqlstyle.guide) -- though no manual SQL should be *needed/written*.

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
