# Neatline

Neatline is a geo-temporal mapping application that makes it possible to plot any collection of things - objects, events, places, people, concepts, or imaginative topologies - on maps and timelines.

The basic workflow is simple:

  * Create a starting environment for your exhibit using georectified historical maps, static images, or real-geography base layers (Google Maps or OpenStreetMap).

  * Create records for the exhibit. Records can represent anything at all - letters, stanzas, people, events, or a completely heterogeneous mix of things.

  * Each individual record can be plotted on any of three "axes" in the exhibit - the map, the timeline, and a pane that houses long-format descriptive text, images, and other supporting information about the record.

  * As the editor of the exhibit, you can toggle on and off any of the three viewport and configure the arrangements and default sizes of the various blocks.

  * As you create records and draw representations of the material on the map and timeline, you have full control over the ordering of the content in the exhibit. This makes it possible to construct complex narratives that convey information and arguments in a controlled sequence.

Neatline is completely agnostic about the original structure of the data that is being represented and the structure of final interpretive representations of the data in the exhibit. The geographic footprint of an object can be depicted by any arbitrary shape or collection of shapes on the map, and the temporal footprint can be rendered as a point, a span, or a rising and falling gradient that captures uncertainty or inherent ambiguity across a time interval.

Once data is plotted in space and time, the representations of a given object on the three "axes" are tightly coupled. As a user interacts with the map or the timeline, the other viewports in the exhibit automatically update to reflect the current focus of the block that is being directly manipulated. 

This combination of maps, timelines, and long-format interpretive text makes it possible to represent complex ideas, narratives, arguments, archives, and interpretations that would otherwise be difficult box into the limiting confines of simple x-y geographic coordinates and hyper-granular timestamps. Neatline is designed to make is possible to capture the interpretive freeplay and fuzz that form the bedrock of humanistic narrative and argument.

Neatline is an ideal tool for these kinds of use cases:

  * **An geographic and institutional map of 20th century literary theory**: We tend to identify clusters of conversant literary criticism with with universities, cities, and countries - the Yale school, Russian formalism, Marxism and the Frankfurt School, etc. You want to plot the institutional affiliations and career arcs of ~100 prominent 20th century literary critics, grouped by critical school, to explore to what extent the real-world locations and temporal overlaps of various critics do or do not correspond with the conceptual connections that emerge in the criticism itself.

  * **Biographies of the signatories on the Declaration of Independence**: You want to create an interactive exhibit that "attaches" biographic information about the signatories on the Declaration of Independence to a high-resolution image of the actual document. The map annotation tools make it possible to draw precise, translucent outlines around the signatures on the document, and the WYSWYG text editor can interactively display long-format biographies and pictures as the user interacts with the outlines on the image.

  * **A narrative map of the 1924 British Mount Everest expedition**: Did George Mallory and Andrew Irvine make it to the summit on June 8? You want to create a map showing the climing lines that the parties followed on the summit attempts, the conjectured routes that Mallory may have followed after possibly summiting the mountain, and the location of his body when it was recovered in 1999. The phases of the climb can be plotted as time spans, and the minute-by-minute accounts from the Odell diaries can be captured as individual points.

  * **A map of the movements of characters and concepts in _The Tempest_**: _The Tempest_ takes place in a indeterminate space, an island outside of the moving world, an aesthetic throne for Prospero - and yet the literal, spaitla movements of the characters are described in significant detail. You want to use a Renaissance-era map of an island in the Mediterranean (or the West Indies, or the Carribean) to create a speculative mapping of the text - Prospero's lair, the shipwreck, the carousing of Caliban and Trinculo, the journey back to Italy, the shape and reach of Prospero's vision of selfhood.


## Installation and Configuration

Neatline is a plugin for [Omeka][omeka], an open-source web publishing platform that makes it possible to create, curate, and display archival collections based on Dublin Core or EAD metadata. While the web service is designed to make it easy to experiment with Neatline and build exhibits based on real-geography base layers, using Neatline _directly_, inside of the Omeka, makes it possible to base Neatline exhibits on an underlying archive of Omeka items that conforms to rigorous and portable metadata standards.

Installing Omeka + Neatline is a two-step process: Omeka first, then the Neatline plugin. Omeka is a PHP/MySQL application that will run on almost any commercial hosting provider. Before you start, you'll need:

  1. A hosting environment that supports PHP and MySQL;
  2. A way to transfer files onto your server space and make simple text edits. In most cases, a simple FTP client like [FileZilla][filezilla] works well. 
  3. Credentials for a MySQL database user on your server and the name of a fresh, production database for the Omeka installation. If you don't already have a database user account, most commercial hosting providers provide access to a point-and-click database administration tool like phpMyAdmin where you can create databases and users.

