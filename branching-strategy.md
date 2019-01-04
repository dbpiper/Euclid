# Branching Strategy
  Generally follows the model established [here](https://nvie.com/posts/a-successful-git-branching-model/)
  or [here](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

  There are two main branches:

* master
* develop

  There may or may not also be a release/production branch,
  depending on the implementation details, for example:

* gh-pages

  There are three types of supporting branches:

* feature
* release
* hotfix

  Each branch should be named using a "/" as the separator between
  the supporting branch type and the name of the branch.

  For example "feature/search-page".

  A bugfix branch would be named as described [here](https://github.com/nvie/gitflow/issues/24)

  That is, it follows the naming conventions already described above, and simply
  appends the word "fix" to the name.
  So a bug fix would be named as follows: "feature/fix-dropdown-height-overflow"

  A feature with more than one person working on it would be done in the
  following manner: (based on [this](https://github.com/agis/git-style-guide))

* A "develop" branch for the feature would be made:
    - such as "feature/search-page/develop"
* Each member of the team working on the feature would then
  have their own branches like so:
    - "feature/search-page/david"

  A developer may choose to make a "sub-feature" branch.
  This should be done in the following manner (based on [gitflow](https://github.com/petervanderdoes/gitflow-avh/issues/45))

  Use the normal naming conventions, but there will be another section of the branch called "subfeature",
  or potentially "subrelease", or "subhotfix". Each of these can be named per the following example:

* "feature/search-page/subfeature/dropdown-component"

  If using the team naming conventions, then the example would be the same, simply replacing
  "feature/search-page" with "feature/search-page/david". That is,

* "feature/search-page/david/subfeature/dropdown-component"

    
  After the branch is complete it should be merged back in as described [here](https://stackoverflow.com/questions/8614112/how-to-close-off-a-git-branch/8617879)
