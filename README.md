# Neatline

Neatline is a geo-temporal mapping application that makes it possible to plot any _collection of things_ - objects, events, places, people, concepts, or imaginative topologies - on maps, images, and timelines, accompanied by a built-in interface for presenting long-format interpretive text that is tightly coupled with the representations of the objects in space and time.

By design, the software is completely agnostic about the original structure of the data that is being represented, and about the structure of final interpretive representations of the data in the exhibit. The geographic footprint of an object can be depicted by any arbitrary shape or collection of shapes on the map, and the temporal footprint can be rendered as a point in time, a span of time, or a rising and falling gradient that captures uncertainty or inherent ambiguity across a time interval.

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
    * _Pros_
      - Free, easy, and fast to get up and running. As simple as signing up for an email account. No hosting costs, software installation, or server administration overhead. No technical knowledge is necessary.
      - Great for straightforward, GIS-style use cases that require only "real-geography" base layers (satellite imagery, street maps). Neatline excels as a drop-in replacement for the custom map-making application in Google maps.
    * _Cons_
      - Can't upload static images or georectified .tiff files to use as base layers.
      - Can't leverage the underlying archive-building capabilities of Omeka.

  * **Self-Hosted**: 
    * _Pros_
      - Used in conjunction with the Neatline Maps plugin and Geoserver, it's possible to use static images and georectified historical maps as base layers.
      - Full access to the Omeka installation that sits behind Neatline. This makes it possible to create Neatline exhbits that directly extend and build on existing archives of Dublin Core or EAD metadata.
      - Best for complex scholaraly projects where the portability and structural integrity of data is of a premium.
    * _Cons_
      - Requires basic knowledge of web hosting environments, MySQL administration, and web-based software installation.
      - Geoserver, the optional geospatial software that makes it possible to serve .tiff files as base layers, is a complex piece of software that can be comparatively difficult deploy.

While the webservice is a fully capable solution for many (if not most) use cases, it's also designed to serve as a sandbox environment for advanced users who want to demo a fully-functional installation of the software before investing further time and resources. 

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

Neatline is a plugin for Omeka, an open-source web publishing platform that makes it possible to create, curate, and display archival collections based on Dublin Core or EAD metadata. While the web service is designed to make it easy to experiment with Neatline and build exhibits based on real-geography base layers, using Neatline _directly_, inside of the Omeka, makes it possible to base Neatline exhibits on an underlying archive of Omeka items that conforms to rigorous and portable metadata standards.

Installing Omeka + Neatline is a two-step process: Omeka first, then the Neatline plugin. Omeka is a PHP/MySQL application that will run on almost any commertical hosting provider. Before you start, you'll need:

  1. A hosting environment that supports PHP and MySQL;
  2. A way to transfer assets onto your server space and make simple text edits to files. In most cases, it's easiest to use a FTP client like [FileZilla][filezilla]. 





[omeka]: http://omeka.org
[omeka-install-documentation]: http://omeka.org/codex/Installation 
[omeka-github]: https://github.com/omeka/Omeka
[neatline-github]: https://github.com/scholarslab/Neatline
[neatline-maps-github]: https://github.com/scholarslab/NeatlineMaps
[geoserver]: http://geoserver.org
[openstreetmap]: http://www.openstreetmap.org
[neatline-webservice]: http://webservice.neatline.org
[neatline-webservice-register]: http://webservice.neatline.org/register
[filezilla]: http://filezilla-project.org/
