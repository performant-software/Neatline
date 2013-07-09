---
layout: default
---
# Creating Records

## At a glance

  - Records can be created directly inside of a Neatline exhibit.
  - Existing Neatline records can be individually linked to (and unlinked from) Omeka items at any point.
  - Omeka items can be bulk-imported into Neatline exhibits.

## Manually creating records inside of exhibits

The simplest way to add a new record is just to create one directly inside of the Neatline editor.

  1. Open the editor for an exhibit by clicking on the exhibit's title in the main browse view.

  2. Click the "New Record" link just below the search bar.

This will open up an empty editing form for the new record. **Important**: Keep in mind that the record won't actually be saved to the database until you click the "Save" button at the bottom of the form.

## Connecting a Neatline record with an Omeka item

Once a record has been created in an exhibit, it can be "linked" back to an item in the Omeka collection:

  1. Open the editing form for the record that you want to tie to an Omeka item (or click "New Record" if you want to start from scratch).

  2. In the "Omeka ID" field, start typing the title (or any text that appears in any of the other elements) of the Omeka item that you want to associate the record with. As you type, a list of matching search results will autocomplete below the input.

  3. Click on the name of the item that you want to link the record with. As soon as you click on the listing, the "Omeka ID" field will be populated with the items's id, and the title will be inserted into the "Title" field.

  4. Click the "Save" button at the bottom of the form. The "Body" field of the record will be populated by the compiled metadata output of the parent item (similar to the content that's displayed on the default item "show" pages in Omeka).

Once the association is established, the Neatline record will update automatically whenever the Omeka item is changed. For example, if you changed the title of the record, or added a new file upload, the "Title" and "Body" fields would automatically reflect the new information when you view the Neatline exhibit.

**Important**: Once you've associated a record to an Omeka item, you can't make custom changes to the "Title" or "Body" fields. For example, if you change the title to something else, and then saved the record, the new value would be overriden by the Dublin Core "Title" field on the item. This is a deliberate restriction - if you find youself wanting to tweak the content of the record - but don't want to change the elements directly on the parent item - it may be an indication that the record shouldn't be associated with an item, and should just be an unafilliated record in the exhibit.

That said, it's quite possible that you might want to change the structure or layout of the compiled metadata output in the "Body" field. For example, imagine that you're working with items that represent photographs - in the Neatline exhibit, you might want to hide some of the more nitty-gritty element texts on the items (eg, "Date" or "Published"), and just show the title, thumbnail, and description. To address this, Neatline makes it possible to completly customize the structure of the compiled "Body" fields at the level of the theme in the same way that you create a custom `show.php` template for the regular item pages. Head over to the "Theming Exhibits" guide for detailed instructions about how to do this.

## Bulk-importing Omeka items

So far, we've manually created individual Neatline records and associated them with items in the Omeka collection. But what if you already have an existing collection of hundreds or thousands of items? Instead of manually creating Neatline records for each of the items individually, you can just bulk-import part or all of the collection into a Neatline exhibit:

  1. Go to the main exhibits browse page and find the listing for the exhibit.

  2. Click the "Import Omeka Items" link under the exhibit title.

### Defining an item query

This takes you to the item import form. Think of this as a "search" form - you can use any of the available inputs to define a "query" on the Omeka archive that determines which items will be imported into the exhibit. For example, if you have a large archive with multiple collections, you might just be interested in working with one individual collection, and don't want to clutter up the Neatline exhibit with all of the other unrelated items. The fields here work just like the corresponding options in the Omeka advanced search form:

  - Use **Search by a Range of ID#s** to specify an individual ID (not so useful) or a range of id's (more useful), and all items with ID's that fall within the specified range will be imported. This is a good way to import the entire collection all at once - just enter in an indiscriminate query like "1-1000," which, as long as you have fewer than 1,000 items in your collection, will import all the items on the site. This is fine for experimentation, but in the long run, we generally recommend slicing and dicing the items in to groups with collections or tags, which often prevents content management problems down the road.

  - Use **Search By Collection** to import to items in a given collection.

  - Use **Search By Type** to import items of a given type

  - Use **Search By Tags** to constrain the import to items that are tagged with **all** of the listed tags. 

(Keep in mind that the fields are `AND`'ed together, not `OR`'ed - so, if you select a collection and enter a tag, the import will only match items that are _both_ in the collection _and_ have the tag.)

Once you've defined a search query, click "Import Items" to kick off the import. You'll be taken back to the exhibits browse page, and you'll see a success notification saying that "The item import was successfully started!"

**Important**: Behind the scenes, this actually kicks off a "background process" that does the heavy lifting of importing the items. This is necessary because it can sometimes take up to 30-40 seconds to import really large collections of items (many thousands), and the process can fail if the web request times out (smaller imports, up to about 1,000 items, will generally finish in just a couple of seconds). When you're first redirected to the exhibits browse view, though, the "# Items" counter for the exhibit will probably still be the same as it was before, since the import was started at the same moment that you were redirected. Rrefresh the page, though, and you'll see the effect of the background process as it fills in the items.

### What happens if you add new items?

When the import is finished, open the editor for the exhibit. You'll see new listings for all of the records that were matched by the import. When you open the edit form for one of the records, you'll see that the "Omeka ID" field is populated with the ID of a corresponding Omeka item and that the "Title" and "Body" fields are populated with the item title and metadata output. Just as if the records had been manually linked to their parent items, any change to the items will be propagated to the imported records.

But what if you then continue to add new Omeka items to the collection that _would have_ been matched by the original import, and want to synchronize the Neatline exhibit with the new collection of items? Neatline expects this, and makes it easy - if you go back to the "Import Omeka Items" form for the exhibit, you'll see that the original query has been saved, making it possible to re-run the identical query over and over again. When you run the query, **Neatline will never duplicate an existing item-backed record in an exhibit**, meaning that only the newly-added items will be imported.

For example, imagine you import a collection that has 100 items. Later, you add another 20 items to the collection. If you want to vacuum up those new items into the Neatline exhibit, you can just re-run the same import query, and Neatline will _only_ import the 20 new records and ignore the other 100 items that already have corresponding records in the collection.
