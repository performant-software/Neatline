# Neatline

Neatline is a geo-temporal mapping application that makes it possible to plot any _collection of things_ - objects, events, places, people, concepts, or imaginative topologies - on maps and timelines.

The basic workflow is simple:

  * Create a starting environment for your exhibit using georectified historical maps, static images, or real-geography base layers (Google Maps or OpenStreetMap layers).

  * Create records for the exhibit. Records can represent anything at all - letters, stanzas, people, events, or a completely heterogeneous mix of things.

  * Each individual record can be plotted on any of three "axes" in the exhibit - the map, the timeline, and a pane that houses long-format descriptive text, images, and other supporting information about the record. As the editor of the exhibit, you can toggle on and off any of the three viewport and configure the arrangements and default sizes of the various blocks.

  * As you create records and draw representations of the material on the map and timeline, you have full control over the ordering of the content in the exhibit. This makes it possible to construct complex narratives that convey information and arguments in a controlled sequence.

By design, the software is completely agnostic about the original structure of the data that is being represented and the structure of final interpretive representations of the data in the exhibit. The geographic footprint of an object can be depicted by any arbitrary shape or collection of shapes on the map, and the temporal footprint can be rendered as a point, a span, or a rising and falling gradient that captures uncertainty or inherent ambiguity across a time interval.

Once data is plotted in space and time, the representations of a given object on the two major "axes" is tightly coupled. As a user interacts with the map or the timeline, the other viewports in the exhibit automatically update to reflect the current focus of the block that is being directly manipulated. 

This combination of maps, timelines, and long-format interpretive text makes it possible to gracefully represent large, complex, and heterogeneous collections of concepts that would otherwise be difficult box into the limiting confines of simple x-y geographic coordinates and second-specific timestamps. Neatline is designed to make is possible to capture the interpretive freeplay and fuzz that form the bedrock of humanistic narrative and argument.

Neatline is the best tool for these kinds of use cases:

  * **An geographic and institutional map of 20th centry literary theory**: We tend to identify clusters of conversant literary cricisim with with universities, cities, and countries - the Yale school, Russian formalism, Marxism and the Frankfurt School, etc. You want to plot the institutional affiliations and career arcs of ~100 prominent 20th century literary critics, grouped according to critical school, to see to what extent the real-world locations and temporal overlaps various critics do or do not correspond with the conceptual connections that emerge in the criticism itself.

  * **Biographies of the signatories on the Declaration of Independence**: You want to create an interactive exhibits that "attaches" biographic information about the signatories on the Declaration of Independence to a high-resolution image of the actual document. The map annotation tools make it possible to draw precise, translucent outlines around the signatures on the document, and the WYSWYG text editor can interactively display long-format biographies and pictures as the user interacts with the outlines on the image.

  * **A narrative map of the 1924 British Mount Everest expedition**: Did George Mallory and Andrew Irvine make it to the summit on June 8? You want to create a map showing the climing lines that the parties followed on the summit attempts, the conjectured routes that Mallory may have followed after possibly summiting the mountain, and the location of his body when it was recovered in 1999. The phases of the climb can be plotted as time spans, and the minute-by-minute accounts from the Odell diaries can be captured as individual points.

  * **A map of the movements of characters and concepts in _The Tempest_**: _The Tempest_ takes place in a indeterminate space, an island outside of the moving world, an aesthetic throne for Prospero; and yet the movements of the characters are described in significant detail. You want to use a Renaissance-era map of an island in the Mediterranean (or the West Indies, or the Carribean) to create a speculative mapping of the text - Prospero's lair, the shipwreck, the carousing of Caliban and Trinculo, the journey back to Italy, the specific sizes and shapes of Prospero's intellectual ambition.

## Before You Start

Neatline can be used in two ways: As a free, public-facing webservice by way of [webservice.neatline.org][neatline-webservice], or as a plugin for [Omeka][omeka], an open-source web publishing platform similar to Wordpress or Drupal that makes it possible to build and display archival collections with Dublin Core or EAD metadata. Each option - using the webservice or installing Omeka + Neatline in your own hosting environment - has its own pros and cons, and the decision should be guided by the specific requirements of your project.

