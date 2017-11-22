## 2.6.1 ([commits](https://github.com/scholarslab/Neatline/compare/2.6.0...2.6.1))

#### Bug Fixes

- Corrects values for number of zoom levels passed to Google Maps layer types during initialization
- Revises PHP syntax for backward compatibility
- Adjusts Neatline's check for Geolocation plugin presence when determining whether to load Google Maps API


## 2.6.0
([commits](https://github.com/scholarslab/Neatline/compare/2.5.3...2.6.0))

#### Bug Fixes

- Prevents a case in which a WKT string imported from Omeka item's coverage field could be rejected in the backend but appear temporarily on the map.
- Uses Omeka's timestamp mixin to prevent a configuration-specific database error during exhibit creation.

#### Added Features

- Adds Neatline Exhibit and Neatline Record to the types of records that can be made searchable in the Search pane of Omeka's settings.
- Enables duplication of exhibits. A user may click "Duplicate" in the Neatline admin table below an exhibit that they have permission to view, creating their own copy; the duplicating user becomes the owner of the new exhibit, whose title includes their username.
- Adds Restricted Map Extent, Minimum Map Zoom, and Maximum Map Zoom fields to the Styles pane in the exhibit editor, allowing users to constrain the range of zoom and pan possible in the exhibit map.
- Allows users to select "None (Image or WMS as Default)" in the Default Spatial Layer field when creating an exhibit. If this value is chosen and a URL is supplied in the Image Layer field, the exhibit map will use the image as its base layer; if Image Layer is left blank, the map will use WMS for its base; if the WMS fields are left blank, the map will use the first of the Enabled Spatial Layers or have no layers if none are enabled.


## v2.5.3 ([commits](https://github.com/scholarslab/Neatline/compare/2.5.2...2.5.3))

#### Bug Fixes

- Provides workaround for when configuration settings prevent calculating image dimensions
- Sets a minimum zoom extent on image layers to refine zoom level granularity


## v2.5.2 ([commits](https://github.com/scholarslab/Neatline/compare/2.5.1...2.5.2))

#### Added Features

  - Makes it possible to set a `googlemaps_api_key` in the plugin configuration, which although not needed for Neatline to function, does prevent some javascript errors. Also, detects if the geolocation plugin is installed, and if it is, uses the API key set in that plugin rather than injecting the same script into the header twice.

#### Bug Fixes

  - Fixes an issue with google maps as base layers, which was caused by the latest released version of OpenLayers 2 not including a fix which is included in the master branch of that library. Does so by creating a custom release of ol2, hosted in Scholar's Lab's github organization.
  - Fixes an issue with loading WMS maps from mapwarper as base layers on exhibits, by setting the projection to Web Mercator for all maps.
  - Tested against Omeka 2.5


## v2.5.1 ([commits](https://github.com/scholarslab/Neatline/compare/2.5.0...2.5.1))

#### Bug Fixes

  - Upgraded geoPHP
  - Only close static bubble if the you unselect the bubble's record (several issues, e.g., #375).

## v2.5.0 ([commits](https://github.com/scholarslab/Neatline/compare/2.4.2...2.5.0))

#### Added Features

  - Makes it possible to set a `wms_mime` property in the `plugin.ini` file, which controls the MIME type requested when the map loads WMS tiles (by default, `image/png`). This makes it possible to request custom MIME types that cut down on the size of the tiles, when the backend supports it. Eg, Geoserver supports `image/png8`, which is significantly lighter.

#### Bug Fixes

  - Also index and provide full-text search in the admin console for the `item_title` field. Fixes #369.

## v2.4.2 ([commits](https://github.com/scholarslab/Neatline/compare/2.4.1...2.4.2)) ~ July 13, 2015

#### Bug Fixes

  - Added `MAP:load` front-end route back (#361).

## v2.4.1 ([commits](https://github.com/scholarslab/Neatline/compare/2.4.0...2.4.1)) ~ June 25, 2015

#### Bug Fixes

  - Fixed a problem with item serialization;

  - Fixed a problem with timing issues when going directly to a hard-linked item (#355);

  - Fixed problem with loading an barely compatible version of Google Maps (#363); and

  - Fixed problem with the zoom levels on some Google Maps (#362).

## v2.4.0 ([commits](https://github.com/scholarslab/Neatline/compare/2.3.0...2.4.0)) ~ March 4, 2015

#### Added Features

  - When a record with a WMS layer is selected, the "selected" fill opacity will be applied to the image tiles.

  - Makes it possible for themes to provide custom containers for widgets. For example, a theme could template an element with `id="simile"`, and the SIMILE widget would render the timeline inside of that element, instead of constructing a new element and appending it to the exhibit.

#### Bug Fixes

  - Fixed bug that made it impossible to use the exhibit stylesheets to style tag selectors that included underscores.

  - Fixed bug that caused vector geometries to displace away from Google baselayers at the highest zoom level.

## v2.3 ([commits](https://github.com/scholarslab/Neatline/compare/2.2.4...2.3.0)) ~ July 28, 2014

#### Added Features

  - It's now possible to "hard link" to inidividual records in exhibits. For example, if a record has an ID of "36", the route fragment `#records/36` will cause the exhibit to automatically focus on that record when the page load. Likewise, manually selecting a record in the exhibit will update the route.

  - It's now possible to set the set the "Default Focus" value for a record independently of the "Default Zoom" value. If a focus is set, but not a zoom, the custom focus will be applied when the record is selected, and a zoom will be auto-computed based on the size of the record's geometry.

  - Vice versa, the "Default Zoom" value can now be set independently of the "Default Focus." If a zoom is set, but not a focus, the custom zoom will be applied when the record is selected, and a focus will be auto-computed around the bounding box of the record's geometry.

#### Changed Features

  - The routes in the editor have been updated to be more semantic. Now, the starting list of records is at `#browse`, and search and pagination parameters are provided with `#browse/query=search-query` and `#browse/start=100`.

#### Bug Fixes

  - Fixes a problem that was causing the layer switcher to be covered by the Waypoints container when the exhibit was using a Google base layer.

  - Fixes a bug that caused Omeka item imports to fail if an item had a "Coverage" value that started with the letter "p" but was _not_ a valid WKT string.

#### Development Workflow

  - Changes the process by which compiled Javascript and CSS payloads are committed to git:

    - Instead of building the payloads into `/dist` directories, everything now goes into `/dist/development` directories.

    - All of these directories are .gitignored, making it impossible for transient changes to the payloads during development to get accidentally sucked in commits.

    - When a release is ready, run `grunt freeze`, which copies all of the `/dist/development` directories to sibling `dist/production` directories. The production directories are tracked, so any changes will get vacuumed up in the next commit.

    - In the plugin, when queuing the assets, Neatline branches on the `APPLICATION_ENV` global and loads from `dist/development` or `dist/production` depending on the environment. This setting is toggled in [Omeka's `.htaccess` file](https://github.com/omeka/Omeka/blob/master/.htaccess.changeme#L14), making it easy to hallway test the exact files that will be used in production.

## v2.2.4 ([commits](https://github.com/scholarslab/Neatline/compare/2.2.3...2.2.4)) ~ May 21, 2014

#### Bug Fixes

  - Re-includes the compiled documentation HTML in the release package, which fixes the inline documentation modals in the editor.

## v2.2.3 ([commits](https://github.com/scholarslab/Neatline/compare/2.2.2...2.2.3)) ~ May 16, 2014

#### Bug Fixes

  - Fixes a bug caused by dependency mismatches in the bower components that broke the Javascript build in the editor.

## v2.2.2 ([commits](https://github.com/scholarslab/Neatline/compare/2.2.1...2.2.2)) ~ May 15, 2014

#### Changed Features

  - Previously, if NeatlineFeatures were enabled, you couldn't use the CsvImport plugin to add WKT data into the coverage field and then have those features import into Neatline successfully. We've lifted that restriction.

#### Performance Improvements

  - Changes the MIME type for WMS layer image tiles from `image/png` to `image/png8`, which visually almost identical and load much faster.

  - Adds `tiled=true` to WMS layer requests, which is necessary in order for Geoserver to return cached tiles.

#### Bug Fixes

  - Fixes a bug that occasionally caused WMS layers with undefined zindexes to slip "below" the base layer when the exhibit started.

## v2.2.1 ([commits](https://github.com/scholarslab/Neatline/compare/2.2.0...2.2.1)) ~ February 13, 2014

#### Bug Fixes

  - Fixes problem with the ACL that was blocking anonymous users from viewing the Neatline-inflected item metadata.

## v2.2.0 ([commits](https://github.com/scholarslab/Neatline/compare/2.1.3...2.2.0)) ~ January 15, 2014

#### Added Features

  - Adds a new interface for linking Neatline records to Omeka items that makes it possible to browse the entire collection of items, run full-text searches, and instantaneously preview the Omeka content (metadata, images, etc.) as it will appear in the public Neatline exhibit.

  - When Omeka items are imported into Neatline, plain-text WKT or KML values in the Dublin Core "Coverage" field are now automatically imported Neatline's `coverage` field and display on the map. (Previously, this only worked if the coverage on the item was created with the Neatline Features plugin.)

  - Adds a system of interactive documentation that builds reference materials for each individual input and control in the editor directly into the interface. Now, the heading for each input is followed by a **?** button that, when clicked, overlays a document with information about what the control does, how to use it, and how it interacts with other functionality in the editor.

  - Adds a link to the Neatline exhibits browse page to the public navigation.

  - Adds a "View the item in Omeka" link to the default template used to represent Omeka items in Neatline exhibits.

  - Makes it possible to add both vector annotations and WMS layers to the same Neatline record.

  - In the editor, the map is now bidirectionally synchronized with the "Coverage" input on the record edit form. For example, if WKT is pasted into the input, the map will automatically update the edit layer to display the new coverage.

#### Performance Improvements

  - Optimizes the records API so that it avoids re-transmitting records that have already been pushed to the client by previous queries. This significantly improves performance in exhibits that have records with large quantities of metadata - e.g., map geometries derived from SVG documents with many thousands of points.

  - Patches up a memory leak on the map view caused by marooned references to deleted layers on the cursor control instances.

  - Fixes fullscreen, white "flashes" that occasionally occurred in the editor when using Chrome on Macbook Pros with retina displays, which were caused by a bug in Chrome related to CSS transitions on scrollable, fixed-position divs.

#### User-Interface Improvements

  - Touches up the UI and styling in the editor interface - changes the body font, adds in fieldset legends in the "Map" and "Text" tabs, increases the height of the "Coverage" textarea, adds darkened background color to focused text inputs.

  - Adds an interactive tag selection UI to the "Widgets" multiselect in the "Style" tab on the record form.

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

  - For consistency with the rest of the theme, exhibit-specific themes now need to define a `show.php` file in order to override the default template, instead of `template.php`.

  - Previously, custom templates for Omeka items imported into Neatline exhibits could be defined under `neatline/exhibits` in the public theme. Now, the code will instead look for these templates under the _exhibit-specific_ theme directory for the exhibit. For example, if an exhibit has a URL slug of `exhibit-slug`, the item templates will now be searched for under `neatline/exhibits/themes/exhibit-slug`, along with the rest of the exhibit-specific assets.

  - Previously, all layer definitions were included in a single `layers.json` file in the top-level plugin directory. This file has been moved to `/layers/default.json`, and, instead of adding layers to `defaults.json`, it's now possible to provide definitions for any number of layer groups in separate files. Eg, `wms.json`, `tilestream.json`, etc.

#### Bug Fixes

  - Fixes bug found by [Mark Olson](mailto:mark.olson@duke.edu) in the SVG-to-WKT conversion library that was causing SVG documents with complex polygonal elements (eg `<polygon>`, `<polyline>`) to fail to parse when pasted into the Neatline editor.

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

    - Themes are defined by creating a directory with a name that matches an exhibit slug under `neatline/exhibits/themes/`, relative to the root of the public theme. For example, if an exhibit has a slug of `exhibit-slug`, Neatline will load theme assets from `neatline/exhibits/themes/exhibit-slug`.

    - Inside the theme directory, a `tempalate.php` file can be defined. If present, this template will be rendered instead of the default `show.php` that ships with Neatline.

    - All `.js` and `.css` files in the directory will be queued in the public view for the exhibit after the core application assets.

  - The exhibits controller now respects the two separate options for admin and public page lengths (`per_page_admin`, `per_page_public`).

#### Changed Features

  - In the `item.php` template used to determine the structure of the compiled item metadata in Neatline records, moves the file display below the default metadata output to conform with Omeka's default item show view.

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
