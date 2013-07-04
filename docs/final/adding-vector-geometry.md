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

  2. Click again to lay a second point. Keep on clicking to add multiple points. You can also draw a smooth line that automatically follows the movement of the cursor. Hold down the Shift key and then click and drag on the map. This lays down a new point for each individual pixel movement registered by the browser.

  **Tip**: This feature has the effect of creating _extremely_ dense geometry, which is very difficult to maintain (eg, if you decide later on that you want to change the shape of the line, you would have to manually move hundrds or thousands of individual points). If you need smooth, curvy shapes, always see if you can use the "Draw SVG" feature, which makes it possible to import easily-maintained vector graphics created in programs like Adobe Illustrator and Inkscape.

  4. When you're ready to lay down the final point, move your cursor to the place where you want the line to end and _double click_. This "completes" the line.

## Draw Polygon

Just like "Draw Line," except that the shape defined by the points is "closed" into a polygon as soon as you put down more than two points. To draw a polygon:

  1. Move your cursor to the place on the map where you want to place the starting "corner" of the polygon and click down once.

  2. Click again to lay a second point. Keep on clicking until to add multiple points. Like with the point tool, you can draw smooth shapes by holding down Shift, clicking down on the map, and dragging the cursor.

  4. When you're ready to lay down the final point, move your cursor to the place where you want the last corner of the shapee and double click. This "closes" the polygon.

## Draw Regular Polygon

"Draw Regular Polygon" creates closed shapes just like the regular "Draw Polygon" tools, but it doesn't let you manually position the individual pionts - instead, it automatically creates a polygon with a given number of sides. This is useful if you want to create consistently-shaped geometric primitives (triangles, squares, circles, etc.), and it can also be a good way to sketch in basic components of more complex shapes:

  1. Move your cursor to the place on the map where you want the _center_ of the polygon to be positioned.

  2. Click down and, while still holding down on the mouse button, move the cursor in any direction away from the center point. As you drag the mouse, a polygon will be dynamically rendered on the map with a radius equal to the distance between the cursor and the center point. Rotate the cursor around the center point to change the orientation of the polygon.

  3. When the polygon is positioned correctly, release the mouse button to lock the shape in place.

There are a couple of configuration options for the regular polygon tool:

  - **Sides**: The number of sides on the polygon. For example, `3` will draw triandles, `4` squares, etc. As this number gets higher, the resulting shape will smooth out into a circle/ellipse. This is a good way to create circular shapes with "real" diameters that will expand and shrink with the zoom level of the map (as opposed to the circles used to represent points, which are "dimensionless" and always stay the same size - see the "Draw Point" section). Don't go overboard with the number of sides - in most cases, 30-50 sides is more than enough to create a smooth shape.

  - **Snap Angle**: As you drag the cursor away from the center point, the rotation of the polygon will "snap" into a series of fixed angles. This makes it possible to create a series of shapes with the exact same orientation on the map (eg, a series of rectangles with sides that are all perfectly aligned with the cardinal directions). This field controls the size of the angle between each of the consecutive rotations.

  For example, if you set a snap angle of `30` degrees, it will only be possible to orient the shape in a couple of different ways; as you decrease the angle, the rotation becomes and more granular, and at `0` the snapping is completely disabled.

  - **Irregular**: By default, all of the sides of the polygon are equal in length (eg, a 3-sided shape is always an equilateral triangle, a 4-sided shape is always a square, etc). Check this box to make it possible to create "skewed" shapes with sides of different lengths - rectangles instead of squares, ellipses instead of circles.

  **Tip**: This setting can have strange interactions with certain "Snap Angle" values - if you need to create an irregular shape, it's generally easiest to set the snap angle to 0, drag out the shape, and then rotate it as needed with the "Rotate Shape" tool.

## Draw SVG

