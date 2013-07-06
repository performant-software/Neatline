# Editing Record Visibility Settings

## At a glance

  - Use "Min Zoom" and "Max Zoom" to hide or display the record depending on the zoom level of the map.
  - Use the "Use Current" buttons to insert the current zoom level as the value for "Min/Max Zoom."
  - Use "Default Focus/Zoom" to set the location and zoom level that the map "snaps" to when the record is selected.
  - Use the "Use Current Viewport as Default" to use the current focus/zoom as the record default.

## Min Zoom

The zoom level "above" which the record will be visible, with zooming "in" being "higher" (eg, focusing on Spain is "higher" than focusing on Europe). For example, if the record has a point on the map and "Min Zoom" is `10`, then the point will be invisible when the map at zoom level `9`, and will become visible as soon as the map zooms to `10`.

To set the value, just zoom the map the the level that you want to use for the value, and click the "Use Current" button next to the field title to automatically insert the current zoom offset into the input.

## Max Zoom

The zoom level "below" which the record will be visible, with zooming "out" being "lower" (eg, focusing on Europe is "lower" than focusing on Spain). For example, if the record has a point on the map and "Max Zoom" is `10`, then the point will be invisible when the map at zoom level `11`, and will become visible as soon as the map zooms to `10`.

Like with "Min Zoom," click the "Use Current" button next to the field title to automatically insert the current zoom level into the input.

## Default Focus and Default Zoom

These two fields define the focus location and zoom level that the map "snaps" to when the record is selected. For example, if the record is represented by a vector annotation on the map, and the user clicks on the title of the record in the Waypoints panel, the map will move to the location and zoom level defined by these fields. Think of these fields as a related pair that work together to set the record's "framing" or "home base" in the exhibit.

To set a default focus and zoom, just move the map to the exact location and zoom level that you want to use, and click the "Use Current Viewport as Default" to insert the current values into the inputs.

If no values are provided for these fields, Neatline will fall back on an automatically-computed focus location by centering the map around the geometric extent of the record's vector annotations on the map. This can often work well without any modification, but there are a couple of cases when you might want to explicitly set a custom focus:

  - If the record is represented with a single point, Neatline will always zoom in to the _highest possible zoom level_, since points are effectively dimensionless, infinitely-small dots. This is often undesirable. To fix, just zoom the map back to a reasonable level and click "Use Current Viewport as Default."

  - Even when the record is represented by lines or polygons that result in a fairly reasonable automatic focus, there are times when you want to tweak the default viewport, perhaps to situate the record in the context of some other nearby feature on the map. For example, imagine that the record represents the location of a battle that was affected by the presence hill to the north of the battle site. You might want the default focus of the record to be zoomed back a bit and moved up to the north so that the hill appears in the default viewport of the record for the battle.
