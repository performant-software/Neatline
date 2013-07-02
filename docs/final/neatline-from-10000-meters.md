# Neatline from 10,000 Meters

## At a Glance

  - Neatline is built as a set of plugins for Omeka.
  - [Omeka][omeka] is a web publishing framework that makes it easy to create collections of standards-compliant metadata records - sort of like [Wordpress][wordpress] or [Drupal][drupal], but designed for scholars and archivists.
  - Omeka is a web application that can be installed either on a public-facing web server or on a local development environment like [MAMP][mamp], [WampServer][wamp], or [XAMPP][xampp] on your own computer.
  - Neatline can be used out-of-the-box with modern-geography base layers (eg, OpenStreetMap or Google layers).
  - If you want to use georectified historical maps or custom base layers, you'll need to host the layers using a separate piece of software called Geoserver.

## Neatline Architecture

Unlike regular, standalone web applications that can be installed in isolation, Neatline is built as a suite of modular plugins for Omeka, a powerful collection-management and web-publishing framework developed by the [Roy Rosenzweig Center for History and New Media][chnm] at George Mason University. In many ways, Omeka is similar to a lot like other open-source management systems like Wordpress or Drupal, but it's designed specifically around the needs of scholars and archivists - Omeka makes it possible to create, curate, and publish a collection of "items" (the rough equivalent of a Wordpress "post" or a Drupal "node"), each of which is a fully-qualified Dublin Core metadata record.

Neatline is installed as a plugin that extends the core Omeka feature-set by adding an geospatial content management system and interactive map-making environment.


[omeka]: http://omeka.org/
[wordpress]: http://wordpress.org/
[drupal]: https://drupal.org/
[mamp]: http://www.mamp.info/en/index.html
[wamp]: http://www.wampserver.com/en/
[xampp]: http://www.apachefriends.org/en/xampp.html
[chnm]: http://chnm.gmu.edu/
