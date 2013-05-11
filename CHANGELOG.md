### v2.0-alpha1

  * **Architectural Changes**

    * Splits the functionality in the 1.x series into three separate plugins:
      * **[Neatline](https://github.com/scholarslab/Neatline)** - The core map-making toolkit and content management system.
      * **[NeatlineWaypoints](https://github.com/scholarslab/nl-widget-Waypoints)** - Adds list of sortable waypoints.
      * **[NeatlineSimile](https://github.com/scholarslab/nl-widget-Simile)** - The SIMILE timeline widget.

    * Rewrites the front-end application (editing environment and public exhibit application) in [Backbone.js](https://github.com/documentcloud/backbone) and [Marionette](https://github.com/marionettejs/backbone.marionette).

    * Adds support for real-time spatial querying using the MySQL spatial extensions. Whenever the user pans or zooms the map, the front-end application issues a request to the records API with the current focus and zoom level and renders just the subset of the collection that falls within the current viewport.
