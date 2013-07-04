# Adding Vector Geometry

## At a Glance

  - The geometry editing controls are located under the "Map" tab.
  - Change the drawing "mode" by selecting different options in the list of radio buttons.
  - Simple shapes (points, lines, polygons) can be drawn directly onto the map.
  - Complex shapes can be designed in vector editors and imported with the "Drag SVG" tool.
  - Existing annotations can be moved, scaled, and reshaped using the modification tools.
  - Delete all annotations for a record by clicking "Clear all Geoemtry."

## Navigate

"Navigate" enables the default "panning" mode of interaction with the map - click and drag to move the map in one direction or another, and use the scroll wheel on your mouse to zoom in and out.

**Tip**: Think of Navigate as your "home base" - after sketching in new geometry with one of the drawing tools, it's usually easiest to reactivate "Navigate" mode, which has the effect of turning off any of the drawing or modification tools. This means that you don't accidentally add unwanted geometry the next time you click on the map.

## Draw Point

Activate this mode to lay down individual points on the map. Once "Draw Point" is enabled, a little piont graphic will follow the cursor when you move the mouse over the map. To put down a point, click down once. To add multiple points, just click multiple times in different places.

A couple of things to remember about points:

  - Once you've added the first point, you'll still be in "Draw Point" mode, which makes it easy to put down another point by accident the next time you click on the map. When you're done with the tool, go ahead and switch back to "Navigate" mode just peace of mind.

  - Points are displayed as little circles on the map, but, at the level of the data, they're actually just dimensionless X/Y coordinates. This means that there's no way for the map to know how to "scale" the circles that are used to represent them, so the circles always stay the same size, no matter what the zoom level. Depending on the content you're trying to represent, this can be good or bad. If you want a "real" circle that changes size with the zoom level, head down to the "Draw Regular Polygon" tool.

## Draw Line

Just like the "Draw Point" tool, except that the points are connected by a line. To draw a line:

  1. Move your cursor to the place on the map where you want the line to start and click down once. Now, when you move the mouse, a line will connect the cursor to the location of the first point.

  2. Click again to lay a second point. Keep on clicking until to put down points until you're ready to place the final point.

  3. You can also draw a smooth line that automatically follows the movement of the cursor. Hold down the Shift key and then click and drag on the map. This lays down a new point for each individual pixel movement registered by the browser.

  **Tip**: Try not to use this feature. It seems interesting at first, but it has the effect of creating _extremely_ dense geometry, which is impossible to maintain (eg, if you decide later on that you want to change something about the shape of the line). If you find yourself needing smooth, curvy shapes, always see if you can use the "Draw SVG" feature, which makes it possible to import vector graphics created in programs like Adobe Illustrator and Inkscape.

  4. Move your cursor to the place where you want the line to end and _double click_. This "completes" the line.

## Draw Polygon

Just like "Draw Line," except that the shape defined by the points is "closed" into a polygon as soon as you put down more than two points. To draw a polygon:

  1. Move your cursor to the place on the map where you want to place the starting "corner" of the polygon and click down once.

  2. Click again to lay a second point. Keep on clicking until to put down points until you're ready to place the final point. Like with the point tool, you can draw smooth shapes by holding down Shift, clicking down on the map, and dragging the cursor.

  4. Move your cursor to the place where you want the last point and double click. This "closes" the polygon.
