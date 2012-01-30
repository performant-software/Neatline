# Neatline

Neatline is a geo-temporal mapping application that makes it possible to plot any _collection of things_ - objects, events, places, people, concepts, or imaginative topologies - on maps and timelines, accompanied by a built-in interface for presenting long-format interpretive text that is tightly coupled with the representations of the objects in space and time.




By design, the software is completely agnostic about the original structure of the data that is being represented, and about the structure of final interpretive representations of the data in the exhibit. The geographic footprint of an object can be depicted by any arbitrary shape or collection of shapes on the map, and the temporal footprint can be rendered as a point in time, a span of time, or a rising and falling gradient across a time interval that captures uncertainty or inherent ambiguity across a time interval.

Once data is plotted in space and time, the representations of a given object on the two major "axes" is tightly coupled. As a user interacts with the map or the timeline, the other viewports in the exhibit automatically update to reflect the current focus of the block that is being directly manipulated. 

This combination of maps, timelines, and long-format interpretive text makes it possible to represent large, complex, and heterogeneous 








Neatline is a powerful tool for geospatial and temporal interpretation that makes it possible to plot objects, events, places, people, concepts, and imaginative topologies in space and time.

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


[omeka-install-documentation]: http://omeka.org/codex/Installation 
[omeka-github]: https://github.com/omeka/Omeka
[neatline-github]: https://github.com/scholarslab/Neatline
[neatline-maps-github]: https://github.com/scholarslab/NeatlineMaps
[geoserver]: http://geoserver.org
[openstreetmap]: http://www.openstreetmap.org
