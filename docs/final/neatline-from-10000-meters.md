# Neatline from 10,000 Meters

## At a Glance

  - Neatline is built as a set of plugins for Omeka.
  - [Omeka][omeka] is a web publishing framework that makes it easy to create collections of standards-compliant metadata records - sort of like [Wordpress][wordpress] or [Drupal][drupal], but designed for scholars and archivists.
  - Omeka is a web application that can be installed either on a public-facing web server or on a local development environment like [MAMP][mamp], [WampServer][wamp], or [XAMPP][xampp] on your own computer.
  - Neatline can be used out-of-the-box with modern-geography base layers (eg, OpenStreetMap or Google layers).
  - If you want to use georectified historical maps or custom base layers, you'll need to host the layers using a separate piece of software called [Geoserver][geoserver].

## Omeka

Neatline is built as a suite of modular plugins for Omeka, a powerful collection-management and web-publishing framework developed by the [Roy Rosenzweig Center for History and New Media][chnm] at George Mason University. In many ways, Omeka is similar to a lot like other popular management systems like [Wordpress][wordpress] or [Drupal][drupal], but it's designed specifically around the needs of scholars and archivists - Omeka makes it possible to create, curate, and publish a collection of "items" (the rough equivalent of a Wordpress "post" or a Drupal "node"), each of which is a fully-qualified Dublin Core metadata record.

Once you've created some items using the Omeka administrative interface, the collection is automatically published as a public-facing website, which can be completely tailored to the needs of specific projects with custom themes and plugins.

## Neatline

Neatline is a plugin that extends the core Omeka feature-set, similar to a Wordpress "plugin" or a Drupal "module." Neatline adds an interactive map-making environment and geospatial content management system that makes it possible to create a collection of Neatline "exhibits," each of which is populated with its own collection of Neatline "records."

Exhibits can be a collection of completely separate, self-contained projects, or a series of interconnected sub-projects (or any combination of the two). Think of exhibits as the "environment" or "canvas" for a project - the starting base layer and focus location, the combination of UI widgets that are enabled for the project, and, optionally, a long-format piece of text to describe or narrate the exhibit.

Inside an exhibit, the actual content is formalized as a collection of "records," each of which represents some kind of visual or textual entity in the environment - vector annotations on the map, events on the timeline, overlayed historical maps, or ordered sets of waypoints.

## Geoserver

TODO


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
[stamen]: http://maps.stamen.com/
