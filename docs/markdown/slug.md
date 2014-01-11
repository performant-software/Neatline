## Slug

The slug is a plain-text identifier for the record - think of it as a human-readable ID that can be used to reference the record from other locations. For example, in the Neatline Text plugin - which makes it possible to connect text documents with Neatline exhibits - individual words or sentences can be linked to Neatline records by including the record slugs in the HTML markup. For example, if the text included something like:

```html
<span data-neatline-slug="paris">Paris</span>
```

If you had a record in your Neatline exhibit with a slug of `paris`, the word "Paris" document would be interactively linked with the location on the map. **The slug isn't actually displayed anywhere in the public-facing version of the exhibit - if you're not using the Text plugin, it fine to just leave it blank.**
