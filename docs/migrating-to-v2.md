## Migrating to Neatline 2.0

Neatline 2.0, which was released on July 2, 2013, is a major update to the project that includes a large number of improvements to the existing feature-set and adds a number of new features designed to make it easier to create larger and more complex exhibits. Some of the highlights in the new version:

  - **[A high-performance, real-time spatial querying system](http://dclure.org/logs/neatline-one-million-records/)** (the map loads just the subset of information that it needs to fill in the viewport at any given moment) that makes it possible to work with really large collections of records – as many as about 1,000,000 in a single exhibit;

  - **[The ability to import SVG vector graphics](http://dclure.org/logs/neatline-drawing-svg-on-maps/)** created in programs like Adobe Illustrator or Inkscape and interactively “drag” them into position as first-class geometry in a Neatline exhibit;

  - **[A Neatline-flavored dialect of CSS](http://dclure.org/logs/interactive-css-in-neatline-2-0/)**, integrated into the editing environment, that makes it possible to quickly perform bulk updates on large collections of tagged records;

  - **The ability to add custom base layers**, which could be regular geospatial tile sets like the included OpenStreetMap or Google layers, or completely non-spatial entities like paintings, drawings, photographs, documents, diagrams, or anything else that can be captured as an image;

  - **A total rewrite of the front-end JavaScript application** (both the editing environment and the public-facing exhibit views) that provides a more minimalistic and responsive environment for creating and viewing exhibits;

  - **[A flexible user-permissions system](http://dclure.org/logs/announcing-neatline-2-0-alpha2/)**, designed for large-scale classroom use, that makes it possible to cordon off individual student/contributor accounts and grant them access only to their own content;

  - **An exhibit-specific theming system**, which makes it possible for designers and developers to completely customize the appearance, layout, and interactivity of Neatline projects on a per-exhibit basis;

  - **A new programming API and “sub-plugin” system** that makes it possible for developers to add custom functionality – everything from simple user-interface widgets (sliders, legends, scrollers, forward-and-backward buttons, etc.) up to really extensive modifications that expand the core data model and add totally new interactions.

### Upgrading from Neatline 1.x

Some of these changes and additions called for some pretty dramatic reengineering of the core codebase. Almost all of the features from the 1.x releases are preserved in 2.0, and almost all exhibits will behave almost exactly the same after upgrading to 2.0. In a handful of very carefully-chosen places, though, we made changes that will alter the behavior of certain types of exhibits. In each case, these changes were made because we felt that the new approach was significantly more maintainable, performant, standards-compliant, or theoretically sound. In all cases where a feature was removed, we've added an alternate method to accomplish the same effect.

Here are the important changes:

  - In the new version, the "Timeline" and "Items" panels (which could be enabled via the "Layout Options" drop-down menu in the editor) have been broken out into separate plugins - NeatlineSimile and NeatlineWaypoints - that extend the Neatline plugin, which houses the core content management system. These two "sub-plugins" integrate seamlessly with Neatline - after upgrading from 1.x to 2.0, just install the two widget plugins, and the timeline and item-browser panels will be automatically restored to their original states in all of your exhibits.

  - The "Layout Editor" feature from the first version - which made it possible to interactively toggle and position the three viewports - has been removed in favor of a much more flexible theming system that gives theme designers complete control over the layout of each exhibit on an individual basis. The old approach was visually appealing and pleasant to work with, but it depended on a brittle, JavaScript-powered approach to positioning the elements that made it extremely difficult for theme designers to customize the exhibits. In the new version, we provide sensible defaults for all exhibits, and provide an extremely simple theming system that makes it easy to customize the layout and sizing of the viewports with a few lines of CSS.

  - 
