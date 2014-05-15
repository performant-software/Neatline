
# Release Checklist

This assumes that you have a working Neatline development environment going.
Specifically, this means:

* Omeka is in the parent directory two levels up (`../..`).

* You have [npm](https://www.npmjs.org/), [Bower](http://bower.io/),
  [Grunt](http://gruntjs.com/), [Composer](https://getcomposer.org/), and all
  the other stuff installed, configured, and ready to go.

* You have [Transifex Client](http://docs.transifex.com/developer/client/)
  installed and configured.

* You have run `git flow init` in the Neatline directory.

Once all of that is in place, we're ready

1. `VERSION=42.0.13` — We'll use this value later.

1. `git flow release start $VERSION`

1. Bump the version number by editing:

   * `plugin.ini`
   * `package.json`

1. `git commit -am "Version $VERSION"`

1. Update i18n:

   * `tx pull --force`
   * `grunt pot`
   * `grunt po2mo`
   * `git commit` (if there are new translations)

1. Update the `CHANGELOG.md`

1. `./bin/commit-static`

1. `grunt package`

1. `git commit` for the updated assets

1. rename the package file to include the version, not the date-stamp

1. quick check the zip

1. test the zip

1. `git flow release finish $VERSION`

1. `git push`

1. `git push --tags`

1. upload the zip to http://omeka.org/add-ons/plugins/.

