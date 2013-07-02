# v2.0-rc2 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-rc1...2.0-rc2)) ~ July 2, 2013

  - Fixes a problem introduced by a change in the Rivets library that was causing the twitter `data-X` element attributes to get sucked up by the Rivets view, which caused Rivets to try to bind the nonexistent model attributes.

#### Bug Fixes

# v2.0-rc1 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-alpha2...2.0-rc1)) ~ June 30, 2013

#### Added Features

  - Adds 2.0.0 migration, which makes it possible to upgrade installations of the 1.x series of releases.

  - When the cursor hovers/blurs on listings in the record-browser panel in the editor, corresponding features on the map will highlight/unhighlight.

  - Fulltext searches in the editor will now match content in the "Slug" field, in addition to "Title" and "Body".

#### Changed Features

  - Changes all tag queries to use MySQL full-text search instead of regular expression matching. This improves performance, but means that tags have to be at least four characters in length in order by be indexed by MySQL.

  - Closing a static bubble by clicking on the "X" link now triggers the global `unselect` event, which has the effect of "closing" the record elsewhere in the exhibit (eg, unselecting map features, un-highlighting tagged spans in the narrative).

#### API Changes

  - Just before executing a query, the records API will now pass out the fully-formed `Omeka_Db_Select` instance by way of the `neatline_query_records` filter, which can be used by sub-plugins to implement custom API parameters.

  - For consistency with the rest of the theme, exhibit-specific themes now need to define a ```show.php``` file in order to override the default template, instead of ```template.php```.

  - Previously, custom templates for Omeka items imported into Neatline exhibits could be defined under ```neatline/exhibits``` in the public theme. Now, the code will instead look for these templates under the _exhibit-specific_ theme directory for the exhibit. For example, if an exhibit has a URL slug of ```exhibit-slug```, the item templates will now be searched for under ```neatline/exhibits/themes/exhibit-slug```, along with the rest of the exhibit-specific assets.

  - Previously, all layer definitions were included in a single ```layers.json``` file in the top-level plugin directory. This file has been moved to ```/layers/default.json```, and, instead of adding layers to ```defaults.json```, it's now possible to provide definitions for any number of layer groups in separate files. Eg, ```wms.json```, ```tilestream.json```, etc.

#### Bug Fixes

  - Fixes bug found by [Mark Olson](mailto:mark.olson@duke.edu) in the SVG-to-WKT conversion library that was causing SVG documents with complex polygonal elements (eg ```<polygon>```, ```<polyline>```) to fail to parse when pasted into the Neatline editor.

  - Previously, exhibits marked public were not getting filtered out of the public browse listings, and were visible to all users. This is fixed.

  - Fixes broken helper calls in the default exhibit show template the were causing the exhibit title and narrative fields not to be displayed above and below the exhibit.

  - When a vector layer is selected on the map and the map is panned or zoomed, the previously-selected layer is now re-selected after the new data arives.

  - When a vector layer has been selected by an externally-triggered event (for example, clicking on a record in the browser panel in the editor), the layer is now "durably" selected as if it had been clicked directly on the map. (Previously, features would unhighlight as they would if the layer were not selected if the cursor passed over a feature and then exited it.)

  - When a vector layer has been selected from without, it is now possible to unselect the layer as usual by clicking on the map's base layer.

# v2.0-alpha2 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-alpha1...2.0-alpha2)) ~ May 28, 2013

#### New Features

  - Adds three-tier ACL system to make Neatline easier to use in a classroom setting:

    - **Researcher** users are denied all Neatline-related privileges - they can't create, edit, or delete Neatline exhibits or records.

    - **Contributor** users can add/edit/delete their own exhibits and add/edit/delete records in their own exhibits, but can't make edit or delete exhibits that they don't own.

    - **Admin** and **Super** users are granted all privileges - they can create/edit/delete all Neatline exhibits and records, regardless of who originally created the content.

  - Makes it possible to create custom themes for individual Neatline exhibits:

    - Themes are defined by creating a directory with a name that matches an exhibit slug under ```neatline/exhibits/themes/```, relative to the root of the public theme. For example, if an exhibit has a slug of ```exhibit-slug```, Neatline will load theme assets from ```neatline/exhibits/themes/exhibit-slug```.

    - Inside the theme directory, a ```tempalate.php``` file can be defined. If present, this template will be rendered instead of the default ```show.php``` that ships with Neatline.

    - All ```.js``` and ```.css``` files in the directory will be queued in the public view for the exhibit after the core application assets.

  - The exhibits controller now respects the two separate options for admin and public page lengths (```per_page_admin```, ```per_page_public```).

#### Changed Features

  - In the ```item.php``` template used to determine the structure of the compiled item metadata in Neatline records, moves the file display below the default metadata output to conform with Omeka's default item show view.

  - When the static bubble is displayed in response to the cursor hovering on a map feature, and then the cursor leaves the exhibit without first leaving the feature (eg, when the edge of the map occludes part of the feature), hide the static bubble as if the feature had been unselected. This prevents the bubble from getting "stuck" until the cursor re-enters the exhibit.

#### Bug Fixes

  - Fixes bug in the Omeka "Import Items" workflow that was causing very large imports to fail. Previously, the background process was loading the entire batch of matched items in bulk; when the number of items got too high, the process would run out of memory and fail. Now, items are queried processed in 500-record pages.

  - Fixes bug that was causing paths to file attachments in item-backed records created by way of the "Import Items" flow to point to the local filesystem, not the web-accessible location of the files.

  - Fixes bugs in public exhibit browse view - changes the listings to point to the slug-based exhibit links and got rid of PHP warnings caused by malformed helper calls.

# v2.0-alpha1 ([commits](https://github.com/scholarslab/Neatline/compare/1.1.2...2.0-alpha1)) ~ May 13, 2013

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
