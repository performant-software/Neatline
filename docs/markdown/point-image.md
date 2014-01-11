## Point Image

By default, points on the map are represented with circle graphics, the size of which can be configured by the "Point Radius" field in the "Dimensions" field set. This field makes it possible to replace this default representation of the points with any web-accessible image - anything that can be accessed in a browser, including images uploaded as file attachments to Omeka items. This makes it possible to place any kind of graphic on the map - pins, icons, image thumbnails, etc.

Once a "Point Image" is provided, the points continue to behave just like regular points in all other ways. For example, you can change the size of the point-images by changing the "Point Radius" field, and you can configure the opacities by changing the "Fill Opacity" and "Fill Opacity (Selected)" fields. 

To set a point image, just enter the complete URL of the image. For example, to use the Google logo:

`https://www.google.com/images/srpr/logo11w.png`

**Important**: Since we're really just changing the cosmetic appearance of the points, there are some restrictions:

  - Like regular points, point-images will always stay the same size (the value of "Point Radius"), no matter what the zoom level of the map. If you need an image to scale depending on the zoom level, you'll need to use a WMS overlay hosted by Geoserber (see below).

  - Point-images can't be "rotated" - they will always have the exact orientation of the source image. Again, if you find youself wanting to pivot the image to make it line up with something on the underlying base layer, you're probably looking for the type of functionality provided by a WMS overlay.

**Tip**: When preparing images for use as point-images, try to use image types like `*.png` that support transparency. Otherwise, you'll have unsightly white or black boxes filling in the negative space surrounding the graphics.
