# Style Guide

* [SQL Style Guide](https://www.sqlstyle.guide) -- though no manual SQL should be *needed/written*.
* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
* [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)

The project uses the above style guides in their own relevant domains. However,
it should be noted that it is *not* following the suggestion from the Airbnb
style guide that JSX syntax should only be in .jsx files. The reason given
is that this is not standard JavaScript and thus does not belong in a .js file.
However, .jsx files are *not* supported by React Native and are *not*
recommended by the React team. Furthermore, the create-react-app doesn't use
them anymore. So it seems prudent to follow the industry rather than Airbnb in
this case.

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
