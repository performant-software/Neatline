# Creating Exhibits

## At a glance

  - Click "Create an Exhibit" to add a new exhibit.
  - Use the form to define basic, high-level information about a project.
  - You can always go back and edit any of the default settings.

To get started with a new project, click on the "Create an Exhibit" button at the top of the main "Browse Exhibits" page:

## Title

A top-level identifier for the exhibit, used to label the project in listings of exhibits on the public site.

## URL Slug

A string of letters, numbers, and hyphens used to form the last part of the public-facing URL for the exhibit. For example, if your site is at `http://www.neatline-site.org` and the URL slug for an exhibit is `wordsworth-in-the-alps`, the URL for the public-facing version of the exhibit would be `http://www.neatline-site.org/neatline/show/wordsworth-in-the-alps`.

**Tip**: As a convenience, the URL slug field is actually linked to the "Title" field, since you'll often want the slug to "resemble" the title - as you type text into the "Title" input, a corresponding value will be automatically generated and inserted into the "Slug" field. For example, if you type "Wordsworth in the Alps" for the title, the slug will automatically read `wordsworth-in-the-alps`. If you want to change the automatic slug (for example, if the title for the exhibit is really long, and you want something shorter for the URL), just manually edit text in the slug field. Once you manually change the automatic value, Neatline assumes that you want to use the value that you entered, and the slug will stop auto-generating if you go back later and make a change to the "Title."

## Narrative

A piece of text to introduce, narrate, accompany, or otherwise generally support the exhibit. This could be anything from a short blurb up to a long-format scholaraly essay or a monograph. How you use this field will often depend on how the site theme lays out the public-facing exhibit views - if the narrative is positioned below the exhibit, you might just want a snippet of introductory content; if it's placed to the site of the exhibit and given more room, it might make sense to add more content.  In practice, it often make sense to modify the theme according to the needs of the project - if you need a lot of supporting text, build the theme to accommodate it.

**Tip**: The "Narrative" field integrates tightly with the NeatlineNarrative widget, which makes it possible to connect individual paragraphs, sentences, and words in the "Narrative" content with records in the exhibit. For example, if "Narrative" contained markup like this:

```html
... <span data-neatline-slug="paris">Paris</span> ...
```

And you had a record in your Neatline exhibit with a slug of `paris`, the word "Paris" narrative would be interactively linked with the location on the map, and vice versa.

## Widgets

The combination of user-interface widgets that are "activated" for the exhibit. Since widgets are installed as separate "sub-plugins" in Omeka, there won't be any options available for selection by default. If you've installed the NeatlineWaypoints and NeatlineSimile sub-plugins, though, you'll see two options in the menu that appears when you click the field: "SIMILE Timeline" and "Waypoints." Just click one or both of the options (or neither), and a block will appear in the box, indicating that the widget has been enabled for the the exhibit.

## Base Layers

The base layers that are available in the exhibit. All of these layers will be accessible by way of the "layer switcher" tool displayed in the top right corner of the map in the editing environment and public view. Like with the "Widgets" field, click on the input to display a list of layers, any of which can be clicked and added to the list of selections.

## Default Layer

The default base layer that's displayed when an exhibit is first accessed. This is an important selection, since the default layer will often strongly influence the visual aesthetic of the exhibit of the exhibit.

## Public

If left unchecked, the exhibit will be visible in the Omeka administrative interface, but not on the public site. Check the box to publish the exhibit to the web.
