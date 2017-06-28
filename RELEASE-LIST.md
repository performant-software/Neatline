
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

- `git flow release start $VERSION`

- Bump the `version` in the `package.json` file to the new version.

- Update the `CHANGELOG.md`.

- Run `grunt build` and `grunt copy`, just to be sure.

- Run `grunt release`. Behind the scenes, this task:

  - Bumps the version in `bower.json` and `plugin.ini`.
  - Minifies the static payloads and copies them into the distribution directories.
  - Generates a `.zip` archive under the `pkg` directory.
  - Commits the changes.
  - Tags the release.

- Hallway test the zip.

- Is the CKEditor in `views/shared/javascripts/dist/production/ckeditor`?

- `git flow release finish $VERSION`

- `git push --all`

- `git push --tags`

- Upload the zip to http://omeka.org/add-ons/plugins/.

