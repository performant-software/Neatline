# Creating Records

## At a Glance

  - Records can be created directly inside of a Neatline exhibit.
  - Existing Neatline records can be individually linked to (and unlinked from) Omeka items at any point.
  - Omeka items can be bulk-imported into Neatline exhibits.

Once we have a fresh exhibit in place, let's get started by creating some new records.

## Manually Creating Records inside of Exhibits

The simplest way to add a new record is just to create one directly inside of the Neatline editor.

  1. Open the editor for an exhibit by clicking on the exhibit's title in the main browse view.

  2. Click the "New Record" link just below the search bar.

This will open up an empty editing form for the new record. **Important**: Keep in mind that the record won't actually be saved to the database until you click the "Save" button at the bottom of the form.

## Connecting a Neatline Record with an Omeka Item

Once a record has been created in an exhibit, it can be "linked" back to an item in the Omeka collection:

  1. Open the editing form for the record that you want to tie to an Omeka item (or click "New Record" if you want to start from scratch).

  2. In the "Omeka ID" field, start typing the title (or any text that appears in any of the other elements) of the Omeka item that you want to associate the record with. As you type, a list of matching search results will autocomplete below the input.

  3. Click on the name of the item that you want to link the record with. As soon as you click on the listing, the "Omeka ID" field will be populated with the items's id, and the title will be inserted into the "Title" field.

  4. Click the "Save" button at the bottom of the form. The "Body" field of the record will be populated by the compiled metadata output of the parent item (similar to the content that's displayed on the default item "show" pages in Omeka).

Once the association is established, the Neatline record will update automatically whenever the Omeka item is changed. For example, if you changed the title of the record, or added a new file upload, the "Title" and "Body" fields would automatically reflect the new information when you view the Neatline exhibit.

**Important**: Once you've associated a record to an Omeka item, you can't make custom changes to the "Title" or "Body" fields. For example, if you change the title to something else, and then saved the record, the new value would be overriden by the Dublin Core "Title" field on the item. This is a deliberate restriction - if you find youself wanting to tweak the content of the record - but don't want to change the elements directly on the parent item - it may be an indication that the record shouldn't be associated with an item, and should just be an unafilliated record in the exhibit.

That said, it's quite possible that you might want to change the structure or layout of the compiled metadata output in the "Body" field. For example, imagine that you're working with items that represent photographs - in the Neatline exhibit, you might want to hide some of the more nitty-gritty element texts on the items (eg, "Date" or "Published"), and just show the title, thumbnail, and description. To address this, Neatline makes it possible to completly customize the structure of the compiled "Body" fields at the level of the theme in the same way that you create a custom `show.php` template for the regular item pages. Head over to the "Theming Exhibits" guide for detailed instructions about how to do this.

## Bulk-Importing Omeka Items

So far, we've manually created individual Neatline records and associated them with items in the Omeka collection. But what if you already have an existing collection of hundreds or thousands of items? Instead of manually creating Neatline records for each of the items individually, you can just bulk-import part or all of the collection into a Neatline exhibit:

  1. Go to the main exhibits browse page and find the listing for the exhibit. Click the "Import Omeka Items" link under the exhibit title.

  2. This takes you to the import query page. Think of a "search" page - you can use any of the available inputs to define a "query" on the Omeka archive that defines which group of items you want to import into the exhibit. For example, if you have a large archive with multiple collections, you might just be interested in working with one individual collection, and don't want to clutter up the Neatline exhibit with all of the other unrelated items. These fields work just like the corresponding inputs in the default advanced search form in the items interface:

    - **Search by a range of ID#s (eg: 1-4, 156, 79)**: Enter an individual ID (not so useful) or a range of id's (more useful), and all items that fall within the supplied range will be imported.
