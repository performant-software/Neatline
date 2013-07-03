# Installing Neatline

## At a Glance

  - Installing Neatline is a two-step process - first install Omeka, then install Neatline as a plugin for Omeka.
  - To run Omeka and Neatline, you'll need a "LAMP stack" server - **L**inux, **A**pache, **M**ySQL, and **P**HP.
  - This is a really common technology stack that's supported by almost any commercial webhost.
  - If you just want to experiment with Neatline, you can install it on your own computer using a sandbox environment.
  - Geoserver is a Java application that has different hosting requirements.
  - You can either run your own installation of Geoserver or purchase hosting from a commercial provider.

## Before You Start

Omeka is a web application written with PHP and MySQL that runs on the "[LAMP stack][lamp]" (Linux, Apache, MySQL, and PHP), a ubiquitous set of technologies supported by almost any commercial or institutional hosting provider - many web hosts even provide an automatic "one-click" installer.  See the "Hosting Suggestions" guide in the Omeka documentation for a list of recommended providers. Alternatively, if you just want to experiment with Neatline in an offline setting, your can also install Omeka on a sandbox server environment running on your own computer using software packages like [MAMP][mamp], [WampServer][wamp], or [XAMPP][xampp], with the option of migrating the site to a public-facing web host at any point in the future.

To get started, you'll need the following:

  - A server environment with [PHP][php] (5.2.11 or greater), [MySQL][mysql] (5.0 or greater), and Apache.
  - Permission to add and edit files to the server.
  - Credentials for a MySQL user and the name of a database for the Omeka installation.

For more detailed system requirements, see [Preparing to Install][preparing] in the Omeka documentation.

## Install Omeka

First, install Omeka by following the instructions in the "[Installation][install]" guide.

## Install Neatline

Once Omeka is up and running, install the Neatline plugin:

  1. Download the most recent version of Neatline, unpack the `.zip` archive, and move it into `/plugins`.

  2. In the Omeka administrative interface, click on the **Plugins** link on the top navigation bar and find the listing for Neatline.

  3. Click the **Install** button.

You should get redirected back to the list of plugins and see a success notification saying that "The Neatline plugin was successfully installed." Over in the main vertical navigation on the left side of the screen, you'll see a new listing for **Neatline** - click there to get started.

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
