# Neatline

Neatline is a geo-temporal mapping application that makes it possible to plot any _collection of things_ - objects, events, places, people, concepts, or imaginative topologies - on maps, images, and timelines, accompanied by a built-in interface for presenting long-format interpretive text that is tightly coupled with the representations of the objects in space and time.

By design, the software is completely agnostic about the original structure of the data that is being represented, and about the structure of final interpretive representations of the data in the exhibit. The geographic footprint of an object can be depicted by any arbitrary shape or collection of shapes on the map, and the temporal footprint can be rendered as a point in time, a span of time, or a rising and falling gradient that captures uncertainty or inherent ambiguity across a time interval.

Once data is plotted in space and time, the representations of a given object on the two major "axes" is tightly coupled. As a user interacts with the map or the timeline, the other viewports in the exhibit automatically update to reflect the current focus of the block that is being directly manipulated. 

This combination of maps, timelines, and long-format interpretive text makes it possible to gracefully represent large, complex, and heterogeneous collections of concepts that would otherwise be difficult box into the limiting confines of simple x-y geographic coordinates and second-specific timestamps. Neatline is designed to make is possible to capture the interpretive freeplay and fuzz that form the bedrock of humanistic narrative and argument.

Neatline is the best tool for these kinds of use cases:

  * **An geographic and institutional map of 20th centry literary theory**: We tend to identify clusters of conversant literary cricisim with with universities, cities, and countries - the Yale school, Russian formalism, Marxism and the Frankfurt School, etc. You want to plot the institutional affiliations and career arcs of ~100 prominent 20th century literary critics, grouped according to critical school, to see to what extent the real-world locations and temporal overlaps various critics do or do not correspond with the conceptual connections that emerge in the criticism itself.

  * **Biographies of the signatories on the Declaration of Independence**: You want to create an interactive exhibits that "attaches" biographic information about the signatories on the Declaration of Independence to a high-resolution image of the actual document. The map annotation tools make it possible to draw precise, translucent outlines around the signatures on the document, and the WYSWYG text editor can interactively display long-format biographies and pictures as the user interacts with the outlines on the image.

  * **A narrative map of the 1924 British Mount Everest expedition**: Did George Mallory and Andrew Irvine make it to the summit on June 8? You want to create a map showing the climing lines that the parties followed on the summit attempts, the conjectured routes that Mallory may have followed after possibly summiting the mountain, and the location of his body when it was recovered in 1999. The phases of the climb can be plotted as time spans, and the minute-by-minute accounts from the Odell diaries can be captured as individual points.

  * **A map of the movements of characters and concepts in _The Tempest_**: _The Tempest_ takes place in a indeterminate space, an island outside of the moving world, an aesthetic throne for Prospero; and yet the movements of the characters are described in significant detail. You want to use a Renaissance-era map of an island in the Mediterranean (or the West Indies, or the Carribean) to create a speculative mapping of the text - Prospero's lair, the shipwreck, the carousing of Caliban and Trinculo, the journey back to Italy, the specific sizes and shapes of Prospero's intellectual ambition.

## Before you start

Neatline can be used in two ways: As a free, public-facing webservice by way of [webservice.neatline.org][neatline-webservice], or as a plugin for [Omeka][omeka], an open-source web publishing platform similar to Wordpress or Drupal that makes it possible to build and display archival collections with Dublin Core or EAD metadata. Each option - using the webservice or installing Omeka + Neatline in your own hosting environment - has its own pros and cons, and the decision should be guided by the specific requirements of your project.

The version of the Neatline application delivered by the webservice is identical to the self-hosted version, with the one limitation: Webservice users are limited to "real-geography" base layers (Google Maps and OpenStreetMap layers). If you want to use static or georectified images as base layers, you'll need to run your own instance of Omeka and Neatline, as well as the auxilary software that makes it possible to upload and host the images - the [Neatline Maps][neatline-maps-github] plugin and [Geoserver][geoserver], a powerful Java-based geospatial server that houses and delivers the custom map assets.