The version of the Neatline application delivered by the webservice is identical to the self-hosted version, with the one limitation: Webservice users are limited to "real-geography" base layers (Google Maps and OpenStreetMap layers). If you want to use static or georectified images as base layers, you'll need to run your own instance of Omeka and Neatline, as well as the auxilary software that makes it possible to upload and host the images - the [Neatline Maps][neatline-maps-github] plugin and [Geoserver][geoserver], a powerful Java-based geospatial server that houses and delivers the custom map assets.

Some general considerations:

  * **Webservice**: 
    * _Pros_: Free, easy, and fast to get up and running. As simple as signing up for an email account. No hosting costs, software installation, or server administration overhead. No technical knowledge is necessary. Great for straightforward, GIS-style use cases that require only "real-geography" base layers (satellite imagery, street maps). Neatline excels as a drop-in replacement for the custom map-making application in Google maps.
    * _Cons_: Can't upload static images or georectified .tiff files to use as base layers. Can't leverage the underlying archive-building capabilities of Omeka.

  * **Self-Hosted**: 
    * _Pros_: Used in conjunction with the Neatline Maps plugin and Geoserver, it's possible to use static images and georectified historical maps as base layers. Full access to the Omeka installation that sits behind Neatline, which makes it possible to create Neatline exhbits that directly extend and build on existing archives of Dublin Core or EAD metadata. Best for complex scholaraly projects where the portability and structural integrity of data is of a premium.
    * _Cons_: Requires basic knowledge of web hosting environments, MySQL administration, and web-based software installation. Geoserver, the optional geospatial software that makes it possible to serve .tiff files as base layers, is a complex piece of software that can be comparatively difficult deploy.

## Installation and Configuration

### Neatline Web Service

To get started using the webservice, go to [webservice.neatline.org/register][neatline-webservice-register]. Enter a username, email,
and password, and click "Sign Up." You'll get redirected to the main "Browse Exhibits" page, where you'll eventually see a listing of all
your exhibits.

#### Create a New Exhibit

  1. Click the "New Exhibit" button.
  2. Enter a title for the exhibit. The title will be displayed in large text at the top of the public display page for the exhibit.
  3. As you type, the form will automatically generate a "URL Slug" in the box below. The slug is a string of hyphenated text that the webservice will use to form the public URL for the exhibit. Below the URL Slug input, the form automatically populates a preview of the final URL for the exhibit. If you want to use a custom URL slug that's different from the title text, just manually edit the form field for the slug at any point and it will stop mirroring the title text.
  4. Finally, check the "Public" checkbox if you want the exhibit to be publicly accessible. As long as this box is left unchecked, visitors to the public URL for the exhibit will see a "Coming Soon" placeholder. You can come back to this page at any point and toggle this option on and off.  
  5. Click the "Create" button. You'll get redirected to the Browse Exhibits page, where you'll see a listing for the new exhibit.

#### Edit Exhibit Information

After creating an exhibit, you may want to go back and change some of the options that you set at the beginning. 

  1. Find the listing for the exhibit that you want to edit and click the "edit details" link below the exhibit title.
  2. You'll get an edit form that's identical to the one that you used to create the exhibit. Edit the Title, URL Slug, or Public options, and click "Save" to commit the changes.

#### View the Public Display Page for an Exhibit

Neatline generates a full-screen page for each of your exhibits that serves as the primary publicly-accessible display for the project.

  1. In the browse exhibits view, click the "public" link under the exhibit title to go to the full-screen view.

If you do not want the exhibit to be publicly-visible, uncheck the "Public" checkbox in the "edit details" form.

#### Embed An Exhibit 

