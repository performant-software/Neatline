---
layout: default
---
# Neatline Records: An Overview

## At a glance

  - All pieces of content in a Neatline exhibit are records.
  - Records can appear in multiple contexts (map, timeline, etc).
  - Optionally, records can be associated with Omeka items.

## Everything is a record

Records are the fundamental unit of content in Neatline exhibits. In Neatline, _everything_ is a record - vector annotations on the map, plottings on the timeline, listings in the waypoints tray, WMS overlay layers, text annotations in the exhibit narrative, and any other content displayed by sub-plugins. Depending on the type of information that's entered into the record metadata, the same record could be displayed more than once in the same exhibit. For example, if a record has both a geometric annotation value in the `coverage` field and a defined value for the `start_date`, it will be displayed both as a shape on the map and a point on the timeline. When this is the case, Neatline will automatically link all instantiations of the record - when the user clicks on the span on the timeline, the map will zoom to the corresponding location, and vice versa.

## The record data model

All records share a common data model. Similar to elements on Omeka items, all fields are optional.

  - **Title**: A top-level, human-readable identifier. Used as a label for the record. Eg: "War and Peace"
  - **Slug**: A plain-text ID for the record, used to reference the record from TEI or HTML. Eg: `war-and-peace`
  - **Body**: The main content of the record. Could be a short blurb, a long-format essay, a video, etc.
  - **Coverage**: A [WKT][wkt] string that defines a geometric annotation on the map (point, line, polygon, etc).
  - **Tags**: A string of comma-delimited tags used to slice and dice the collection into related subgroups.
  - **Presenter**: The mechanism by which the record content is displayed (static bubble, floating bubble, etc).
  - **Widgets**: Which of the "viewports" the record is visible in (timeline, waypoints browser, etc).
  - **Fill Color**: The color of polygons on the map. Also used as the default color in other contexts.
  - **Fill Color (Selected)**: The color of map polygons when the record is highlighted or selected.
  - **Stroke Color**: The color of the lines running around the edges of polygons on the map.
  - **Stroke Color (Selected)**: The color of the lines when the record is highlighted or selected.
  - **Fill Opacity**: The opacity (translucency) of the polygons on the map.
  - **Fill Opacity (Selected)**: The opacity of map polygons when the recors is highlighted or selected.
  - **Stroke Opacity**: The opacity of lines running around the edges of polygons on the map.
  - **Stroke Opacity (Selected)**: The lines opacity when the record is highlighted or selected.
  - **Stroke Width**: The thickness, in pixels, of the lines around polygons.
  - **Point Radius**: The size of individual points on the map.
  - **Z-Index**: The "stacking" order of records when displayed on the map.
  - **Order / Weight**: Used to determine the display order of a record in relation to other records.
  - **Start Date**: The beginning of the event that the record describes.
  - **End Date**: The end of the event that the record describes.
  - **After Date**: The date _after which_ the record should be displayed in the exhibit.
  - **Before Date**: The date _before which_ the record should be displayed in the exhibit.
  - **Point Image**: A web-accessible image used to display individual points on the map.
  - **WMS Address**: The location of a [WMS][wms] server (eg, an installation of [Geoserver][geoserver]).
  - **WMS Layers**: A comma-delimited collection of layers (hosted on the WMS server) to be overlayed on the map.
  - **Min Zoom**: The map zoom level _above which_ the record is visible (where zooming "in" is "higher").
  - **Max Zoom**: The map zoom level _below which_ the record is visible.
  - **Default Focus**: The lat/lon coordinates that the map zooms to when the record is selected.
  - **Default Zoom**: The zoom level that the map zooms to when the record is selected.

## Neatline records vs. Omeka items

Even though all records share the same data model, they can be divided into two basic categories - _exhibit-specific_ records that exist just inside of a single exhibit, and _item-backed_ records that link back to items in the Omeka collection. The two types behave exactly the same, with one exception - if a Neatline record is associted with an Omeka item, the record's "Title" and "Body" fields will be automatically compiled from the content in the Omeka item. The title will be filled in with the item's Dublin Core "Title" field, and the "Body" will be populated with the compiled metadata output of the entire item. Once the association is established, the content in the Neatline record will be automatically updated whenever the Omeka record is changed.

Why does Neatline make this distinction? Why aren't records just the same thing as items? In the early stages of development, there actually was a one-to-one correspondence between Omeka items and Neatline records - records were just the direct instantiations of Omeka items in a specific Neatline exhibit. The problem, though, is that Neatline exhibits often require a body of "annotative" or "supporting" information that doesn't really fit well in the context of an archival collection. For example, imagine you're working with a collection of correspondence - each letter in the collection is represented by a canonical Dublin Core record in Omeka. Then, when you pull the letters into a Neatline exhibit, you start to sketch in arrows, brackets, flowcharts, and other little bits of presentational information to support the core archival objects.

This supporting information is essential _in the context of the exhibit_, but almost meaningless in isolation, and it often doesn't make sense to formalize all of these elements as first-class archival entities - it's not the best practice to have items like "Blue Arrow 4" or "Outline of New York" mixed heterogeneously into the the collection of letters. To get around this problem, Neatline makes it possible to create these exhibit-specific, "unafilliated" records can be used to formalize this type of annotative information, while also making it possible to create records that link back to the durable archival resources in the Omeka collection. This way, we get the best of both worlds - we can integrate seamlessly with the content in Omeka, and also choose _not_ to integrate with it when doing so would degrade the integrity of the collection.


[wkt]: http://en.wikipedia.org/wiki/Well-known_text
[wms]: http://en.wikipedia.org/wiki/Web_Map_Service
[geoserver]: http://geoserver.org/
