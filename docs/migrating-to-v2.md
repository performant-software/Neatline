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