In addition to providing the full-screen view for an exhibit, Neatline also makes it possible to embed exhibits in any context where HTML markup is allowed. For example, you might want to include a small version of an exhibit in a Wordpress blog post. Neatline includes a dynamic application that lets you configure the dimensions of the embedded exhibit and auto-generates the HTML markup.

  1. Find the listing for the exhibit that you want to embed on the Browse Exhibits page and click the "embed" link below the title.
  2. Use the Width and Height inputs to set the dimensions for the embedded exhibit. To increase or decrease the values in the inputs, click on the field and drag the cursor up and down on the page. The value in the input will go up and down, and the preview of the exhibit at the bottom of the page will automaticaly update. If you already know the dimensions that you want for the exhibit, you can also just type directly into the fields.
  3. Once you've set the dimensions, just copy the contents of the "Embed Code" field and paste the HTML into the destination context - a different website, a blog post, a forum, etc.

#### Delete An Exhibit 

  1. Find the listing for the exhibit that you want to embed on the Browse Exhibits page and click the "delete" link below the title.
  2. You'll be taken to a confirmation page. **Deleting an exhibit permanently removes the exhibit and all record data associated with it. A deleted exhibit cannot be restored.**
  3. Click "Yes, delete." You'll be taken back to the Browse Exhibits page.

### Self-hosted Omeka + Neatline

Neatline is a plugin for [Omeka][omeka], an open-source web publishing platform that makes it possible to create, curate, and display archival collections based on Dublin Core or EAD metadata. While the web service is designed to make it easy to experiment with Neatline and build exhibits based on real-geography base layers, using Neatline _directly_, inside of the Omeka, makes it possible to base Neatline exhibits on an underlying archive of Omeka items that conforms to rigorous and portable metadata standards.

Installing Omeka + Neatline is a two-step process: Omeka first, then the Neatline plugin. Omeka is a PHP/MySQL application that will run on almost any commertical hosting provider. Before you start, you'll need:

  1. A hosting environment that supports PHP and MySQL;
  2. A way to transfer files onto your server space and make simple text edits. In most cases, a simple FTP client like [FileZilla][filezilla] works well. 
  3. Credentials for a MySQL database user on your server and the name of a fresh, production database for the Omeka installation. If you don't already have a database user account, most commercial hosting providers provide access to a point-and-click database administration tool like phpMyAdmin where you can create databases and users.

#### Install Omeka

