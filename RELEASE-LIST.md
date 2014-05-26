
# Release Checklist

This assumes that you have a working Neatline development environment going.
Specifically, this means:

* Omeka is in the parent directory two levels up (`../..`).

* You have [npm](https://www.npmjs.org/), [Bower](http://bower.io/),
  [Grunt](http://gruntjs.com/), [Composer](https://getcomposer.org/), and all
  the other stuff installed, configured, and ready to go.

* You have [Transifex Client](http://docs.transifex.com/developer/client/)
  installed and configured.

Once all of that is in place, we're ready to go.

## Create a new release

1. Bump the `version` in the `package.json` file to the new version.

1. Run `grunt release`. Behind the scenes, this task:

  - Propagates the version in `package.json` into `bower.json` and `plugin.ini`.
  - Minifies the static payloads and copies them into the `/dist` directories.
  - Generates a `.zip` archive under the `pkg` directory.
  - Commits the changes.
  - Generates a new tag for the release

1. Hallway test the zip.

1. `git push`

1. `git push --tags`

1. Upload the zip to http://omeka.org/add-ons/plugins/.