Some general considerations:

  * **Webservice**: 
    * _Pros_
      - Free, easy, and fast to get up and running. As simple as signing up for an email account.
      - No hosting costs or server administration overhead. No technical knowledge is necessary.
      - Great for straightforward, GIS-style use cases that only require "real-geography" base layers (satellite imagery, street maps, etc.). For example, Neatline excels as a drop-in replacement for the custom map-creation functionality in Google maps for users who need a richer feature set.
    * _Cons_
      - Can't upload static images or georectified .tiff files to use as base layers.
      - Can't leverage the archival capabilities or rich metadata support of Omeka.

  * **Self-Hosted**: 
    * _Pros_
      - Possible to static images and georectified .tiff files as base layers.
      - Full access to the Omeka installation that sits behind Neatline. This makes it possible to create Neatline exhbits that directly extend and build on existing archives of Dublin Core or EAD metadata.
      - Full access to the Neatline codebase for modification or extension.
      - Best for complex scholaraly projects where the portability and structural integrity of data is of a premium.
    * _Cons_
      - Requires basic knowledge of web hosting environments, MySQL administration, and web-based software installation.
      - Geoserver, the optional geospatial server that makes it possible to use georectified .tiff images as base layers, is a complex piece of software that can be comparatively difficult deploy.

While the webservice is a fully capable solution for many (if not most) use cases, it also serves a sandbox environment for advanced users who want to demo a fully-functional installation of the software before committing further time and resources. 

## Installation and Setup

### Neatline Web Service

### Self-hosted Omeka + Neatline










## Installation

### Omeka

For detailed instructions about installing Omeka, refer to the [documentation][omeka-install-documentation]. In brief:

1. Create a MySQL database and a user with create permissions.
2. Clone the [Omeka codebase][omeka-github] into a pubically-accessible location on your server.
3. Make these three changes:
    * Open **/db.ini.changeme** in the root directory and populate the _host_, _username_, _password_, and _dbname_ parameters; save the file as **db.ini**.
    * Rename **/.htaccess.changeme** to **.htaccess**.
    * Rename /application/config/**config.ini.changeme** to **config.ini**.
4. Go to the Omeka web root in a browser, populate the required fields in the form, and click "Install."

### Neatline

Neatline is a plugin for Omeka that resides inside of the Omeka installation tree.

1. Clone the [Neatline codebase][neatline-github] into the **/plugins** directory in Omeka.
2. Go to (omeka-web-root)/admin, log in, and click on the "Settings" tab at the top left.
2. Click on the "Plugins" tab, find the listing for Neatline, and click "Install."

### Neatline Maps

While Neatline can be used as a standalone plugin to create exhibits anchored on static images and [OpenStreetMap][openstreetmap] base-layers, the Neatline Maps plugin makes it possible to upload georectified .tiff images and host them on [Geoserver][geoserver], a powerful open-source geospatial server. For scholarly projects involving historical maps where the portability and conceptual integrity of interpretive data is of a premium, this is the perferred method of using Neatline.

To install Neatline Maps:

1. Clone the [Neatline Maps codebase][neatline-maps-github] into the **/plugins** directory in Omeka.
2. Go to (omeka-web-root)/admin, log in, and click on the "Settings" tab at the top left.
2. Click on the "Plugins" tab, find the listing for Neatline, and click "Install."


[omeka]: http://omeka.org
[omeka-install-documentation]: http://omeka.org/codex/Installation 
[omeka-github]: https://github.com/omeka/Omeka
[neatline-github]: https://github.com/scholarslab/Neatline
[neatline-maps-github]: https://github.com/scholarslab/NeatlineMaps
[geoserver]: http://geoserver.org
[openstreetmap]: http://www.openstreetmap.org
[neatline-web-service]: http://webservice.neatline.org
