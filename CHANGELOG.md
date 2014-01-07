## v2.2.0 ([commits](https://github.com/scholarslab/Neatline/compare/2.1.3...2.2.0)) ~ Pending

#### Added Features

  - When Omeka items are imported into Neatline, plain-text WKT or KML values in the Dublin Core "Coverage" field are now automatically imported Neatline's `coverage` field and display on the map. (Previously, this only worked if the coverage on the item was created with the Neatline Features plugin.)

  - Adds a link to the Neatline exhibits browse page to the public navigation.

  - Adds a "View the item in Omeka" link to the default template used to represent Omeka items in Neatline exhibits.

  - Makes it possible to add both vector annotations and WMS layers to the same Neatline record.

  - In the editor, the map is now bidirectionally synchronized with the "Coverage" input on the record edit form. For example, if WKT is pasted into the input, the map will automatically update the edit layer to display the new coverage.

#### Performance Improvements

  - Optimizes the records API so that it avoids re-transmitting records that have already been pushed to the client by previous queries. This significantly improves performance in exhibits that have records with large quantities of metadata - e.g., map geometries derived from SVG documents with many thousands of points.

  - Patches up a memory leak on the map view caused by marooned references to deleted layers on the cursor control instances.

  - Fixes fullscreen, white "flashes" that occasionally occurred in the editor when using Chrome on Macbook Pros with retina displays, which were caused by a bug in Chrome related to CSS transitions on scrollable, fixed-position divs.

#### User-Interface Changes

  - Touches up the UI and styling in the editor interface - changes the body font, adds in fieldset legends in the "Map" and "Text" tabs, increases the height of the "Coverage" textarea, adds darkened background color to focused text inputs.

#### Bug Fixes

  - Fixes a bug that caused the Omeka item search feature in the record form to display the the title of an item's parent _collection_, not the item itself, when the item belonged to a collection.

  - Fixes a bug that caused modal windows in the editor (eg, the record delete confirmation pop-up) to get stuck on the screen if the user changed the route while the modal was open. 

## v2.1.3 ([commits](https://github.com/scholarslab/Neatline/compare/2.1.2...2.1.3)) ~ December 2, 2013

#### Bug Fixes

  - Display import items link for Contributor users.

## v2.1.2 ([commits](https://github.com/scholarslab/Neatline/compare/2.1.1...2.1.2)) ~ October 1, 2013

#### Added Features

  - Makes it possible to set the number of zoom levels available on the map when an exhibit is using a static image base layer.

#### Changed Features

  - Gets rid of the auto-expanding zoom level bar on the map, which makes it possible to use extremely high numbers of zoom levels (eg, 50-100) without the bar extending down below the bottom of the screen.

  - Only display the layer switcher widget when the map is using a spatial layer, since it's useless in exhibits using static-image layers (of which there can never be more than one).

## v2.1.1 ([commits](https://github.com/scholarslab/Neatline/compare/2.1.0...2.1.1)) ~ September 30, 2013

#### Bug Fixes

  - Fixes a bug that caused certain interactions with the Waypoints and SIMILE widgets to stop working in fullscreen mode.

  - Fixes a bug that made the fullscreen view inaccessible to public users.

## v2.1.0 ([commits](https://github.com/scholarslab/Neatline/compare/2.0.4...2.1.0)) ~ September 25, 2013

#### Added Features

  - Re-adds a "fullscreen" exhibit mode from 1.x, which fills the entire screen with the Neatline exhibit and hides the regular theme markup.

  - In the record edit form, the "Save" and "Delete" buttons are now fixed at the bottom of the screen, making it possible to save the record without first having to scroll to the bottom of the form.

  - When items are imported from Omeka, coverage data created with Neatline Features is now automatically inserted into the corresponding Neatline records.

#### Changed Features

  - Assorted UX tweaks in the editor associated with the move to Bootstrap 3 - makes the "New Record" button larger, displays more of the record body content in the browse view, makes the close "X" button larger on the record edit forms.

  - Contributor users are now able to view other users' non-public exhibits, which follows the general pattern for other resource types (eg, items).

#### Bug Fixes

  - Fixes a set of minor problems that was causing features not to unhighlight on mouseleave under certain circumstances (eg, when a new batch of records is rendered on the map while the cursor is hovering on a feature).

  - Fixes a bug that caused post-2.0 migrations not to run when upgrading from a 2.0 pre-release version (eg, 2.0-alpha2, 2.0-rc3, etc).

  - Fixes a bug that caused Omeka item imports to fail when using the Amazon S3 storage adapter.

#### API Changes

  - Upgrates Bootstrap to v3.0.0-rc2.

