## Draw Point

Use this control to lay down individual points on the map.

  1. Select the "Draw Point" radio button, move the cursor to the location on the map where you want to place the point, and click down once to drop the point.

  2. To add multiple points, just click multiple times in different places.

**Important**: Points are displayed as circles on the map, but, in the underlying data, they're actually represented as dimensionless pairs of lat/lon coordinates. Since they're infinitely small and have no measurable "size" that can be correlated to the scale of the map, the points will always stay the same size, regardless of the zoom level of the map (the size of the circles can be controlled by the "Point Radius" field in the "Style" tab).

Depending on the situation, this can be good or bad. For example, if you're using points in conjunction with the "Point Image" feature to plot thumbnails of photographs onto the map, you might want the points to stay the same size at different zoom levels so that the preview images never become too big or too small. If you want a real geometric circle that changes size with the zoom level, use the "Draw Regular Polygon" tool.
