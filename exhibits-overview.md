---
layout: default
---
# Neatline Exhibits: An Overview

## At a glance

  - An exhibit is the "canvas" for a Neatline project, the environment in which the content is displayed.
  - Exhibit-level settings define basic, high-level defaults for the project (title, base layers, prose narrative, etc).
  - Each exhibit has its own editing environment, where you can create a collection of records (the contents of the exhibit).
  - Likewise, each exhibit has its a separate page on the public-facing version of the website.
  - Each installation of Neatline can contain an indefinite number of exhibits.

## Exhibits overview

Each Neatline project has its own exhibit, which can be thought of as the "canvas" or "environment" for the project - the set of base maps or images on top of which the content is displayed, the text narrative that introduces or describes the project, and the combination of user-interface widgets and components that are enabled for the project (timelines, lists of waypoints, etc).

These high-level configuration options are defined using the "Exhibit Settings" form, which is used to both create new exhibits and edit existing exhibits. Once an exhibit has been created and configured, you can add content to the exhibit by opening the editing environment for the exhibit (generally just called "the editor"), a specialized, interactive map-making application that makes it possible to create and manipulate a collection of records, which make up the actual content of the exhibit.

Most of the work happens in the editor. You might spend just a couple mintutes in the "Exhibit Settings" form, and a couple months building out the content in the editing environment.

## Map exhibits vs. image exhibits

Exhibits can be grouped into two basic categories depending on the type of base layer used as the visual foundation for the project:

  1. **Map-based exhibits**, which are built on top of geospatial layers - OpenStreetMap, the Google API layers, Stamen Design layers, or completely custom tile sets delivered as [WMS layers][wms], [MBTiles][mbtiles], or any other layer format supported by the [OpenLayers][openlayers] mapping library. Out of the box, Neatline comes with a core collection of general-purpose spatial layers, and makes it easy to add custom layers if you need something different.

  2. **Image-based exhibits**, which can be built on top of any static, web-accessible image (.jpg, .png, etc). This makes it possible to use Neatline to create interactive editions of paintings, drawings, photographs, documents, and anything else that has some kind two-dimensional, visual instantiation.

  Exhibits built using regular, static images are easy to set up and don't reguire any additional server infrastructure, but there's a fundamental limitation - since the entire image has to be loaded in bulk into the in-browser application (as compared to the spatial layers, which are loaded dynamically depending on the focus and zoom of the map), the performance of the exhibit will get worse as the image gets larger. Things work well if you're working with a more or less normally-sized image (up to around 2-3000 pixels in height/width), but after that things start to get unacceptably sluggish.

  If you need to use a really high-resolution image, there's an effective workaround that involes essentially tricking Neatline into thinking the image is a spatial layer - you can "faux-georeference" the static image (just assign it random, meaningless spatial coordinates), load it into [Geoserver][geoserver] as a WMS layer, and then import it into an exhibit as the sole base layer, with no map underneath. The image will be presented just as if you were using a regular static file, but you'll have all the scability that comes with a dedicated tile server.

[geoserver]: http://geoserver.org/
[mbtiles]: http://www.mapbox.com/developers/mbtiles/
[wms]: http://en.wikipedia.org/wiki/Web_Map_Service
[openlayers]: http://openlayers.org/
