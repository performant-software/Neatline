# Upgrading to Neatline 2.0

## At a glance

  - Neatline 2.0 is a major evolution of the project that improves many of the core workflows and adds lots of new features.
  - Almost all exhibits created with Neatline 1.x will behave exactly the same when migrated to Neatline 2.0.
  - In cases where features have been changed, Neatline 2.0 provides alternative methods to achieve the same functionalities.

## What's new

Neatline 2.0, which was released on July 2, 2013, is a major update to the project that includes a large number of improvements to the existing feature-set and adds a number of new features designed to make it easier to create larger and more complex exhibits. Some of the highlights in the new version:

  - **[A high-performance, real-time spatial querying system](http://dclure.org/logs/neatline-one-million-records/)** (the map loads just the subset of information that it needs to fill in the viewport at any given moment) that makes it possible to work with really large collections of records – as many as about 1,000,000 in a single exhibit;

  - **[The ability to import SVG vector graphics](http://dclure.org/logs/neatline-drawing-svg-on-maps/)** created in programs like Adobe Illustrator or Inkscape and interactively “drag” them into position as first-class geometry in a Neatline exhibit;

  - **[A Neatline-flavored dialect of CSS](http://dclure.org/logs/interactive-css-in-neatline-2-0/)**, integrated into the editing environment, that makes it possible to quickly perform bulk updates on large collections of tagged records;

  - **The ability to add custom base layers**, which could be regular geospatial tile sets like the included OpenStreetMap or Google layers, or completely non-spatial entities like paintings, drawings, photographs, documents, diagrams, or anything else that can be captured as an image;

  - **A total rewrite of the front-end JavaScript application** (both the editing environment and the public-facing exhibit views) that provides a more minimalistic and responsive environment for creating and viewing exhibits;

  - **[A flexible user-permissions system](http://dclure.org/logs/announcing-neatline-2-0-alpha2/)**, designed for large-scale classroom use, that makes it possible to cordon off individual student/contributor accounts and grant them access only to their own content;

  - **An exhibit-specific theming system**, which makes it possible for designers and developers to completely customize the appearance, layout, and interactivity of Neatline projects on a per-exhibit basis;

  - **A new programming API and “sub-plugin” system** that makes it possible for developers to add custom functionality – everything from simple user-interface widgets (sliders, legends, scrollers, forward-and-backward buttons, etc.) up to really extensive modifications that expand the core data model and add totally new interactions.

## What's different

Some of these changes entailed some pretty significant changes to the core codebase. Almost all of the features from the 1.x releases are preserved in 2.0, and almost all exhibits will behave almost exactly the same after upgrading to 2.0. In a handful of very carefully-chosen places, though, we made changes that will alter the behavior of certain types of exhibits. In each case, these changes were made because we felt that the new approach would make Neatline projects more maintainable, efficient, or standards-compliant and boost the overall sustainability of the project. In all cases where a feature was removed, we've added an alternate method to accomplish the same effect. Here are the important changes:

  - In the new version, the "Timeline" and "Items" panels (which could be enabled via the "Layout Options" drop-down menu in the editor) have been broken out into separate plugins - NeatlineSimile and NeatlineWaypoints - that extend the Neatline plugin, which houses the core content management system. These two "sub-plugins" integrate seamlessly with Neatline - after upgrading from 1.x to 2.0, just install the two widget plugins, and the timeline and item-browser panels will be automatically restored to their original states in all of your exhibits.

  - The "Layout Editor" feature from the first version - which made it possible to interactively toggle and position the three viewports - has been removed in favor of a much more flexible theming system that gives theme designers complete control over the layout of each exhibit on an individual basis. The old approach was visually appealing and pleasant to work with, but it depended on a brittle, JavaScript-powered approach to positioning the elements that made it extremely difficult for theme designers to customize the exhibits. In the new version, we provide sensible defaults for all exhibits, and provide an extremely simple theming system that makes it easy to customize the layout and sizing of the viewports with a few lines of CSS.

  - The feature in the original version that made it possible to use a static image from the Omeka collection as the exhibit base layer has been removed, but replaced by a better solution to the same problem. The old feature was problematic for a couple of reasons - the main issue was that the entire static image had to be loaded as a single tile into the mapping library that controls the map, which means that the performance of the page would rapidly decrease as the size of the image grew. In the long run, this isn't sustainable. In the new version, we've made it possible to add new base layers to an exhibit, which makes it possible create completely custom layers out of any imagery at all - paintings, photographs, documents, diagrams, etc. - that can be consumed by Neatline just like ordinary spatial tiles.

## Upgrading

### Upgrade Neatline to 2.0

Upgrading to Neatline 2.0 is just the same as upgrading any other Omeka plugin: 

  1. Always start by **backing up your database** in the unlikely event that something goes wrong during the upgrade. As an extra precaution, since the migration to 2.0 makes some pretty significant changes to the underlying data, Neatline actually spawns off archived copies of the original Neatline tables, in case you want to revert back to a previous version.

  2. Delete the old `/Neatline` directory under `/plugins` in your Omeka installation.

  3. Download the most recent version of Neatline, unpack the `.zip` archive, and move it into `/plugins`.

  4. In the Omeka administrative interface, click on the **Plugins** link on the top navigation bar and find the listing for Neatline. With the code for the new version in place, you should see a notification saying "You have a new version of Neatline. Please Upgrade!".

  5. Click the **Upgrade** button.

  6. **Important**: After starting the upgrade, you'll immediately see a success message saying that "The Neatline plugin was successfully upgraded!". At this point, Neatline 2.0 is fully installed and ready for use, **but it may take up to 20-30 seconds before the old exhibits are visible under the "Neatline" tab**.

  Behind the scenes, Neatline actually spins up a "background process" - a special, long-running program that does the work of actually converting all of the old content to the new, 2.0 format - that can take a bit longer than the average web request. Depending on the how many exhibits and records you had in the old installation, this could take anywhere from just a couple seconds up to around a minute.

### Install NeatlineWaypoints and NeatlineSimile (optional)

Once the core Neatline plugin is upgraded to 2.0, you'll have access to everything except the timeline and item-browser viewports, which are now broken away into two new "sub-plugins" called NeatlineSimile and NeatlineWaypoints that are installed alongside Neatline and extend the core feature set. Install them just like any other Omeka plugin:

  1. Download the most recent verisons of NeatlineWaypoints and NeatlineSimile, unpack the `.zip` archives, and move the `NeatlineWaypoints` and `NeatlineSimile` folders into `/plugins`.

  2. Go to the **Plugins** pane in the Omeka administrative interface and find the listings for the two new plugins. Click the **Install** button for each.

  3. Once the sub-plugins are installed, the old "activation" settings for each of the old exhibits (eg, which exhibits have the timeline enabled, which have the item browser, which don't, etc.) will automatically be re-applied.
