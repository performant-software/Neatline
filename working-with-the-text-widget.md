# [NeatlineText][plugin]

**NeatlineText** is an extension to the Neatline plugin that makes it possible to connect paragraphs, sentences, and words in text documents with annotations in Neatline exhibits.

For example, imagine you're making an interactive edition of Walt Whitman's "[Salut au Monde][salut-au-monde]," and want to wire up the locations in this passage with annotations on the map:

```
I see the tracks of the rail-roads of the earth;
I see them welding State to State, city to city, through North America;
I see them in Great Britain, I see them in Europe;
I see them in Asia and in Africa.
```

## Installation

  1. Download the latest version of the plugin from the Omeka add-ons repository.

  1. Uncompress the `.zip` archive.

  1. Move the `NeatlineText` folder into the `/plugins` folder in your Omeka installation.

  1. In the Omeka administrative interface, click on **Plugins** in the top navigation bar and find the listing for "Neatline Widget ~ Text". Click on "Install."

  **Note**: Since NeatlineText is a "sub-plugin" that extends the core functionality of Neatline (itself a plugin), Neatline needs to be installed in order to install NeatlineText.


## Usage

### Step 1: Create the Neatline records

First, create records in the Neatline exhibit for each of the geographic entities that you want to represent on the map - North America, Great Britain, etc. - and fill in the "Slug" field in the "Text" tab with a semantic, easy-to-remember string:

![Slug](http://neatline.org/wp-content/uploads/2014/06/neatlinetext.slug_.jpg)

Think of the slug as a plain-text, human-readable identifier that can be used to reference the record in other contexts, for instance, in HTML markup.

### Step 2: Create the Narrative

You have two options in creating the text to which you're attaching Neatline records. You can easily edit shorter texts within the built in editor of the "Exhibit Settings" page. While you can edit longer texts within that same editor, you may find it more comfortable to work within a familiar text editor, such as Notepad++, TextMate, or Sublime Text.

#### Editing a Shorter Text within the Built-in Editor

1. In the "Exhibit Settings," click the Full Screen button (![Full Screen Button Image](http://neatline.org/wp-content/uploads/2014/06/fullscreen-button.png)) to open a larger text editing window or enter the text into the "Narrative" field text window. You could type the text directly in the window or copy from a file.
2. Click "Source" in order to view and edit the HTML markup.
3. In the "Source" view, enclose sections of the text to which you wish to link  map annotations with HTML elements containing a `data-neatline-slug` attribute, setting the value of the `data-neatline-slug` attribute equal to the slug of the record with which the text is associated.<br /><br />For example, to link the words 'North America' to the record to which I assigned the slug 'north-america,' type `<span data-neatline-slug="north-america">` before the words you want to link and `</span>` after those words:

    ```
    I see them welding State to State, city to city, through <span data-neatline-slug="north-america">North America</span>;
    ```

4. After you've linked the all sections of the text you wish to, click the Full Screen Button again to close the full screen editor, if it is open
5. Click the green Save Exhibit button at the bottom of the page.

![Narrative](http://neatline.org/wp-content/uploads/2014/06/neatlinetext.html.inline.png)

*Note:* We typically use`<span>` elements because they do not create any visual changes in the document in themselves. However, you could use others elements, such as `<div>`. Neatline looks for the attribute `data-neatline-slug` rather than the element. If you are in doubt of which element to use, use `<span>`.

#### Editing Longer Texts with a Text Editor

Alternatively, especially for longer texts, it may be easier to add the elements with the `data-neatline-slug` attribute within a text editor such as Sublime Text or Notepad++.


1. Open your text editor of choice.
2. Copy in or compose the text document.
3. Editing the HTML, wrap sections of the text with elements with `data-neatline-slug` attributes as in the example above, setting the value equal to the slug of the record with which the text is associated.<br /><br /> For example, to link the words 'North America' to the record to which I assigned the slug 'north-america,' I would type `<span data-neatline-slug="north-america">` before the words I want to link and `</span>` after those words:

    ![html in editor](http://neatline.org/wp-content/uploads/2014/06/neatlinetext.html.png)

3. Open up the "Exhibit Settings," scroll down to the "Narrative" text box, and click the "Source" button in the editor. You must click "Source" so that the editor will understand the HTML markup you've written.
4. Copy and paste the HTML from your text editor into the "Narrative" text box. 
5. Click the green Save Exhibit button at the bottom of the page.

Now, when you open up the exhibit, NeatlineText will automatically create bi-directional connections between the spans in the text document and the corresponding records in Neatline. Out of the box, the plugin implements two basic interactions:

  - **Highlighting**: When the user hovers the cursor over a span in the text, any corresponding objects in the Neatline exhibit (shapes on the map, waypoints, etc.) will be highlighted. And vice versa - when the cursor hovers on an object in the exhibit, the span(s) in the text will highlight.

  - **Selecting**: When the user clicks on a highlighted span in the text, the Neatline exhibit will "focus" around the corresponding record in the exhibit - the map will pan and zoom to frame the annotation, the timeline will scroll to show the span, etc. And likewise, when the user selects a record in the Neatline exhibit, the text will automatically scroll to display the corresponding span.

## Theming

Unlike other Neatline extensions like Waypoints and SIMILE, NeatlineText needs to be used in conjunction with a theme that positions the text next to the exhibit inside of a scrollable container element. By default, most themes just display the exhibit narrative above or below the exhibit, which means that the user would need to manually scroll up and down on the page to compare the exhibit with the text, which defeats the purpose.

There are two ways to go about this:

  - **Omeka themes**: To make it easy to get up and running, we've built a really simple starter theme called [Neatlight][neatlight], which is specifically designed to house NeatlineText exhibits. Think of Neatlight as the Neatline equivalent of the default "Thanks Roy" theme that ships with Omeka - it's a simple, no-frills foundation that can be easily adapted and expanded.

  - **Neatline themes**: The other approach is to use Neatline's exhibit-specific themeing system, which makes it possible to create completely separate themes for each individual Neatline exhibit. For more information about this, check out the [documentation][theme_docs], and take a look at [David McClure's fork of the Neatlight theme][neatlight-mcclure], which contains the source code for the custom themes used in projects at [neatline.dclure.org][neatline-dclure].

[plugin]: http://omeka.org/add-ons/plugins/neatlinetext
[salut-au-monde]: http://www.bartelby.com/142/74.html
[neatlight]: https://github.com/scholarslab/neatlight
[neatlight-mcclure]: https://github.com/davidmcclure/neatlight/tree/master/neatline/exhibits/themes
[neatline-dclure]: http://neatline.dclure.org
[theme_docs]: http://www.scholarslab.org/geospatial-and-temporal/theming-neatline-exhibits
