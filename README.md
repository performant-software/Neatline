# Neatline

## Installation

### Omeka

For detailed instructions about installing Omeka, refer to the [documentation][omeka-install-documentation]. In brief:

1. Create a MySQL database and a user with create permissions.
2. Clone the [Omeka codebase][omeka-github] into a pubically-accessible location on your server.
3. Make these three changes to the out-of-box code:
    * Open **<root>/db.ini.changeme** in the root directory and populate the _host_, _username_, _password_, and _dbname_ parameters; save the file as **db.ini**.
    * Rename **<root>/.htaccess.changeme** to **.htaccess**.
    * Rename **<root>/application/config/config.ini.changeme** to **config.ini**.
4. Go to <host>/<omeka-directory> in a browser, populate the required fields in the form, and click "Install."

### Neatline

Neatline is a plugin for Omeka that resides inside of the Omeka installation tree.

1. Clone the [Neatline codebase][neatline-github] into the **<root>/plugins** directory in Omeka.
2. Go to <host>/<omeka-directory>/admin, log in, and click on the "Settings" tab at the top left.
2. Click on the "Plugins" tab, find the listing for Neatline, and click "Install."

### Neatline Maps

While Neatline can be used as a standalone plugin to create exhibits that use static images and OpenStreetMaps base-layers as the foundation on which content is plotted, the Neatline Maps plugin makes it possible to upload georectified .tiff images and host them on Geoserver, a powerful open-source geospatial server. For scholarly projects involving historical maps where the portability and integrity of interpretive data is of a premium, this is the perferred method of using Neatline.

To install Neatline Maps:

1. Clone the [Neatline Maps codebase][neatline-maps-github] into the **<root>/plugins** directory in Omeka.
2. Go to <host>/<omeka-directory>/admin, log in, and click on the "Settings" tab at the top left.
2. Click on the "Plugins" tab, find the listing for Neatline, and click "Install."


[omeka-install-documentation]: http://omeka.org/codex/Installation 
[omeka-github]: https://github.com/omeka/Omeka
[neatline-github]: https://github.com/scholarslab/Neatline
[neatline-maps-github]: https://github.com/scholarslab/NeatlineMaps