#### Repository Changes

  - Changes default column width in all source files from 76 -> 80 characters.

## v2.0.4 ([commits](https://github.com/scholarslab/Neatline/compare/2.0.4...2.0.4)) ~ August 14, 2013

#### Bug Fixes

  - Fixes a class capitalization typo that was causing failure notices to be erroneously displayed afted deleting records under some versions of PHP.

## v2.0.3 ([commits](https://github.com/scholarslab/Neatline/compare/2.0.2...2.0.3)) ~ August 9, 2013

#### Bug Fixes

  - Resolves issue that was causing item-import queries to fail when the asynchronous background process adapter was set in the `config.ini`.

## v2.0.2 ([commits](https://github.com/scholarslab/Neatline/compare/2.0.1...2.0.2)) ~ August 7, 2013

#### Added Features

  - Makes it possible to turn spatial querying on and off on a per-exhibit basis. This makes it possible to avoid the added load on the server incurred by real-time querying for exhibits that don't need it (eg, when there are just a handful of records).

#### Changed Features

  - Increases up the size of the "SVG" input textarea to make it easier to see the SVG markup after it's been pasted in.

  - Gets rid of HTML sanitization on exhibit and record models that was scrubbing out `data-neatline-slug` attributes in the markup.

#### Bug Fixes

  - Fixes bug that was making it impossible to paste values from the clipboard into the hex value input boxes for the color fields in the "Style" tab.

  - Fixes a problem that was causing item imports to fail when other plugins were installed that made use of the `public_show_items` hook (eg, Coins).

  - Fixes performance problems in Chrome related to hardware-acceleration styles on OpenLayers tile images.

#### API Changes

  - Upgrades OpenLayers to v2.13.1.

  - Upgrades jQuery to v2.0.3.

## v2.0.1 ([commits](https://github.com/scholarslab/Neatline/compare/2.0.0...2.0.1)) ~ July 10, 2013

#### Bug Fixes

  - Fixes bug that was causing record deletions to fail when Neatline was installed independently without any of sub-plugins.

## v2.0.0 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-rc4...2.0.0)) ~ July 8, 2013

#### Bug Fixes

  - Fixes problem with 1.x -> 2.0 migration that was causing Omeka-backed records with titles that were inherited from the items to be migrated with empty titles.

## v2.0-rc4 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-rc3...2.0-rc4)) ~ July 7, 2013

#### Added Features

  - Makes it possible to use any web-accessible static image as the base layer for an exhibit.

  - Makes it possible to directly enter a WMS address/layers combination to be used as the base layer for an exhibit. This makes it possible to use custom WMS layers without having to manually registed the layer in a JSON definition file.

## v2.0-rc3 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-rc2...2.0-rc3)) ~ July 6, 2013

#### Added Features

  - Adds expanded and completely rewritten documentation.

#### Bug Fixes

  - Adds correctly-formed fulltext indexes to the records table for each of the combinations of fields that the application queries against - `title`/`body`/`slug`, `tags`, and `widgets`. This repairs previous versions of the table that just created a single index for _all_ of the fields, which caused queries against just _some_ of the fields to fail.

## v2.0-rc2 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-rc1...2.0-rc2)) ~ July 2, 2013

#### Bug Fixes

  - Fixes a problem introduced by a change in the Rivets library that was causing the twitter `data-X` element attributes to get sucked up by the Rivets view, which caused Rivets to try to bind the nonexistent model attributes.

## v2.0-rc1 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-alpha2...2.0-rc1)) ~ June 30, 2013

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

## v2.0-alpha2 ([commits](https://github.com/scholarslab/Neatline/compare/2.0-alpha1...2.0-alpha2)) ~ May 28, 2013

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

## v2.0-alpha1 ([commits](https://github.com/scholarslab/Neatline/compare/1.1.2...2.0-alpha1)) ~ May 13, 2013

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

#### API Changes

  - Rewrites the front-end (editing environment and public-facing exhibit application) using [Backbone.js](https://github.com/documentcloud/backbone) and [Marionette](https://github.com/marionettejs/backbone.marionette).

  - Adds a structured "sub-plugin" system that makes it easy for developers to implement custom functionality - everything from simple JavaScript widgets up to really extensive modifications that extend the core data model and add completely new interactions.

  - Converts the core record and exhibit controllers into a REST APIs that integrate smoothly with the Backbone.js front-end.

  - Changes the spatial data serialization format from KML to WKT, which can be indexed and queried by MySQL.

#### Development Workflow Changes

  - Uses [Grunt](http://gruntjs.com/) to manage dependencies, build the application, compile static assets, and run tests.

  - Moves to [Stylus](https://github.com/learnboost/stylus) for all application stylesheets.

