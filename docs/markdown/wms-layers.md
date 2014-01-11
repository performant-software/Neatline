## WMS Layers

A comma-delimited list of layers on the served defined by "WMS Layers," such as:

`hotchkiss:fredericksburg,hotchkiss:chancellorsville`

Once a WMS address and layers, Neatline will automatically overlay the requested layers on top of the base layer. WMS layers react to many of the same styling, visibility, ordering settings that can be used to configure the behavior of regular vector annotations:

  - Use the "Fill Opacity" field to control the opacity of the WMS overlay.

  - If an "After Date" or "Before Date" is defined for the record, the WMS layers will appear and disappear as the timeline is dragged in and out of the visibility interval defined by the date fields. For example, if the "After Date" is set to `2000`, the WMS layer will be invisible when the timeline is focused at `1999`.

  - If a "Min Zoom" or "Max Zoom" is defined for the record, the WMS layer will appear and disappear as the map is zoomed in and out of the visibility interval defined by the zoom fields. For example, if "Min Zoom" is set to `10`, the WMS layer will be invisible when the map is at zoom level `9`.
