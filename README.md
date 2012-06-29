# Neatline

Neatline is a geotemporal exhibit-buiding framework that makes it possible to create beautiful, complex maps and connect them with timelines. Neatline is built as a suite of plugins for the Omeka, a digital archive-building framework that supplies a powerful platform for content management and web publication.

![editor](http://23.21.98.97/wp-content/uploads/2012/06/editor.png)

The basic workflow looks like this:

  * **Create an environment for your exhibit**: Use georeferenced historical maps, modern-geography tile sets, or static images.

  * **Create a collection of records**: Records represent anything at all - buildings, letters, people, events, physical objects, or interpretive sketchwork. If you already have an Omeka collection, Neatline integrates deeply with your existing content.

  * **Configure a custom layout**: Toggle viewports on and off, change their proportions, and drag them into different arrangements.

  * **Plot records on maps and timelines**: Create complex vector drawings, points, and spans. Set colors, opacities, line widths, point radii, and gradients. Add popup bubbles and define interactions among the map, timeline, and a content-browser pane.

  * **Model change over time**: Set visibility intervals on a per-record basis, making it possible to create complex time-servies animations. Define hierarchical relationships among items, making it possible to curate "batches" of related elements in an exhibit that phase in and out of view as a group.

  * **Create narratives and arguments**: Drag elements into specific orderings or lay down numbered waypoints to build complex stories that unfold content in a controlled sequence. 

Neatline is not designed to generate automatic visualizations of large geospatial datasets. Instead, Neatline provides an open-ended interpretive environment that makes it possible to mount humanistic ideas, narratives, and arguments on maps and timelines. If conventional GIS tools are like a sheet of graph paper, Neatline is a sketchbook or a canvas.

## Installation and Configuration

Neatline is a plugin for [Omeka][omeka], an open-source web publishing platform that makes it possible to create, curate, and publish archival collections based on Dublin Core or EAD metadata. Neatline is installed on top of Omeka, similar to a plugin for Wordpress or a Drupal module.

Omeka and Neatline are PHP/MySQL applications that will run on almost any commercial hosting provider. Before you start, you'll need:

  1. A hosting environment that supports PHP and MySQL;
  2. A way to transfer files onto your server space and make simple text edits. In most cases, a simple FTP client like [FileZilla][filezilla] works well. 
  3. Credentials for a MySQL user on your server and the name of a fresh, production database for the Omeka installation. If you don't already have a database user account, most commercial hosting providers provide access to a point-and-click database administration tool like phpMyAdmin that allows you to create databases and users.

#### Install Omeka

For detailed instructions on installing Omeka, refer to [Omeka's official documentation][omeka-install-documentation].

#### Install Neatline

  1. Go to the [Neatline download][neatline-download] page and download the plugin.
  2. Once the file is finished downloading, uncompress the .zip file and place the "Neatline" directory in the plugins/ folder in your Omeka installation.
  3. Open a web browser and go to _your-omeka-site.org/admin_, enter your administrative credentials, and click on the "Settings" button at the top right of the screen.
  4. Click on the "Plugins" tab in the vertical column on the left and find the listing for the Neatline plugin.
  5. Click the "Install" button.

Once the installation is finished, you'll see a new tab along the top of the administrative interface labeled "Neatline."

#### Install Geoserver

If you want to use Neatline in conjunction with the Neatline Maps plugin to incorporate web map services (WMS) into your exhibits (for example, to create editions of georeferenced historical maps), you'll need to have access to an installation of [Geoserver][geoserver], a powerful open-source geospatial server that generates and delivers the WMS layers.

If you have experience administering Java applications, you can download and install your own instance of Geoserver. Compared with LAMP stack applications like Omeka, Neatline, Wordpress, or Drupal, Geoserver is relatively difficult to install, deploy, and maintain.

If you don't have the resources to manage your own installation, there are two ways to get up and running: If you have access to institutional IT services, ask if they can provide Geoserver hosting. If not, there are also commercial hosting available from companies like [AcuGIS][acugis], although we don't have experience with these services and can't vouch for them.

For detailed instructions on installing Geoserver, refer to [Geoserver's official documentation][geoserver-install-documentation].

#### Create a New Exhibit

  1. Click on the "Neatline" tab at he top of the administrative interface.
  2. Click the "Create an Exhibit" button.
  3. Enter a title for the exhibit. The title will be displayed at the top of the public display view. 
  4. Optionally, enter a description for the exhibit. The description is something of a catch-all category designed to house introductory text for the exhibit. This could just be 2-3 sentences to set the stage, but it could also be used to present long-format prose to go with the exhibit.
  5. Enter a slug for the exhibit. The slug is used to form the public-facing URL for the exhibit. By default, a slug will be auto-generated from the text that you typed into the "Title" field. If you want to edit the default slug, click on the input and type a new string. Slugs can only contain letters, numbers, and hyphens (no spaces).
  6. (Optional): In addition to the default option of using georeferenced layers as the foundation for the exhibit (OpenStreetMap/Google tiles, rectified geotiff files, etc.), you can also use any static image associated with an Omeka item as the base layer for the exhibit. Use the "Choose an Image" dropdown to browse all images in your Omeka archive, grouped by parent item.
    * **Note:** You can't mix static images and geographic layers. If you select a static image to build the exhibit on, you won't be able to add georeferenced elements down the line, since the "spatial" annotation data will be relative to the dimensions of the image, not a geographic coordinate set.
  5. Check the "Public" box if you want the exhibit to be publishes on your site and visible to anonymous users. By default, exhibits are only visible to administrators.
  8. Click "Save Neatline."

#### Browse Exhibits

After creating an exhibit, you'll be taken back to the exhibits browse
screen, where you'll see a listing for the new exhibit.

  * The "Exhibit" column lists the title of the exhibit, the slug, and links to edit the exhibit details and delete the exhibit. Click on the title to go to the public-facing view of the exhibit.
  * The link in the "Items Query" column links to a form where you can specify a subset of your Omeka collection to make avaialble in the Neatline editing environment for the exhibit (see below).
  * The "Modified" column lists the date and time when the content of the exhibit was last updated.
  * The "# Items" column lists the number of records that are plotted on at least one of the three available viewports in a Neatline exhibit.
  * The "Public" column shows whether the exhibit is publicly-accessible.
  * The link in the "Edit" column links to the Neatline exhibit-building application.

#### Edit Exhibit Metadata

Click the "Edit Details" link in the "Exhibit" column to edit the exhibit title, description, slug, and public status. Click "Save Exhibit" to commit the changes.

#### Delete an Exhibit 

Click the "Delete" link in the "Exhibit" column to delete the exhibit. Click "Delete" again on the confirmation popup. **This cannot be undone.**

#### Define an Items Query

To make items in your Omeka collection available for manipulation inside the Neatline editing interface, you need to define a "query" on the collection that isolates a subset of items that are relevant to the exhibit. This functionality is in place to make it possible to use the Neatline editor with extremely large Omeka collections (many thousands of items) that would choke up the interface if all of the content were loaded in at once.

To define an items query for an exhibit, click on the "Edit Query" link in the exhibit's listing in the browse view. The query form is identical to the advanced search form in the Omeka items browser. You can search by keyword, specific field values, id ranges, collections, types, users, tags, public/non-public, and featured/non-featured - and any combination thereof.

Once you've created a query, click the "Search" button at the bottom of the page to save the configuration. Now, when you go into the editing environment for that exhibit, the content management bar on the left of the screen will be pre-populated with a list of all the items in your collection that match the query.

## Building Neatline Exhibits

At the heart of Neatline is the editing application, a web interface that lets you create exhibits, add records, annotate maps and timelines, and construct complex sequences and progressions that make arguments and tell stories about geospatial entities. 

To open the editing interface for an exhibit, click on the title of the exhibit on the exhibits browse page.

### Create a Layout

Neatline includes a flexible layout builder that lets you choose exactly which elements you want present in your exhibit, how you want to arrange them, and how large they should be relative to one another.

To open the layout configuration menu, click on the "Layout Editor" link at the top right of the editing interface.

#### Toggle Viewports On and Off

By default, all three viewports - Map, Timeline, and Items - are activated for new exhibits. To toggle viewports, click on the the buttons along the top of the "Layout Editor" dropdown. The preview layout will automatically update and display the new viewport configuration. Once a viewport has been disabled, click on its toggle button again to re-enable it.

Click the "Save Arrangement" button to save the changes to the server.

#### Drag Viewports to Create New Arrangements

Click and drag the viewports in the preview layout to reconfigure the arrangement of the blocks. You can switch the vertical positions of the Map and Timeline and change the height and horizontal alignment of the Items block.

Click the "Save Arrangement" button to save the changes to the server.

#### Set Default Viewport Heights and Widths

As you move your mouse over borders between the blocks in the preview layout, a dotted line will appear along the border and the pointer will change to a resize cursor. Click and drag to adjust the height and width of any of the blocks in the layout.

Click the "Save Arrangement" button to save the changes to the server.

### Create Records

Fundamentally, a Neatline exhibit is just a collection of records that are plotted on some combination of the map, on the timeline, or in the content-browser panel.

There are two kinds of records:

  1. **Records backed by Omeka items**: Records can correspond to items in your Omeka collection. If you've defined a query on your Omeka collection by way of the "Edit Query" form (see above), all items that match the query will be listed in the record browser pane on the left side of the screen. These records will be pre-populated with the Dublin Core Title and Description fields of the corresponding Omeka items, and you have the option of directly importing the entire item metadata output as the description content for the record.

    The same Omeka item can have completely different instantiations in different exhibits - although Neatline pulls _in_ data from the Omeka collection, all data added or changed by way of the Neatline editor is totally endemic to that particular exhibit, and does not get pushed back onto the original Dublin Core record. This means that the same item (or group of items) can be represented in completely different ways in different exhibits, making it possible to thread items into specific contexts and narratives.


  2. **Exhibit-specific records**: Alternatively, you can also create records on a one-off basis inside a specific exhibit. This is useful in situations where you want to represent some sort of entity in your exhibit that doesn't necessarily warrant its own long-format metadata record.

    For example, if you're creating an interactive edition of a Civil War battle map and want to make note of a specific troop movement, it might not make sense to include an Omeka item called "Jackson's flanking movement" in a collection of maps. In this case, it would make more sense to create "Jackson's flanking movement" as an exhibit-specific record that does not have a representation outside of the exhibit in which it is displayed.


To add a new record to the exhibit:

  1. To plot a record that corresponds to an Omeka item, just click the listing for the record in the record browser on the left side of the screen. To crete a new exhibit-specific record, click the "New Item" button at the top of the left pane in the editor. A new listing for the "[Untitled]" record will appear at the top of the stack under the "Neatline Records" heading. Click the title to open the record.

  2. When you click on a record title, a form appears with four fieldsets labeled with tabs at the top of the form: "Text," "Temporal," "Styling", and "Relations." Work through the four fieldsets and fill out all the information necessary to describe the record in the context of the exhibit (see below for detailed information about each fieldset).

  4. When you're done adding or editing information, click the "Save" button at the bottom of the form to commit the changes. Click on the title or on the "Close Record" button to contract the form. **Note:** If you add or edit data, be sure to click "Save" before closing the form. Otherwise, your changes will be lost.

#### Record Fields

Records have these fieldsets:

  * Text

    * **Title**: The title is used to label the record on the timeline and in the prose description tray. The form field includes a simple rich-text editor, which can be used to apply different colors, font-sizes, and emphases to the text.

    * **Description**: The description is a catch-all field that can be used in a number of different ways - it can accomodate anything from short little snippets of annotation to long-format interpretive prose. This field includes a more complex rich-text editor, which makes it possible to use apply advanced formatting options like bullets, numbered lists, indentations, text alignments, links, and images. If you need complete control over the markup and styling, click the "\< \>" button at the bottom right of the control bar to view and edit the raw HTML for the field.

    * **Show pop-up bubble**: Check this box if you want the title and description to be displayed in a popup bubble when the user hovers the cursor over the representation of the record on the map or timeline.

    * **Use default item metadata**: Check this box to import the complete Dublin Core metadata output for the Omeka item that the record corresponds to into the description field on the record. When the box is checked, Neatline will immediately load the metadata into the description field and disable the text editor. This box is grayed out for exhibit-specific records, since they do not correspond to an item in the Omeka collection.

  * Temporal 

    * **Start Date**: The start date of the object, event, or concept represented by the record. This is the only field that is required in order for the record to be displayed on the timeline. Dates must be entered in standard [ISO 8601][iso8601] format.

    * **End Date**: Same as start date. If an end date is entered, the record will be represented as a span (as opposed to a single point).

    * **Start Visible Date**: If set, the representations of the record on the map and record description panel will only be displayed when the timeline is scrolled to a center position _after_ this date.

    * **End Visible Date**: If set, the representations of the record on the map and record description panel will only be displayed when the timeline is scrolled to a center position _before_ this date.

    * **Date Ambiguity**: The date ambiguity widget lets you drag out a gradient of uncertainty or fuzziness across a time interval. Drag the two controls handles inward to fuzziness around the edges, or create a continuous increase or decrease by dragging both handles all the way to one side or the other.

  * Styling 

    * **Shape Color**: The fill color of the polygons (everything inside of the border lines, not including the lines). Click on the  swatch to the right of the input to open a color picker.

    * **Line Color**: The color of the border lines. Click on the  swatch to the right of the input to open a color picker.

    * **Highlight Color**: The color of the lines, polygons, and points when the record is highlighted or selected. Click on the swatch to the right of the input to open a color picker.

    * **Fill Opacity**: The opacity of the polygons and/or WMS layer (not including the border lines). Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Select Opacity**: The opacity of the polygons and/or WMS layer when the record is selected (not including the border lines). Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Line Opacity**: The opacity of the border lines. Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Graphic Opacity**: If an external image URL is entered in the "Point Graphic" field (see below), this controls the opacity of image on the map. Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Line Width**: The thickness of the border lines in pixels. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Although there's no theoretical limit on how thick the lines can be, in practice you'll probably want to keep them between about 1-10 pixels.

    * **Point Radius**: The radius of standalone points and verties on lines and polygons. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Like with the line thickness parameter, there's no limit to how large points can be, but keep in mind that the radius of points on the map is _fixed_, in that it is not affected by the zoom level - a 5-pixel point will be 5 pixels when the map is zoomed to 100 meters or 1000 miles.

    * **Point Graphic**: Enter a URL to an external image to use the image as the graphical representation of a point on the map. This makes it possible to layer images on to of the map. Since the images are the same as geometric points in the underlying implementation, they share the property of remaining the same absolute dimension no matter what the zoom level of the map. To change the size of the image(s), just edit the "Point Radius" value.

    * **Reset Item Styles**: Click this button to void any item-specific styles set for the record with any of the 6 previous controls. This will cause the record to fall back to the exhibit-wide defaults, which are configured by way of the "Map Settings" dropdown in the top bar.

    * **Set Map Focus**: The map focus for a record is the position and zoom that the map viewport is set to when the record is activated by any action elsewhere in the exhibit. For example, if a user clicks on a listing for the record in the description tray or scrolls to the item using the next and previous arrows, the map will automatically refocus at the latitude/longitude and zoom level defined by the map focus for the item. 

        By default, if a custom focus has not been set, Neatline approximates a map focus for the record based on the dimensions of the shapes, lines, and points associated with the record on the map. Sometimes, this is sufficient, but in many cases you'll want to configure the default focus - you might want to zoom out to get more context on the screen when the user arrives at the item, or nudge over the focus position to contetualize the record relative to some other specific entity nearby on the map.

      * To set a focus, adjust the map position and zoom to the exact configuration that you want to use as the default for the record, and then click the "Fix Item-Specific Map Focus" button to save the position.

      * **Note:** Neatline also makes it possible _just_ to set a focus position for a record, even if you haven't added any geometry for the record on the map. So, if there's a location on the map that's self-evident and doesn't need any interpretive shapes, lines, or points, you can use the item-specific focus to just "pin" the map to a particular viewport location and zoom level, which will then be retrieved and recreated whenver the user clicks on or scrolls to the record. 

  * Relationships

    * **Parent Record**: Any record can be assigned a parent record, which can be any other exhibit-specific or Omeka item-backed record present in the exhibit. When a parent record is defined, the child record will automatically inherit all of the styling and visibility settings of the parent. This makes it possible to create nested hierarcies of records that can be manipulated as a single batch in the exhibit. 

      This makes it possible to group large collections of records into "batches" than can be manipulated as a group. For example, imagine that you have two subsets of 50 records and each of the two categories needs to be assigned a separate visual style on the map. It's possible to set exhibit-wide styling defaults in the "Map Settings" dropdown menu, but that's not helpful in this case, since you essentially need to model two "defaults," one for each of the categories. Instead of manually setting the styles individually on each of the records, you can just create two category records for each of the subsets, set the styling options on the master records, and then associate each of the child records with the appropriate parent record.

      Likewise, parent-child relationships can be used to create
temporal "contexts" inside a single exhibit. For example, if you're working with a collection of five historical maps of the same geographic region, it's important to be able to restrict map vectors and descriptive annotations to just one of the maps to avoid a confusing soup of overlapping shapes and annotations. Instead of manually setting the same the visiblity dates of each interpretive records, you can just set visiblity dates for each of the five map records and then point each of the descriptive records at one of the maps. This way, the maps will phase on and off of the exhibit in unison with the set of interpretive records that describe them.

### Plot Records on the Map

When you open a record's edit form in the browser tray, four editing controls appear at the top left of the map:

  * Pan (hand icon): The default editing state, this lets you click and drag to pan the focus position of the map.

  * Point (pencil icon): Plot individual points. Click where you want the point. When you're finished, click the hand icon to reactivate the default panning mode.

  * Line (line icon): Plot individual points. To create a straight line that connects a series of points, click where you want the points. When you're finished, double click to lock the final line segment. To draw a free-form, curved line, hold down the SHIFT key, click, and then drag out the line.

  * Polygon (rectangle icon): Create shapes. This works similarly to the line tool - click out a series of points to make flat-edge shapes, or press the SHIFT key and drag out irregular shapes.

When you're done annotating the item, click the blue "Save" button at the bottom of the edit form in the browser tray. 

### Edit Map Shapes

You can edit the map annotation for a record at any point.

  * Open the edit form the record that you want to change. This can be done either by clicking directly on on the title of the record in the browser tray or by clicking on any of the record's representations on the map or timeline.

  * To edit a point, line, or polygon on the map, click on the shape. The vector will be outlined in red and all points associated with it will expand to indicate that it is ready for editing. 

  * Once the shape is selected, you can toggle on and off any of the three editing modes - Drag, Rotate, and Scale.

    * **Drag**: When Drag is active, an extra point will appear at the geometric center of the shape. Click and drag on the point to drag the postion of the entire shape.

    * **Rotate**: When Rotate is active, an extra point will appear below and to the left of the shape. Click and drag on the point to rotate the shape.

    * **Scale**: When Scale is active, an extra point will appear below and to the left of the shape. Click and drag on the point to skew the vertical and horizontal dimensions of the shape.

  * Click the red "Delete" button to delete the record. **This cannot be undone.**

### Edit Map Styles

In addition to the shape drawing and editing tools, Neatline makes it possible to fully customize the color, thickness, and opacity of all geospatial annotations. You can set custom styles both at the level of the entire exhibit and at the level of individual records. Style settings on individual records will always override the exhibit defaults.

To edit exhibit-wide style defaults:
  
  * Click on the "Map Settings" tab in the top bar of the browser. A dropdown menu will appear with editing inputs for the 7 exhibit-wide style defaults:
  
    * **Default Shape Color**: The fill color of the polygons (everything inside of the border lines, not including the lines). Click on the  swatch to the right of the input to open a color picker.

    * **Default Line Color**: The color of the border lines. Click on the  swatch to the right of the input to open a color picker.

    * **Default Selected Color**: The color of the lines, shapes, and points when the record is highlighted or selected. Click on the  swatch to the right of the input to open a color picker.

    * **Default Shape Opacity**: The opacity of the polygons (not including the border lines). Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value. 

    * **Default Selected Opacity**: The opacity of the polygons (not including the border lines) when the record is highlighted or selected. Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value. 

    * **Default Line Opacity**: The opacity of the border lines. Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Default Graphic Opacity**: The opacity of points that are represented on the map with external image graphics set on the record edit forms (see above). Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Default Line Width**: The thickness of the border lines in pixels. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Although there's no theoretical limit on how thick the lines can be, in practice you'll probably want to keep them between about 1-10 pixels.

    * **Default Point Radius**: The radius of standalone points and verties on lines and polygons. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Like with the line thickness parameter, there's no limit to how large points can be, but keep in mind that the radius of points on the map is _fixed_, in that it is not affected by the zoom level - a 5-pixel point will be 5 pixels when the map is zoomed to 100 meters or 1000 miles.

    * **Default Base Layer**: Select the default starting base layer for the exhibit. Users can manually change the base layer with the layer switcher widget at the top right of the map.

As you make changes to the color, radius, and width styles, only the shapes on the map _that do not have an item-specific setting for the style in question_ will automatically update the reflect the new settings. If you want to unset item-specific styling settings for a given item, open its editing form and click the "Reset Item Styles" button.

When you're done editing the default styles, click the "Save" button at the bottom of the dropdown to lock the changes.

### Activate and Deactivate Records

After you've created records, you can toggle the representations of the records on the map, timeline, and record browser on and off at any point. In the record browser tray on the left side of the screen, there are three columns of checkboxes on the left side of the panel, three for each record:

  * The left column controls the record description panel;
  * The middle column controls the map;
  * The right column controls the timeline.

Just check or uncheck any of the blocks at any point, and the status setting will immediately be saved and applied on the exhibit.

### Edit Record Order

In some cases, an exhibit needs to unfold content in a structured, linear sequence - an argument needs to be traced from start to finish, the representation of a series of events needs to be followed in a fixed order.

For these situations, Neatline makes it possible to customize the order in which records display in the description tray. When a user comes to the exhibit, she can use the forward and backward arrows to scroll linearly through the contents of the exhibit.

To create a custom ordering:

  1. Click the "Item Settings" tab at the top right of the editor.

  2. Click the "Edit Item Order" button in the dropdown menu. The button will turn blue to indicate that the description tray is in reorder mode.

  3. Click on record listings in the description tray and drag them up and down to reorder the exhibit.

  4. When you're finished, click the "Save" button on the "Item Settings" dropdown. Click the "Edit Item Order" button again to return the description tray to its normal mode.



[omeka]: http://omeka.org
[omeka-install-documentation]: http://omeka.org/codex/Installation 
[omeka-download]: http://omeka.org/download 
[omeka-github]: https://github.com/omeka/Omeka
[neatline-download]: http://neatline.scholarslab.org/plugins/neatline
[neatline-github]: https://github.com/scholarslab/Neatline
[neatline-maps-github]: https://github.com/scholarslab/NeatlineMaps
[geoserver]: http://geoserver.org
[geoserver-install-documentation]:http://docs.geoserver.org/stable/en/user/installation/index.html
[openstreetmap]: http://www.openstreetmap.org
[filezilla]: http://filezilla-project.org/
[neatline-download]: http://neatline.org/download
[iso8601]: http://en.wikipedia.org/wiki/ISO_8601
[acugis]: http://www.acugis.com/geoserver-hosting.htm
