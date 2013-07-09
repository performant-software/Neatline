---
layout: default
---
# Installing Neatline

## At a glance

  - Installing Neatline is a two-step process - first install Omeka, then install Neatline as a plugin for Omeka.
  - To run Omeka and Neatline, you'll need a "LAMP stack" server - **L**inux, **A**pache, **M**ySQL, and **P**HP.
  - This is a really common technology stack that's supported by almost any commercial webhost.
  - If you just want to experiment with Neatline, you can install it on your own computer using a sandbox environment.
  - Geoserver is a Java application that has different hosting requirements.
  - You can either run your own installation of Geoserver or purchase hosting from a commercial provider.

## Before you start

Omeka is a web application written with PHP and MySQL that runs on the "[LAMP stack][lamp]" (Linux, Apache, MySQL, and PHP), a ubiquitous set of technologies supported by almost any commercial or institutional hosting provider - many web hosts even provide an automatic "one-click" installer.  See the "Hosting Suggestions" guide in the Omeka documentation for a list of recommended providers. Alternatively, if you just want to experiment with Neatline in an offline setting, your can also install Omeka on a sandbox server environment running on your own computer using software packages like [MAMP][mamp], [WampServer][wamp], or [XAMPP][xampp], with the option of migrating the site to a public-facing web host at any point in the future.

Either way, you'll need the following:

  - A server environment with [PHP][php] (5.2.11 or greater), [MySQL][mysql] (5.0 or greater), and Apache.
  - Credentials for a MySQL user and the name of a database for the Omeka installation.
  - Permission to add and edit files to the server.

For more detailed system requirements, see the [Preparing to Install][preparing] guide in the Omeka documentation.

## Installing Omeka

First, install Omeka by following the instructions in the [Installation][install] guide.

## Installing Neatline

Once Omeka is up and running, install the Neatline plugin:

  1. Download the most recent version of Neatline, unpack the `.zip` archive, and move the `Neatline` folder into `/plugins`.

  2. In the Omeka administrative interface, click on the **Plugins** link on the top navigation bar and find the listing for Neatline.

  3. Click the **Install** button.

You'll be redirected back to the list of plugins and see a notification saying that "The Neatline plugin was successfully installed." Over in the main vertical navigation on the left side of the screen, you'll see a new listing for **Neatline** - click there to get started.

## Installing Geoserver

With Omeka and Neatline installed, you can get started building exhibits on top of modern-geography base layers (OpenStreetMap, Google Maps, and Stamen Maps). For many use-cases, the default layers are more than sufficient, and no other action is necessary. For projects that need to incorporate custom imagery, though - for example, historical projects that want to overlay georeferenced maps on top of the default layers, or art history projects that need to use scans of paintings as base layers in exhibits - a third piece of software called [Geosever][geoserver] is necessary.

Geoserver is a high-performance, open-source geospatial server that runs in a Java Servlet Container like [Tomcat][tomcat], [Jetty][jetty], or [JBoss][jboss]. Basically, Geoserver is responsible for taking high-resolution GeoTIFF's - images that are keyed onto spatial coordinates - and selectively doling out just the section of the image that's necessary to fill the viewport as a user pans and zooms the map in Neatline. This is such a computationally-intensive task that it requires a separate, standalone piece of software.

The [OpenGeo Suite][suite] (community edition) maintains packages for several of the more popular operating systems to ease the management of upgrading and configuring GeoServer. That said, the process of installing and maintaining a Java server environment generally requires quite a bit more technical expertise than what's needed to get up and running with Omeka and Neatline. Geoserver is built on top of a more complicated suite of technologies, and tends to need a higher level of ongoing maintenance.

If you don't have the resources to manage your own installation, there are a couple of options. First, if you're associated with a a college or university, check to see if your institution could provide assistance - managing complex software like Geoserver is often the sort of thing that falls under the purview of central IT services. Second, you can always purchase Geoserver hosting from a commercial provider - we've had good experiences with [AcuGIS][acugis], which actually provides all-in-one Geoserver, Omeka, and Neatline hosting (they have a one-click Neatline installer, and offer discounts for academic users). Check out the [FAQ][acuneatlinefaq] for more information.

[suite]: http://opengeo.org/products/suite/community/
[acugis]: http://www.acugis.com/neatline-hosting.htm
[acuneatlinefaq]: http://www.acugis.com/neatline-faq.html
[geoserver]: http://geoserver.org/ "GeoServer"
[hosting]: http://omeka.org/codex/Hosting_Suggestions "Omeka Hosting Suggestions"
[install]: http://omeka.org/codex/Installation "Install Omeka"
[plugin_install]: http://omeka.org/codex/Installing_a_Plugin
[omeka]: http://omeka.org/ "Omeka"
[nlplugin]: http://omeka.org/addons/neatline "Neatline Plugin"
[systemreqs]: http://omeka.org/codex/Preparing_to_Install "Omeka System Requirements"
[mysql]: https://www.mysql.com/
[php]: http://us.php.net/
[wms]: https://en.wikipedia.org/wiki/Web_Map_Service
[preparing]: http://omeka.org/codex/Preparing_to_Install
[tomcat]: https://tomcat.apache.org/
[jetty]: http://www.eclipse.org/jetty/
[jboss]: https://www.jboss.org/overview/
[opengeo]: http://opengeo.org/products/suite/community/
[mamp]: http://www.mamp.info/en/index.html
[wamp]: http://www.wampserver.com/en/
[xampp]: http://www.apachefriends.org/en/xampp.html
[lamp]: http://en.wikipedia.org/wiki/LAMP_(software_bundle)
