# Searching for Records

## At a Glance

  - Use the forward and backward arrows to page through the records.
  - Enter plain-text queries to search in the "Title," "Body," and "Slug" fields.
  - Type `tags: <tag1>, <tag2>, ...` to search by tags.
  - Type `map:` to make the record list mirror the currently-visible records on the map.
  - Clear the search box to show all records.

When there are just a handful of records in an exhibit, it's easy to keep track of everything. But what if there are 1,000 records, or 100,000? In Neatline 2.0, it's possible to work with _really_ large collections of records - as many as about 1,000,000 in a single exhibit. If the ehxibit can display that quantity of information, though, there need to be tools to effectively manage information at that scale. To help with this, Neatline provides some useful searching and filtering tools tools that make it easy to hone in on the content that you're interested in working with.

## Pagination Buttons

To make it easier to browse through the content of an exhibit, Neatline splits apart large collections of records into a series of "pages," each containing a fixed number of records (by default, 50). When you first start building an exhibit, the pagination buttons will be hidden, since there aren't enough records yet to spill over onto a second page. As soon as you go over the paging limit, though, you'll see the forward and backwards buttons to page back and forth through the content.

As you click through to different pages, notice that the URL updates with information about the current pagination offset in the collection. For example, if you started out at:

`/neatline/editor/1#records`

And started paging forward through the collection, you'll see a URL like:

`/neatline/editor/1#records/search/start=50`

This is a "durable" link that can be bookmarked and returned to later - if you copy and link and paste it into a different browser tab, you'll be taken back to the same collection of records.

## Fulltext Search

To find records by regular, plain-text search queries, just enter search terms into the "Search" box at the top of the content management pane in the editor. As you type, Neatline will immediately query the underlying collection and update the list with the set of matching records. Fulltext search looks for the terms in the three text-based fields on the records - the "Title," "Body," and "Slug."

When you're finished searching, just empty the search box to go back to complete, unfiltered list of records.

## Tag Searches

If you've added tags to your records (for more information about Neatline's tagging system, see the "Working with Tags" guide), there's a special search syntax you can use to search for records that have a given tag. For example, if you want to find all records that are tagged with `tag1` and `tag2`, search for:

`tags: tag1, tag2`

When you type in the special, reserved `tags: ` prefix on the query, the text in the search box will become bold to indicate that it recognizes the structured query.

## Map Mirroing

Sometimes, the map itself is the best mechanism for finding records - if you know _where_ the records are that you're interested in, you can enter a special query that will cause the list of records to automatically synchronize with the collection of records that's visible on the map at any given moment. Just enter:

`map:`

As soon as you enter this query, the previous list of records will be replaced by _just the records that are currently visible on the map_. When you change the viewport on the map and a new batch of records is loaded, the list of records will automatically update to display the updated collection.

To disable the map mirroring mode, just clear out the search box.