The standard "Draw Point/Line/Polygon" tools are good for simple, diagrammatic shapes - dots, rectangles, circles, simple arrows, etc. The problem, though, is that they don't really scale well - what if you want to create a really smooth, intricate shape? Neatline exhibits are always exercises in information design, and there's a class of "illustrative" annotation that doesn't fit well into the blocky aesthetic supported by the standard-issue GIS tools. You could painstakingly sketch out complex illustrations using the line and polygon tools, but the resulting geometry is brittle and difficult to maintain. What if you decide later on that you want to change the drawing? You'd have to manually reposition hundreds or thousands of points.

To address this problem, Neatline 2.0 introduced the "Draw SVG" tool, which makes it possible to create high-fidelity, easily-maintained illustrations in specialized vector editing programs like [Adobe Illustrator][illustrator] or [Inkscape][inkscape] (and even in-browser tools like [SVG-Edit][svg-edit]) and import them directly into the Neatline editor. This way, you can do the difficult work of vector illustration in tools that are specifically designed for that task, and then drop the final products into Neatline exhibits. Later in, if you want to change something about the drawing, you can just go back to the original source file, make the change, and then update the Neatline exhibit with the new content.

Neatline reads a commonly-used serialization format called SVG (Scalable Vector Graphics), a form of XML that encodes geometric information. To start, you'll need to save off your vector file as an SVG document:

Using **[Adobe Illustrator][illustrator]**: 

  1. Click **File** > **Save As**.

  2. In the "Format" drop-down menu, select "SVG (svg)." The "SVG Options" modal should be displayed.

  3. In the "Fonts" fieldset, set "Type" to **Convert to outline**. This ensures that means text elements in the document will be saved as raw geometric paths, not abstract `<text>` elements that can't be parsed by Neatline.

  4. Click **OK** to save.

Using **[Inkscape][inkscape]**: 

  1. Before saving, if you have any text elements in the document, first convert them to raw path elements by selecting them and entering Ctrl+Shift+C (see the [documentation][inkscape-docs] for more inforation.)

  2. Click **File** > **Save As**.

  3. In the dropdown menu for the format, select **Plain SVG**.

  4. Click **Save**.

Once the SVG document is saved off, we can import it into Neatline:

  1. Find the `.svg` file that was created in the previous step. Open it with a plain text editor or a code editor by right clicking on the file and choosing a program from the list of options in "Open With." It doesn't matter what you use - as long as you can get at the raw SVG output.

  2. You should see a soup of dense XML markup with lots of numbers. Copy the content of the entire document to the clipboard.

  3. Go back to the Neatline editor and click on the **Enter Markup** link next to the **Draw SVG** option.

  4. Paste the SVG markup into the "SVG" box.

  5. Optionally, set a custom "Density" value. This field controls the number of points that Neatline will generate when converting SVG `<path>` elements to hard-coded spatial coordinates - lower numbers produce "blockier" shapes, higher numbers produce "smoother" shapes.

  6. Click **Parse**. Behind the scenes, Neatline converts the SVG markup into geospatial coordinates.

  7. Now, you can drag the SVG document onto the map in the same way that you would drag out a regular polygon shape. Move the cursor to the location on the map where you want the _bottom left corner_ of the illustration to be location, click down, and move the cursor in any direction. The illustration will scale and rotate according to the position of the mouse.

  7. When the illustration is positioned correctly, release the mouse button to lock the geometry into place.

  **Tip**: It's easy to make mistakes when doing this, and it often takes a couple tries to get things right. If you mess up, it's easiest just to totally wipe out the previous attempt by clicking the "Clear all Geometry" button at the bottom of the form.


[illustrator]: http://www.adobe.com/products/illustrator.html
[inkscape]: http://inkscape.org/
[inkscape-docs]: http://wiki.inkscape.org/wiki/index.php/Inkscape_for_Adobe_Illustrator_users
[svg-edit]: http://svg-edit.googlecode.com/svn/branches/2.6/editor/svg-editor.html
