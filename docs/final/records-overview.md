# Records Overview

## At a Glance

  - Everything in a Neatline exhibit is a record.
  - Records can appear in multiple contexts (map, timeline, etc).
  - Optionally, records can be associated with Omeka items.
  - Records can be created manually or batch-imported from Omeka.

Records are the fundamental unit of content in Neatline exhibits. In Neatline, _everything_ is a record - vector annotations on the map, plottings on the timeline, listings in the waypoints tray, WMS overlay layers, text annotations in the exhibit narrative, and any other content displayed by sub-plugins. Depending on the type of information that's entered into the record metadata, the same record could be displayed in more than one place in the exhibit. For example, a record could be represented by a point on the map and a span on the timeline. Neatline will always automatically "interlink" instantiations of the same record - when the user clicks on the span on the timeline, the map will zoom to the corresponding location, and vice versa.

## Exhibit-Specific vs. Item-Backed Records.

There are two basic types of records - _exhibit-specific_ records that exist just inside of a single exhibit, and _item-backed_ records that link back to items in the Omeka collection. The two types behave exactly the same, with one exception - if a Neatline record is associted with an Omeka item, the record's "Title" and "Body" fields will be automatically compiled from the content in the Omeka item. The title will be filled in with the item's Dublin Core "Title" field, and the "Body" will be populated with the compiled metadata output of the entire item. Once the association is established, the content in the Neatline record will be automatically updated whenever the Omeka record is changed.

Why does Neatline make this distinction? Originally, in the early stages of development on the project, there was a one-to-one correspondence between Neatline records and Omeka items - records were just the direct instantiations of Omeka items in a specific Neatline exhibit. The problem, though, is that Neatline exhibits often require a body of "annotative" or "supporting" information that doesn't really fit well in the context of an archival collection. For example, imagine you're working with a collection of correspondence - each letter in the collection is represented by a canonical Dublin Core record in Omeka. Then, when you pull the letters into a Neatline exhibit, you start to sketch in little arrows, flowcharts, and other "contextual" information that support the core archival objects.

This supporting information is incredibly important _in the context of the exhibit_, but almost meaningless in isolation, and it often doesn't make sense to formalize all of these elements as first-class archival entities - it's not the best practice to have items like "Blue Arrow 4" or "Outline of New York" mixed heterogeneously into the the collection of letters. To get around this problem, Neatline makes it possible to create these exhibit-specific, "unafilliated" records inside of Neatline exhibits that can be used to formalize this type of annotative information, and also to create records that point backwards at durable archival resources in the collection. This way, we get the best of both worlds - we can integrate seamlessly with the content in Omeka, and also choose _not_ to integrate with it when doing so would pollute the archival integrity of the collection.ulate Neatline exhibits by batch-importing large quantities of items from your Omeka collection.
