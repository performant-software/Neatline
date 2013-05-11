# v2.0-alpha1

#### Architectural Changes

  * Splits the functionality in the 1.x series into three separate plugins:
    * **[Neatline](https://github.com/scholarslab/Neatline)** - The core map-making toolkit and content management system.
    * **[NeatlineWaypoints](https://github.com/scholarslab/nl-widget-Waypoints)** - Adds list of sortable waypoints.
    * **[NeatlineSimile](https://github.com/scholarslab/nl-widget-Simile)** - The SIMILE timeline widget.

  * Adds support for real-time spatial querying using the MySQL spatial extensions. Whenever the user pans or zooms the map, the front-end application issues a request to the records API with the current focus and zoom level and renders just the subset of the collection that falls within the current viewport.

  * Rewrites the front-end (editing environment and public-facing exhibit application) in [Backbone.js](https://github.com/documentcloud/backbone) and [Marionette](https://github.com/marionettejs/backbone.marionette).


#### API Additions

  * Adds a structured "sub-plugin" system that makes it easy for developers to implement custom functionality for specific projects. Sub-plugins are just Omeka plugins sit adjacent to the Neatline installation and hook into the core application according to any combination of three basic patterns:

    - **Layers** - Add custom base layer types. Neatline ships with support for Google API layers, Stamen Design layers, OpenStreetMap, and WMS layers; this sub-plugin patterns allows developers to add completely custom "handlers" for any type of layer that can be displayed OpenLayers (see the [documentation](http://dev.openlayers.org/docs/files/OpenLayers/Layer/WMS-js.html) for the complete list). For example, if a developer wanted to use a tile set created in [TileMill](http://mapbox.com/tilemill/) and delivered by a [TileStream](https://github.com/mapbox/tilestream) server, she could add a layer sub-plugin that would respond to requests from the map module for layers of that type.

    - **Presenters** - Each record in an exhibit can now be assigned to a "presenter," which determines the UX behaviors that occur when a user interacts with the representation of a record in the exhibit (for example, when the cursor hovers or clicks on a map vector). Neatline ships with a generic presenter called "Static Bubble" that displays record data in a styleable pop-up bubble overlayed on the map. Custom presenters can be used to implement almost any kind of "view" on individual records - floating bubbles, fullscreen overlays, or complex interfaces that would allow the user to view multiple records at once.

    - **Widgets** - The most open-ended and complex type of sub-plugin, widgets are essentially any kind of custom component that sits alongside the map in an exhibit in order to display information or control the display of information elsewhere in the exhibit. For example, NeatlineSimile and NeatlineWidgets - which implement the timeline and item-browser components that were bundled together with Neatline in the first release - are both written as widget subplugins.

  * Adds "row expansion" system that makes it easy for sub-plugins to extend the ```NeatlineExhibit``` and ```NeatlineRecord``` models with custom fields housed in tables that are automatically joined onto the parent models at query time.