#### Install Omeka

For detailed instructions on installing Omeka, refer to [Omeka's official documentation][omeka-install-documentation].

#### Install Neatline

  1. Go to the [Neatline download][neatline-download] page and download the Neatline plugin.
  2. Once the file is finished downloading, uncompress the .zip file and place the "Neatline" directory in the plugins/ folder in your Omeka installation.
  3. Open a web browser and go to _your-omeka-site.org/admin_, enter your administrative credentials, and click on the "Settings" button
     at the top right of the screen.
  4. Click on the "Plugins" tab in the vertical column on the left and find the listing for the Neatline plugin.
  5. Click the "Install" button.

Once the installation is finished, you'll see a new tab along the top of the administrative interface labeled "Neatline."

#### Install Geoserver

For detailed instructions on installing Geoserver, refer to [Geoserver's official
documentation][geoserver-install-documentation].

#### Create a New Exhibit

  1. Click on the "Neatline" tab along the top of the administrative interface.
  2. Click the "Create an Exhibit" button.
  3. Enter a title for the exhibit. The title will be displayed at the top of the full-screen public display view. 
  4. Enter a slug for the exhibit. The slug is used to form the public-facing URL for the exhibit. By default, a slug will be auto-generated from the text that you typed into the "Title" field. If you want to edit the default slug, click on the input and type a new string. Slugs can only contain letters, numbers, and hyphens (no spaces).
  5. Check the "Public" box if you want the exhibit to be publicly-accessible. By default, exhibits are only visible to administrators.
  6. Choose a default real-geography base layer. Neatline supports OpenStreetMap, Google Streets, Google Physical, Google Satellite, Google Hybrid, Stamen Toner, Stamen Terrain, and Stamen Watercolor. This setting can be changed at any point in the Neatline editing interface.
  7. Choose an exhibit foundation (optional):
    * **Option 1**: If you are using Neatline Maps and Geoserver to serve georectified .tiff images, use the "Neatline Map" dropdown menu to select the map that you want to build the exhibit with.
    * **Option 2**: If you are using Neatline WMS to connect items in your Omeka collection to existing, external web map services, use the "Web Map Service" dropdown to select the item that houses the web map service that you want to build the exhibit with.
    * **Option 3**: You can also use any static image associated with an Omeka item as the base layer. Use the "Choose an Image" dropdown to browse all images in your Omeka archive, grouped by parent item.
  8. Click "Create Exhibit."

#### Browse Exhibits

After creating an exhibit, you'll be taken back to the exhibits browse
screen, where you'll see a listing for the new exhibit.

  * The "Exhibit"column lists the title of the exhibit, the slug, and links to edit the exhibit metadata and delete the exhibit. To open the Neatline editing environment for the exhibit, click on the title (see below).
  * The "View" column lists three links to the public-facing instantiations of the exhibit. The "In-Theme" view shows the exhibit in the context of the currently-activated Omeka theme. "Fullscreen" stretches the exhibit to fill the entire screen space and adds a narrow header bar across the top of the screen with the exhibit title. The "Embed" view is the same as the "Fullscreen" mode without the top bar (this view can be used to embed the exhibit in external environments with an iframe).
  * The "Items Query" columns shows a link to a form where you can specify a subset of your Omeka collection to make avaialble in the Neatline editing environment for the exhibit (see below).
  * The "Modified" column lists the date and time when the content of the exhibit was last updated.
  * The "# Items" column lists the number of records that are plotted on at least one of the three available viewports in a Neatline exhibit.
  * The "Public" column shows whether the exhibit is publicly-accessible.

#### Edit Exhibit Metadata

Click the "Edit Details" link in the "Exhibit" column to edit the exhibit title, slug, and public status. Click "Save Exhibit" to commit the changes.

#### Delete an Exhibit 

Click the "Delete" link in the "Exhibit" column to delete the exhibit. Click "Delete" again on the confirmation page. **This cannot be undone.**

#### Define an Items Query

To make items in your Omeka collection available for manipulation inside the Neatline editing interface, you need to define a "query" on the collection that isolates a subset of items that are relevant to the exhibit. This functionality is in place to make it possible to use the Neatline editor with extremely large Omeka collections (many thousands of items) that would choke up the interface if all of the content were loaded in at once.

To define an items query for an exhibit, click on the "Edit Query" link in the exhibit's listing in the browse view. The query form is identical to the advanced search form in the Omeka items browser. You can search by keyword, specific field values, id ranges, collections, types, users, tags, public/non-public, and featured/non-featured - and any combination thereof.

Once you've created a query, click the "Search" button at the bottom of the page to save the configuration.

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

Fundamentally, a Neatline exhibit is just a collection of records that are plotted on the map, on the timeline, or on both.

To create a new record:

  1. Click the "New Item" button at the top of the left pane in the editor. A new listing for the "[Untitled]" record will appear in the record browser tray, and the editing form will be expanded below the new entry.

  2. Fill out the form fields that are necessary to describe the object or concept that the record represents. By default, the "Text Description" and "Start and End Dates" field sets are expanded, but you can manually expand and contract each of the four field sets by clicking on the blue titles. The state of the form - which of the fieldsets are visible - will persist even when you move to the form for a different record, making it easy to make a batch of similar changes on a number of records.

  3. As you make changes to the form, the title will become red, indicating that there are un-saved changes in the form. At any point, click the blue "Save" button at the bottom of the form to save the changes. The viewports in the exhibit will automatically reload and display the newly-updated record. 

  4. When you're done with the record, click on its title to contract the form. Click again on the title to reopen it. 

**Omeka + Neatline**: In addition to the ability to create altogether new records that exist just in the context of the current exhibit, Neatline automatically populates the item browser list with all of the items in your Omeka collection. These work just like the native Neatline records described above, except that they can be reused across exhibits - the same Omeka record can be used, with completely different data, in as many exhibits as you want.

Data entered by way of the Neatline editor does not affect the item's archival metadata in any way. Neatline tracks the associations that tie together an Omeka item, an Neatline exhibit, and the exhibit-specific representation of the item, but doesn't make any changes to the original Dublin Core or EAD metadata.

#### Record Fields

Records have these fields:

  * Text Description

    * **Title**: The title is used to label the record on the timeline and in the prose description tray. The form field includes a simple rich-text editor, which can be used to apply different colors, font-sizes, and emphases to the text.

    * **Description**: The description is a catch-all field that can be used in a number of different ways - it can accomodate anything from short little snippets of annotation to long-format interpretive prose. This field includes a more complex rich-text editor, which makes it possible to use apply advanced formatting options like bullets, numbered lists, indentations, text alignments, links, and images. If you need complete control over the markup and styling, click the "\< \>" button at the bottom right of the control bar to view and edit the raw HTML for the field.

  * Start and End Dates

    * **Start Date**: The start date of the object, event, or concept represented by the record. This is the only field that is required in order for the record to be displayed on the timeline. Dates must be entered in standard ISO8601 format.

    * **Start Time**: The time of day of the start date.

    * **End Date**: Same as start date. If an end date is entered, the record will be represented as a span (as opposed to a single point).

    * **End Time**: Same as start time.

  * Timeline Styles

    * **Date Ambiguity**: Especially in a humanistic context, the concept of time is often slippery and imprecise. Although Neatline does not aspire to do full justice to the nuance of the subject, the Date Ambiguity widget lets you drag out a gradient of uncertainty or fuzziness across a time interval. Drag the two controls handles inward to create an "ascent" and "descent" of intensity or certainty over the span; create a continuous increase or decrease by dragging both handles all the way to one side or the other. This is a simple control that just scratches the surface of temporal modeling, but it does allow you to avoid inadvertently making the incorrect impression that a period of time is fixed or definite when it in fact is not.

  * Map Styles

    * **Shape Color**: The fill color of the polygons (everything inside of the border lines, not including the lines). Click on the  swatch to the right of the input to open a color picker.

    * **Line Color**: The color of the border lines. Click on the  swatch to the right of the input to open a color picker.

    * **Shape Opacity**: The opacity of the polygons (not including the border lines). Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Line Opacity**: The opacity of the border lines. Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Line Thickness**: The thickness of the border lines in pixels. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Although there's no theoretical limit on how thick the lines can be, in practice you'll probably want to keep them between about 1-10 pixels.

    * **Point Radius**: The radius of standalone points and verties on lines and polygons. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Like with the line thickness parameter, there's no limit to how large points can be, but keep in mind that the radius of points on the map is _fixed_, in that it is not affected by the zoom level - a 5-pixel point will be 5 pixels when the map is zoomed to 100 meters or 1000 miles.

    * **Reset Item Styles**: Click this button to void any item-specific styles set for the record with any of the 6 previous controls. This will cause the record to fall back to the exhibit-wide defaults, which are configured by way of the "Map Settings" dropdown in the top bar.

    * **Fix Item-Specific Map Focus**: The map focus for a record is the position and zoom that the map viewport is set to when the record is activated by any action elsewhere in the exhibit. For example, if a user clicks on a listing for the record in the description tray or scrolls to the item using the next and previous arrows, the map will automatically refocus at the latitude/longitude and zoom level defined by the map focus for the item. 

        By default, if a custom focus has not been set, Neatline approximates a map focus for the record based on the dimensions of the shapes, lines, and points associated with the record on the map. Sometimes, this is sufficient, but in many cases you'll want to configure the default focus - you might want to zoom out to get more context on the screen when the user arrives at the item, or nudge over the focus position to contetualize the record relative to some other specific entity nearby on the map.

      * To set a focus, adjust the map position and zoom to the exact configuration that you want to use as the default for the record, and then click the "Fix Item-Specific Map Focus" button to save the position.

      * **Note:** Neatline also makes it possible _just_ to set a focus position for a record, even if you haven't added any geometry for the record on the map. So, if there's a location on the map that's self-evident and doesn't need any interpretive shapes, lines, or points, you can use the item-specific focus to just "pin" the map to a particular viewport location and zoom level, which will then be retrieved and recreated whenver the user clicks on or scrolls to the record. 

### Plot Records on the Map

When you open a record's edit form in the browser tray, four editing controls appear at the top left of the map:

  * Pan (hand icon): The default editing state, this lets you click and drag to pan the focus position of the map.

  * Point (pencil icon): Plot individual points. Click where you want the point. When you're finished, click the hand icon to reactivate the default panning mode.

  * Line (line icon): Plot individual points. To create a straight line that connects a series of points, click where you want the points. When you're finished, double click to lock the final line segment. To draw a free-form, curved line, hold down the SHIFT key, click, and then drag out the line.

  * Polygon (rectangle icon): Create shapes. This works similarly to the line tool - click out a series of points to make flat-edge shapes, or press the SHIFT key and drag out irregular shapes.

When you're done annotating the item, click the blue "Save" button at the bottom of the edit form in the browser tray. 

### Edit Map Shapes

You can edit the map annotation for a record at any point.

  1. Open the edit form the record that you want to change. This can be done either by clicking directly on on the title of the record in the browser tray or by clicking on any of the record's representations on the map or timeline.

  2. To edit a point, line, or polygon on the map, click on the shape. The vector will be outlined in red and all points associated with it will expand to indicate that it is ready for editing. 

  3. Once the shape is selected, you can toggle on and off any of the three editing modes - Drag, Rotate, and Scale.

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

    * **Default Shape Opacity**: The opacity of the polygons (not including the border lines). Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value. 

    * **Default Line Opacity**: The opacity of the border lines. Enter a number between 0 and 100 (0 being transparent, 100 completely opaque) in the input, or click and drag up and down to gradually modulate the value.

    * **Default Line Thickness**: The thickness of the border lines in pixels. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Although there's no theoretical limit on how thick the lines can be, in practice you'll probably want to keep them between about 1-10 pixels.

    * **Default Point Radius**: The radius of standalone points and verties on lines and polygons. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value. Like with the line thickness parameter, there's no limit to how large points can be, but keep in mind that the radius of points on the map is _fixed_, in that it is not affected by the zoom level - a 5-pixel point will be 5 pixels when the map is zoomed to 100 meters or 1000 miles.

    * **Default Base Layer**: Select the default starting base layer for the exhibit. Users can manually change the base layer with the layer switcher widget at the top right of the map.

As you make changes to the color, radius, and width styles, only the shapes on the map _that do not have an item-specific setting for the style in question_ will automatically update the reflect the new settings. If you want to unset item-specific styling settings for a given item, open its editing form and click the "Reset Item Styles" button.

When you're done editing the default styles, click the "Save" button at the bottom of the dropdown to lock the changes.

### Activate and Deactivate Records

After you've created records, you can toggle the representations of the records on the map and timeline on and off at any point. In the record browser tray on the left side of the screen, there are two columns of checkboxes on the left side of the panel, two checkboxes for each record. The left column, headed by the pin-marker icon, indicates whether a given record is active on the map; the right column, headed by the clock icon, shows whether the record is active on the timeline.

Just check or uncheck any of the blocks at any point, and the status setting will immediately be saved and applied on the exhibit.

**Note:** You can click on the map-pin and clock header icons to filter the records list to just display the records that are activated for the map, the timeline, or both. Click on the headers again to unset the filter and return the list to the full display.

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
[neatline-github]: https://github.com/scholarslab/Neatline
[neatline-maps-github]: https://github.com/scholarslab/NeatlineMaps
[geoserver]: http://geoserver.org
[geoserver-install-documentation]:http://docs.geoserver.org/stable/en/user/installation/index.html
[openstreetmap]: http://www.openstreetmap.org
[filezilla]: http://filezilla-project.org/
[neatline-download]: http://neatline.org/download

