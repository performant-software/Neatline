# Records Overview

Records are the fundamental unit of content in Neatline exhibits. In Neatline, _everything_ is a record - vector annotations on the map, plottings on the timeline, listings in the waypoints tray, WMS overlay layers, text annotations in the exhibit narrative, and any other content displayed by sub-plugins. Records have a couple of interesting properties:

  - **Records can appear in multiple places** - Depending on the type of information that's entered into the record metadata, the same record could be displayed in more than one place in the exhibit. For example, a record could be represented by a point on the map and a span on the timeline. Neatline will always automatically "interlink" instantiations of the same record - when the user clicks on the span on the timeline, the map will zoom to the corresponding location, and vice versa.

  - **Records can point back to Omeka items** - There are two basic types of records - _exhibit-specific_ records that exist just inside of a single exhibit, and _item-backed_ records that link back to an item in the Omeka collection. The two types behave exactly the same, with one exception - if a Neatline record is associted with an Omeka item, the record's "Title" and "Body" fields will be automatically compiled from the content in the Omeka item. The title will be filled in with the item's Dublin Core "Title" field, and the "Body" will be populated with the compiled metadata output of the entire item. If the Omeka item is updated, the content in the Neatline record is automatically updated as well.

  - **Records can be created created manually in an exhibit** - Individual records can be created manually in the Neatline editor just by clicking the "New Record" button at the top of the screen.

  - **Or they can be imported in bulk from Omeka** - Alternatively, you can also populate Neatline exhibits by batch-importing large quantities of items from your Omeka collection.
