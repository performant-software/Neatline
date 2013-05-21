# v2.0-alpha2 (pending)

#### New Features

  - The exhibits controller now respects the two separate options for admin and public page lengths (```per_page_admin```, ```per_page_public```).

#### Changed Features

  - In the ```item.php``` template used to determine the structure of the compiled item metadata in Neatline records, moves the file display below the default metadata output to conform with Omeka's default item show view.

#### Bug Fixes

  - Fixes a problem in the Omeka item-import workflow that was causing imports of very large collections of items to fail. Previously, the background process was loading the entire batch of matched Omeka items in a single query; when the number of items got too high, the process would run out of memory and fail. Now, items are queried in 500-record pages, which means that the importer can handle arbitrarily large imports.

  - Fixes bug that was causing paths to file attachments in item-backed records created by way of the "Import Items" flow to point to the local filesystem, not the web-accessible location of the files.

  - Fixes bugs in public exhibit browse view - changes the listings to point to the slug-based exhibit links and got rid of PHP warnings caused by malformed helper calls.

#### API Changes

  - Gets rid of the ```getItemBody``` method on ```NeatlineRecord```, replaces it with the ```nl_getItemMarkup``` view helper.

  - Renames ```nl_link``` to ```nl_getExhibitLink```.

  - Renames ```nl_totalRecords``` to ```nl_getExhibitRecordCount```.

  - Renames ```nl_areExhibits``` to ```nl_exhibitsHaveBeenCreated```.

  - Renames ```nl_field``` to ```nl_getExhibitField```.

  - Renames ```nl_exhibit``` to ```nl_getExhibit```.

# v2.0-alpha1 ([commits](https://github.com/scholarslab/Neatline/compare/1.1.2...2.0-alpha1))

#### Architectural Changes

  - Migrates the codebase to Omeka 2.x.

  - Splits the functionality in the 1.x series into three separate plugins:

    - **[Neatline](https://github.com/scholarslab/Neatline)** - The core map-making toolkit and content management system.
    - **[NeatlineWaypoints](https://github.com/scholarslab/nl-widget-Waypoints)** - Adds list of sortable waypoints.
    - **[NeatlineSimile](https://github.com/scholarslab/nl-widget-Simile)** - The SIMILE timeline widget.

#### New Features

  - Adds support for real-time spatial querying using the MySQL spatial extensions. Whenever the user pans or zooms the map, the set of records on the map is automatically updated with just the subset of the collection that falls within the current viewport.

  - Makes it possible to import SVG documents created in vector editing tools like Adobe Illustrator or Inkscape and dynamically position them as first-class geometry on the map.

  - Adds an interactive "stylesheet" system (inspired by Mike Migurski's [Cascadenik](https://github.com/mapnik/Cascadenik)) that makes it possible to use a dialect of CSS to make bulk updates to large batches of records grouped together by tags.

  - Makes it possible to add custom base layers, which, among other things, makes it possible to annotate completely non-spatial entities - paintings, photographs, documents, and anything else that can be captured as an image

  - Adds a cluster of features to the editor that makes it easier to work with large collections of records - full-text search, viewport extent ("spatial") search, tag filtering, and paged browsing.

  - Adds JavaScript routing to the editor, which makes it possible to use the browser's Back and Forward buttons to move between different application states.

  - Makes it possible to configure the list of available base layers on a per-exhibit basis, instead of automatically including all base layers in all exhibits.

  - Adds support for more granular control over the colors and opacities of map geometries.

#### Changed Features

  - Improves the process by which Omeka items are imported into Neatline exhibits. Instead distinguishing between "Neatline" and "Omeka" records, _everything_ is a Neatline record, and any Neatline record can be linked to any Omeka item in the underlying collection.

  - Replaces CLEditor (the rich-text editor used on the "Title" and "Body" fields) with [CKEditor](http://ckeditor.com/), a more robust solution that makes it easier to create well-formatted record content and import video and audio media. Also adds a "fullscreen" editing mode for long-format content.

  - Makes it possible to add WMS overlays to exhibits by entering a WMS address and layer id directly into the edit form for a Neatline record (instead of linking the record to an Omeka item with a WMS service added by way of the old NeatlineMaps plugin).

#### Removed Features

  - Removes the interactive layout builder that made it possible to interactively drag-and-drop the positions and dimensions of the widgets in an exhibit. This was a brittle feature that made it difficult for theme designers to customize the look and feel of exhibits, something that's much easier in 2.0.

  - Removes the ability to use static images as the base layer for exhibits. This was an experimental feature that was significantly limited by the fact that the entire image was loaded in bulk into the browser JavaScript environment, which becomes increasingly unperformant as the size of the image grows. In 2.0, this feature is superseded by the ability to add custom base layers to exhibits an an abstract sense - this makes it possible to build exhibits on non-spatial WMS layers, which enjoy all the performance characteristics of regular spatial tile sets.

#### User-Interface Changes

  - Makes the exhibit browsing interface more intuitive: The main exhibit title links to the editor, not the public view.

  - Makes the editing interface more minimalistic: Reduces the width of the content management pane and eliminates the top navigation bar.

  - Simplifies the layout of the record editing form: Consolidates tabs to "Text," "Map," and "Style."

  - Makes the geometry add/edit/delete controls more semantic: Gets rid of the icon-bar, replaces with text-labelled radio buttons.

### API Changes

  - Rewrites the front-end (editing environment and public-facing exhibit application) using [Backbone.js](https://github.com/documentcloud/backbone) and [Marionette](https://github.com/marionettejs/backbone.marionette).

  - Adds a structured "sub-plugin" system that makes it easy for developers to implement custom functionality - everything from simple JavaScript widgets up to really extensive modifications that extend the core data model and add completely new interactions.

  - Converts the core record and exhibit controllers into a REST APIs that integrate smoothly with the Backbone.js front-end.

  - Changes the spatial data serialization format from KML to WKT, which can be indexed and queried by MySQL.

#### Development Workflow Changes

  - Uses [Grunt](http://gruntjs.com/) to manage dependencies, build the application, compile static assets, and run tests.

  - Moves to [Stylus](https://github.com/learnboost/stylus) for all application stylesheets.
