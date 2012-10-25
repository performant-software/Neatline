
# Release Checklist

It's easiest to start with a fresh repository, so the instructions start there.

1. `VERSION=42.0.13` — We'll use this value later.
1. `git clone git://github.com/omeka/Omeka.git` — We need Omeka for generating
  translations.
1. `cd omeka/plugins`
1. `git clone git@github.com:scholarslab/Neatline.git`
1. `cd Neatline`
1. `git flow init` — Don't forget to use `dev` for the development branch.
1. `git flow release start $VERSION`
1. Bump the version number by editing:
   * `plugin.ini`
1. `git commit`
1. Update i18n:
   * `tx pull`
   * `ant update-pot build-mo` (if there are new translations)
   * `git commit` (if there are new translations)
1. `ant package`
1. `git commit` for the updated assets
1. rename the package file to include the version, not the date-stamp
1. quick check the zip
1. test the zip
1. `git flow release finish $VERSION`
1. `git push`
1. upload the zip to http://omeka.org/add-ons/plugins/.