For detailed instructions and troubleshooting, refer to the [official documentation][omeka-install-documentation]. In brief:

  1. Go to the [Omeka download][omeka-download] page and click "Download Omeka 1.4.2."
  2. Once the file is finished downloading, uncompress the .zip file and place the Omeka directory (using an FTP client, if you're working on a remote location) in publicly-accessible directory on your webhost. This is often called something like "public_html" or "www."
  3. Enter the Omeka directory and edit the db.ini file. Change host to "localhost"; enter the username and password with the credentials of your database user; and change the dbname to the name of the database. When you're done, save the file (and if
you're working remotely, make sure the changes get committed to the server).
  4. Open a web browser and go to public location of the Omeka installation folder. If the folder is named "Omeka" and your webhost serves you public content at username.webhost.com, go to username.webhost.com/Omeka.
  5. If everything is set up properly and the credentials in the db.ini file are valid, you will see a screen titled "Omeka Installation" with a long form. A number of things can go wrong at this point - if your database credentials are invalid, or the database user doesn't have the required access privileges, you might see an error screen saying "Omeka has encountered an internal error." If so, head over to the [official documentation][omeka-install-documentation] for troubleshooting.
  6. Fill out the "Username," "Password," "Re-type the Password," "Email," "Administrator Email," and "Site Title" information.
  7. Click "Install."
  8. Once the installer finishes, click on the "admin panel" link in the success message.
  9. Enter the administrative credentials that you entered in the installation form and click "Log In."

#### Install Neatline

  1. Go to the [Neatline download][neatline-download] page and download the Neatline plugin.
  2. Once the file is finished downloading, uncompress the .zip file and place the "Neatline" directory in the plugins/ folder in your Omeka installation .
  3. Open a web browser and go to your-omeka-site.org/admin, enter your administrative credentials, and click on the "Settings" button
     at the top right of the screen.
  4. Click on the "Plugins" tab in the vertical column on the left and find the listing for the Neatline plugin.
  5. Click the "Install" button.

Once the installation is finished, you'll see a new tab along the top of the administrative interface labeled "Neatline."

#### Create a New Exhibit

#### Edit Exhibit Information

#### View the Full-Screen Display Page for an Exhibit

#### View the In-Theme Display Page for an Exhibit

#### Embed an Exhibit

#### Delete an Exhibit

## Building Neatline Exhibits

At the heart of Neatline is the editing application, a web interface that lets you create exhibits, add records, annotate maps and timelines, and construct complex sequences and progressions that make arguments and tell stories about geospatial entities. 

**Note:** Although the exhibit-building feature set delivered by the Neatline webservice is almost identical to the functionality of the self-hosted version of the software, there are a handful of extra features in the self-hosted version that make it possible to integrate existing archival collections in Omeka with Neatline exhibits. Where there is divergence, the different workflows are prefaced with **Omeka + Neatline:** and **Webservice:** labels.

### Create a Layout

Neatline includes a flexible layout builder that lets you choose exactly which elements you want present in your exhibit, how you want to arrange them, and how large they should be relative to one another.

To open the layout configuration menu, click on the "Layout Editor" link at the top right of the editing interface.

#### Toggle Viewports On and Off

By default, all three viewports - Map, Timeline, and Items - are activated for new exhibits. To toggle viewports, click on the the buttons along the top of the "Layout Editor" dropdown. The preview layout will react and mock the new viewport configuration. Once a viewport has been disabled, click on its toggle button again to re-enable it.

Click the "Save Arrangement" button to save the changes to the server.

#### Drag Viewports to Create New Arrangements

Click and drag on the viewports in the preview layout to reconfigure the arrangement of the blocks. You can switch the vertical positions of the Map and Timeline and change the height and horizontal alignment of the Items block.

Click the "Save Arrangement" button to save the changes to the server.

#### Set Default Viewport Heights and Widths

As you move your mouse over borders between the blocks in the preview layout, a dotted line will appear along the border and the pointer will change to a resize cursor. Click and drag to adjust the height and width of any of the blocks in the layout.

Click the "Save Arrangement" button to save the changes to the server.

### Create Records

Fundamentally, a Neatline exhibit is just a collection of records that are plotted on the map, on the timeline, or both.

To create a new record:

  1. Click the "New Item" button at the top of the left pane in the editor. A new listing for the "[Untitled]" record will appear in the record browser tray, and the editing form will be expanded below the new entry.

  2. Fill out the form fields that are necessary to describe the object or concept that the record represents. By default, the "Text Description" and "Start and End Dates" field sets are expanded, but you can manually expand and contract each of the four field sets by clicking on the blue titles. The state of the form - which of the fieldsets are visible - will persist even when you move to the form for a different record, making it easy to make a batch of similar changes on a number of records.

  3. As you make changes to the form, the title will become red, indicating that there are un-saved changes in the form. At any point, click the blue "Save" button at the bottom of the form to save the changes. The viewports in the exhibit will automatically reload and display the newly-updated record. 

  4. When you're done with the record, click on its title to contract the form. Click again on the title to reopen it. 

**Omeka + Neatline**: In addition to the ability to create altogether new records that exist just in the context of the current exhibit, Neatline automatically populates the item browser list with all of the items in your Omeka collection. These work just like the native Neatline records described above, except that they can be reused across exhibits - the same Omeka record can be used, with completely different data, in as mnay exhibits as you want.

Data entered by way of the Neatline editor does not affect the item's archival metadata in any way. Neatline tracks the associations that tie together an Omeka item, an Neatline exhibit, and the exhibit-specific representation of the item, but doesn't make any changes to the original Dublin Core or EAD metadata.

#### Record Fields

Records have these fields:

  * Text Description

    * **Title**: The title is used to label the record on the timeline and in the prose description tray. The form field includes a simple rich-text editor, which can be used to apply different colors, font-sizes, and emphases to the text. Used in conjunction with ordering functionality, this makes it possible to create implicit hierarchies and parent-child relationships among records. For example, if you are building an exhibit that shows the positions of fifty-odd records in five different cities, you could create a "category" record for each of the cities, set the text to bold and increase the font size, and then focus each of the category records at a zoomed-back view of the corresponding city on the map. Then, each of the individual records can be placed granularly on the map and dragged "under" the parent category record in the description tray.

    * **Description**: The description is a catch-all field that can be used in a number of different ways - it can accomodate anything from short little snippets of annotation to long-format interpretive prose. This field includes a more complex rich-text editor, which makes it possible to use more advanced formatting options - bullets, numbered lists, indentations, text alignments, links, and images. If you need complete control over the markup and styling, click the "\< \>" button at the bottom right of the control bar to view and edit the raw HTML for the field.

  * Start and End Dates

    * **Start Date**: The start date of the record. This is the only field that is required in order for the record to be displayed on the timeline. Neatline understands dates in any of these formats:
      * 2012
      * June, 2012
      * June 5, 2012

    * **Start Time**: The time of day that the event started. Neatline understands times in any of these formats:
      * 10:15
      * 10:15 am
      * 10:15 AM
      * 10:15 pm
      * 10:15 PM
      * 15:15

    * **End Date**: Same as start date. If a date is entered here, the record will be represented as a span, as opposed to a single point.

    * **End Time**: Same as start time.

  * Timeline Styles

    * **Date Ambiguity**: Especially in a humanistic context, the concept of time is often slippery and imprecise. Although Neatline does not aspire to do full justice to the nuance of the subject, the Date Ambiguity widget lets you drag out a gradient of uncertainty or fuzziness across a time interval. Drag the two controls handles inward to create an "ascent" and "descent" of intensity or certainty over the span; create a continuous increase or decrease by dragging both handles all the way to one side or the other. This is a crude control that just scratches the surface of temporal modeling, but it at least allows you to avoid inadvertently making the incorrect impression that a period of time is fixed or definite.

  * Map Styles

    * **Shape Color**: The fill color of the polygons (everything inside of the border lines, not including the lines). Click on the  swatch to the right of the input to open a color picker.

    * **Line Color**: The color of the border lines. Click on the  swatch to the right of the input to open a color picker.

    * **Shape Opacity**: The opacity of the polygons (not including the border lines). Enter a number between 0 and 100 in the input, or click and drag up and down to gradually modulate the value.

    * **Line Opacity**: The opacity of the border lines. Enter a number between 0 and 100 in the input, or click and drag up and down to gradually modulate the value.

    * **Line Thickness**: The thickness of the border lines in pixels. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value.

    * **Point Radius**: The radius of standalone points and verties on lines and polygons. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value.

    * **Fix Item-Specific Map Focus**: The Map Focus for a record is the position and zoom that the map viewport is set to when the record is "activated" by any action elsewhere in the exhibit. For example, if a user clicks on a listing for the record in the description tray or scrolls to the item using the next and previous arrows, the map will automatically refocus at this latitude/longitude and zoom level. By default, if a custom focus has not been set, Neatline approximates a map focus for the record based on the dimensions of the shapes, lines, and points associated with the record on the map. Sometimes, this is sufficient, but in many cases you'll want to configure the default focus - you might want to zoom out to get more context on the screen when the user arrives at the item, or nudge over the focus position to contetualize the record relative to some other specific entity nearby on the map.

      To set a focus, adjust the map position and zoom to the exact configuration that you want to use as the default for the record, and then click the "Fix Item-Specific Map Focus" button to save the position.

      **Note:** Neatline also makes it possible to _just_ set a focus position for a record, even if you haven't added any geometry for the record on the map. So, if there's a location on the map that's self-evident and doesn't need any interpretive shapes, lines, or points, you can use the item-specific focus to just "pin" the map to a particular viewport location and zoom, which will then be retrieved and recreated whenver the user clicks on or scrolls to the record. 

### Plot Records on the Map

When you open a record's edit form in the browser tray, four editing controls appear at the top left of the map:

  * Pan (hand icon): The default editing state, this lets you click and drag to pan the focus position of the map.

  * Point (pencil icon): Plot individual points. Click where you want the point. When you're finished, click the hand icon to reactivate the default panning mode.

  * Line (line icon): Plot individual points. To create a straight line that connects a series of points, click where you want the points. When you're finished, double click to lock the final line segment. To draw a free-form, curved line, hold down the SHIFT key, click, and then drag out the line.

  * Polygon (rectangle icon): Create shapes. This works similarly to the line tool - click out a series of points to make flat-edge shapes, or press the SHIFT key and drag out irregular shapes.

When you're done annotating the item, click the blue "Save" button at the bottom of the edit form in the browser tray. 

### Edit Map Shapes

You can edit the map annotation for a record at any point. First, open the edit form the record that you want to change. This can be done either by clicking directly on on the title of the record in the browser tray or by clicking on any of the record's representations on the map or timeline).

  * To edit a point, line, or polygon on the map, click on the shape. The vector will be outlined in red and all points associated with it will expand to indicate that it is ready for editing. 

  * Once the shape is selected, you can toggle on and off any of the three editing modes - Drag, Rotate, and Scale.

    * _Drag_: When Drag is active, an extra point will appear at the geometric center of the shape. Click and drag on the point to drag the postion of the entire shape.

    * _Rotate_: When Rotate is active, an extra point will appear below and to the left of the shape. Click and drag on the point to rotate the shape.

    * _Scale_: When Scale is active, an extra point will appear below and to the left of the shape. Click and drag on the point to skew the vertical and horizontal dimensions of the shape.

  * Click the red "Delete" button to delete the record. This cannot be undone.

### Edit Map Styles

In addition to the shape drawing and editing tools, Neatline makes it possible to fully customize the color, thickness, and opacity of all geospatial annotations. You can set custom styles both at the level of the entire exhibit and at the level of individual records. Style settings on individual records will always override the exhibit defaults.

To edit exhibit-wide style defaults:
  
  * Click on the "Map Settings" tab in the top bar of the browser. A dropdown menu will appear with editing inputs for the 7 exhibit-wide style defaults:
  
    * _Default Shape Color_: The fill color of the polygons (everything inside of the border lines, not including the lines). Click on the  swatch to the right of the input to open a color picker.

    * _Default Line Color_: The color of the border lines. Click on the  swatch to the right of the input to open a color picker.

    * _Default Shape Opacity_: The opacity of the polygons (not including the border lines). Enter a number between 0 and 100 in the input, or click and drag up and down to gradually modulate the value.

    * _Default Line Opacity_: The opacity of the border lines. Enter a number between 0 and 100 in the input, or click and drag up and down to gradually modulate the value.

    * _Default Line Thickness_: The thickness of the border lines in pixels. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value.

    * _Default Point Radius_: The radius of standalone points and verties on lines and polygons. Enter a positive integer in the input, or click and drag up and down to gradually modulate the value.

    * _Default Base Layer_: Select the default starting base layer for the exhibit. Users can manually change the base layer with the layer switcher widget at the top right of the map.

As you make changes to the color, radius, and width styles, the shapes on the map _that do not have an item-specific setting for the style in question_ will automatically update the reflect the new settings.

When you're done editing the default styles, click the "Save" button at the bottom of the dropdown to lock the changes.

To edit item-specific styles:

  1. Open the edit form for the record that you want to style.

  2. If it's not already visible, click on the "Map Styles" fieldset heading to display the style options.

  3. Edit the inputs for Shape Color, Line Color, Line Opacity, Line Thickness, and Point Radius as described above. As you make
     changes, the record's shapes will update to reflect the new settings.

When you're done editing the styles, click the blue "Save" button at the bottom of the edit form.

### Plot Records on the Timeline







[omeka]: http://omeka.org
[omeka-install-documentation]: http://omeka.org/codex/Installation 
[omeka-download]: http://omeka.org/download 
[omeka-github]: https://github.com/omeka/Omeka
[neatline-github]: https://github.com/scholarslab/Neatline
[neatline-maps-github]: https://github.com/scholarslab/NeatlineMaps
[geoserver]: http://geoserver.org
[openstreetmap]: http://www.openstreetmap.org
[neatline-webservice]: http://webservice.neatline.org
[neatline-webservice-register]: http://webservice.neatline.org/register
[filezilla]: http://filezilla-project.org/
[neatline-download]: http://neatline.org/download
