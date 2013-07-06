# Adding Text Content

## At a glance

  - Text content for records is entered in the "Title" and "Body" fields in the "Text" tab.
  - The title should be short, and generally shouldn't contain complex HTML or formatting.
  - The body can be anything from a short blurb up to a long-format narrative essay.
  - Any kind of HTML-embeddable media can be put in the body - audio, video, etc.
  - Use the "Edit HTML" links to open a fullscreen WYSWYG editor for either of the fields.
  - All text fields are optional, but it's recommended to at least enter a title.

## Slug (optional)

The slug is a plain-text identifier for the record - think of it as a human-readable ID that can be used to reference the record from without. Specifically, the Neatline Narrative plugin - which makes it possible to connect text documents to Neatline exhibits - makes it possible to connect individual paragraphs, sentences, or words in a text with individual Neatline records. For example, in the exhibit "Narrative" field, you might have something like this:

```html
... <span data-neatline-slug="paris">Paris</span> ...
```

If you had a record in your Neatline exhibit with a slug of `paris`, the word "Paris" document would be interactively linked with the location on the map. The slug isn't actually displayed anywhere in the public-facing version of the exhibit - if you're not using the Narratives plugin, it fine to just leave it blank.

## Title (optional, recommended)

The title is the top-level snippet of text used to label the record in pop-up bubbles, on timelines, and in vertical listings of waypoints. Try to keep it short and simple, and avoid using complex formatting. A title isn't strictly required, but if you leave it blank you'll likely end up with some odd visual artifacts in your exhibit (empty preview bubbles, unlabelled points and spans on the timeline, etc).

If you want to add special formatting to the title (eg, make it bold, increase the size), click the "Edit HTML" link next to the field label. This will open a full-screen WYSWYG editor with a full load-out of formatting options. When you're done with the editor, click the **Minimize** button to return to the regular editing interface.

## Body (optional)

The body is a catch-all field designed to house the main textual content for the record. Depending on what kind of content you're working with and how you're structuring the user-interface for the exhibit, it might make sense to enter anything from a short little blurb all the way up to a 10,000-word scholaraly essay.

Like with the title, click on the "Edit HTML" link to open up a full-screen WYSWYG editor for the field. Although it's generally a good idea to keep the formatting pretty minimal for the title, it fine to use much more elaborate and structural styling in the body - bullets and numbered lists, images, tables, etc.

Also, you can use the body as a space to include any kind of embeddable third-party multimedia content - videos from YouTube or Vimeo, audio from SoundCloud, etc. Just click on the "Source" button at the top left of the editor to activate view-HTML mode, and paste in the embed code.
