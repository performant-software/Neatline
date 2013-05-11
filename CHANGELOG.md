# v2.0-alpha1

#### Architectural Changes

  * Migrates the codebase to Omeka 2.x.

  * Splits the functionality in the 1.x series into three separate plugins:
    * **[Neatline](https://github.com/scholarslab/Neatline)** - The core map-making toolkit and content management system.
    * **[NeatlineWaypoints](https://github.com/scholarslab/nl-widget-Waypoints)** - Adds list of sortable waypoints.
    * **[NeatlineSimile](https://github.com/scholarslab/nl-widget-Simile)** - The SIMILE timeline widget.

### API Changes

  * Rewrites the front-end (editing environment and public-facing exhibit application) using [Backbone.js](https://github.com/documentcloud/backbone) and [Marionette](https://github.com/marionettejs/backbone.marionette).

  * Converts the core record and exhibit controllers into a REST APIs that integrate smoothly with the Backbone.js front-end.

  * Adds a structured "sub-plugin" system that makes it easy for developers to implement custom functionality for specific projects.

#### New Features

  * Adds support for real-time spatial querying using the MySQL spatial extensions. Whenever the user pans or zooms the map, the set of records on the map is automatically updated with just the subset of the collection that falls within the current viewport.

  * Makes it possible to import SVG documents created in vector editing tools like Adobe Illustrator or Inkscape and dynamically position them as first-class geometry on the map.

  * Adds an interactive "stylesheet" system (inspired by Mike Migurski's [Cascadenik](https://github.com/mapnik/Cascadenik)) that makes it possible to use a dialect of CSS to make bulk updates to large batches of records grouped together by tags.

  * Makes it possible to add custom base layers, which, among other things, makes it possible to annotate completely non-spatial entities - paintings, photographs, documents, and anything else that can be captured as an image

  * Adds a cluster of features to the editor that makes it easier to work with really large collections of records - full-text search, tag search, a "spatial" search mode in which the record browser displays just the records visible in the map viewport, and paged browsing.

  * Adds JavaScript routing to the editor, which makes it possible to use the browser's Back and Forward buttons to move back and forth between different application states.

  * Makes it possible to configure the list of available base layers on a per-exhibit basis, instead of just including all base layers in all exhibits.

  * Adds support for more granular control over the colors and opacities of map geometries.

#### Changed Features

  * Improves the process by which Omeka items are imported into Neatline exhibits. Instead distinguishing between "Neatline" and "Omeka" records, _everything_ is a Neatline record, and any Neatline record can be linked to any Omeka item in the underlying collection.

  * Replaces CLEditor (the rich-text editor used on the "Title" and "Body" fields) with CKEditor, a more robust editor that makes it easier to create well-formatted record content and import video and audio media.

  * Makes it possible to add WMS overlays to exhibits by entering a WMS address and layer id directly into the edit form for a Neatline record (instead of linking the record to an Omeka item, that in turn has a WMS layer by way of the old NeatlineMaps plugin).

#### Removed Features

  * Removes the interactive layout builder that made it possible to interactively drag-and-drop the positions and dimensions of the widgets in an exhibit. This was a brittle feature that made it extremely difficult for theme designers to customize the look and feel of exhibits. The new version refactors the markup and styling 

  - static image backgrounds

#### User-Interface Changes

  - refactors exhibit browse layout
  - makes item browser thinner
  - moves to text-based interface for geoemtry drawing


