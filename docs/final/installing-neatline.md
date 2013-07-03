# Installing Neatline

## At a Glance

  - Installing Neatline is a two-step process - first install Omeka, then install Neatline as a plugin for Omeka.
  - To run Omeka and Neatline, you'll need a "LAMP stack" server - **L**inux, **A**pache, **M**ySQL, and **P**HP.
  - This is a really common technology stack that's supported by almost any commercial webhost.
  - If you just want to experiment with Neatline, you can install it on your own computer using a sandbox environment.
  - Geoserver is a Java application that has different hosting requirements.
  - You can either run your own installation of Geoserver or purchase hosting from a commercial provider.

## Before You Start

Omeka and Neatline will work out-of-the-box on most commercial hosting providers that support PHP and MySQL. Many hosting providers also provide a "one-click" installer for Omeka. See [Hosting Suggestions][hosting] for a list of providers that work with Omeka. If you're providing your own hosting environment, you'll need the following:

  * A hosting environment that supports [PHP][php] (5.2.11 or greater)
  * Access to a [MySQL][mysql] server (5.0 or greater)
  * Ability to write files to the server

For more detailed system requirements, see [Preparing to Install][preparing] in the Omeka documentation.

## Install Omeka

For the most up-to-date instructions on install Omeka, refer to Omeka's [Installation][install] documentation.

## Install Neatline

  1. Upload [Neatline][nlplugin] to the `plugin` directory for your Omeka installation. See [Installing a Plugin][plugin_install] for more detailed instructions on this process.
  2. Activate the *Neatline* plugin by navigating your browser to _your-omeka-site.org/admin_, entering your credentials, and clicking
on the *Plugins* link at the top of the page.
  3. Click the **Install** button for the Neatline plugin.

Once installed, you will see a new tab on the left in the administrative interface labeled **Neatline** that will take you to the editing interface for Neatline.

## Working with Geoserver

Neatline is designed for progressive enhancement. The biggest enhancement is the ability to leverage advanced geospatial technologies to integrate historic (or other custom) maps in to your exhibits.  Through its use of web standards, Neatline is able to integrate maps through [WMS][wms] so you can change the map you are using to something other than the modern maps provided through the default Google mapping services.

Neatline is optimized to make use of [GeoServer][geoserver], an open-source server for sharing georeferenced data. GeoServer runs in a Java Servlet Container like [Tomcat][tomcat], [Jetty][jetty], or [JBoss][jboss]. The [OpenGeo Suite][suite] (community edition) maintains packages for several of the more popular operating systems to ease the management of upgrading and configuring GeoServer.

Installing and maintaining a Java server environment is several orders of magnitude more difficult than what is needed for web applications based on PHP and MySQL. If you do not have the resources for managing your own infrastructure (either through an institutional central IT group or you and your team), a great alternative is a hosting company like [AcuGIS][acugis] (there are discounts for academic users) which provide both Omeka and Neatline hosting. AcuGIS has an exclusive **Neatline Installer** which makes installation just a button-click! Be sure to look at their [FAQ][acuneatlinefaq] for more information about this hosting solution.

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
