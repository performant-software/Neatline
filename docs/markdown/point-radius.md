## Point Radius

The radius of individual points on the map. You'll almost always want this value to be greater than 0 - otherwise, points will be invisible, in which case they should probably just be deleted. If you're making use of the "Point Image" field to change the visual representation of points (see the "Editing Record Imagery" guide), this field will also determine the size of the image graphics overlayed on the map.

**Important**: The point radius is a static value, meaning that the size of the points on the map _won't change with the zoom level of the map_, as a polygon or line would. This is because points are actually just dimensionless pairs of lat/lon coordinates. Since they're infinitely small and have no measurable "size" that can be correlated to the scale of the map, the points will always stay the same size, regardless of the zoom level of the map

To change the opacity, type directly into the input or change the value smoothly down by clicking and moving the mouse up or down on the page.
