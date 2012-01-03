# Neatline

Neatline is a suite of plugins for Omeka that makes it possible to plot objects, events, places, people, concepts, and imaginative topologies in space and time.

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
