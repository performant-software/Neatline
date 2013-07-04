# Neatline from 10,000 Meters

## At a Glance

  - Neatline is built as a set of plugins for Omeka.
  - [Omeka][omeka] is a web publishing framework - similar to [Wordpress][wordpress] or [Drupal][drupal], but designed for scholars and archivists.
  - Neatline adds an interactive map-making environment that makes it possible to 
  - Neatline can be used out-of-the-box with modern geography base layers like [OpenStreetMap][osm] or the [Google][google] API layers.
  - If you want to add custom base layers or overlays, you'll need to host them using a piece of software called [Geoserver][geoserver].

## Omeka - Standards-Compliant Metadata

Neatline is built as a suite of modular plugins for [Omeka][omeka], a digital collection-management and web-publishing framework developed by the [Roy Rosenzweig Center for History and New Media][chnm] at George Mason University. In many ways, Omeka is similar to other popular content management systems like [Wordpress][wordpress] or [Drupal][drupal], but it's designed specifically around the needs of scholars and archivists.

Omeka makes it posible to create and curate a collection of "items" (the rough equivalent of a Wordpress "post" or a Drupal "node"), each of which is a fully-qualified Dublin Core metadata record. Once you've built out a collection items using the Omeka administrative interface, the collection is automatically published as a public-facing website, which can be tailored to the needs of specific projects with custom themes and plugins.

## Neatline - Interactive Map-Making Environment

Building on the foundation provided by Omeka, Neatline is a plugin that grafts new functionality onto the core Omeka feature set. Neatline adds an interactive map-making environment that makes it possible to create Neatline _exhibits_, each of which is populated with its own collection of _records_, which can optionally be synchronized with items in the underlying Omeka collection.

Think of exhibits as the "canvas" for a project, records as the "paint strokes." Exhibit-level settings control basic defaults like the starting base layer, the focus location of the map, and which of the mix-and-match UI widgets are enabled for the exhibit. Meanwhile, content inside the exhibits is represented as a collection of records, each of which corresponds to some kind of visual or textual entity in the environment - vector annotations on the map, events on the timeline, overlayed historical maps, textual annotations in the exhibit narrative, or clickable waypoints.

## Geoserver- High-Performance Map Server

Out of the box, Neatline can be used to build exhibits on top of a collection of modern-geography base layers - the [OpenStreetMap][osm] tile set, the [Google Maps][google] API, and a [collection of stylized layers][stamen-maps] created by a design firm in San Francisco called [Stamen Design][stamen].

If you want to use Neatline with georectified historical maps or custom base layers, you'll need to publish the layers to the web using a third piece of software called [Geoserver][geoserver], an open-source geospatial server that does the computationally-intensive work of piping the georeferenced image tiles into the Neatline exhibits.


[omeka]: http://omeka.org/
[wordpress]: http://wordpress.org/
[drupal]: https://drupal.org/
[mamp]: http://www.mamp.info/en/index.html
[wamp]: http://www.wampserver.com/en/
[xampp]: http://www.apachefriends.org/en/xampp.html
[chnm]: http://chnm.gmu.edu/
[geoserver]: http://geoserver.org/
[osm]: http://www.openstreetmap.org/
[google]: https://developers.google.com/maps/
[stamen-maps]: http://maps.stamen.com/
[stamen]: http://stamen.com/
[lamp]: http://en.wikipedia.org/wiki/LAMP_(software_bundle)
