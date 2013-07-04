# Searching for Records

## At a Glance

  - Use the forward and backward arrows to page through the records.
  - Enter plain-text queries to search in the "Title," "Body," and "Slug" fields.
  - Type `tags: <tag1>, <tag2>, ...` to search by tags.
  - Type `map:` to make the record list mirror the currently-visible records on the map.
  - Clear the search box to show all records.

When there are just a handful of records in an exhibit, it's easy to keep track of everything. But what if there are 1,000 records, or 100,000? In Neatline 2.0, it's possible to work with _really_ large collections of records - as many as about 1,000,000 in a single exhibit. If the ehxibit can display that quantity of information, though, there need to be tools to effectively manage information at that scale. To help with this, Neatline provides some useful searching and filtering tools:

**Tip**: As you use the pagination and searching tools, you'll notice that the URL is dynamically updated to represent the current "query" on the collection. For example, you'll see URL's like:

  - `/neatline/editor/1#records/search/start=100`
  - `/neatline/editor/1#records/search/query=keywords`
  - `/neatline/editor/1#records/search/query=keywords/start=100`

These are all "durable" links, meaning that they'll point back to the same set of results if you copied and pasted into a different browser window.

## Pagination Buttons

To make it easier to browse through the content of an exhibit, Neatline splits apart large collections of records into a series of "pages," each containing a fixed number of records (by default, 50). When you first start building an exhibit, the pagination buttons will be hidden, since there aren't enough records yet to spill over onto a second page. As soon as you go over the paging limit, though, you'll see the forward and backwards buttons to page back and forth through the content.

## Search for Keywords

To find records by regular, plain-text search queries, just enter search terms into the "Search" box at the top of the content management pane in the editor. As you type, Neatline will immediately query the underlying collection and update the list with the set of matching records. Fulltext search looks for the terms in each of the three text-based fields - the "Title," "Body," and "Slug."

When you're finished searching, just empty the search box to go back to complete, unfiltered list of records.

## Search for Tags

If you've added tags to your records (for more information about Neatline's tagging system, see the "Working with Tags" guide), there's a special search syntax you can use to search for records that have a given tag. For example, if you want to find all records that are tagged with `tag1`, enter:

`tags: tag1`

To search for records with multiple tags, just enter a comma-delimited list:

`tags: tag1, tag2, tag3, ...`

## Search by Location

Sometimes, the map itself is the best mechanism for finding records - if you know _where_ the records are that you're interested in, you can enter a special query that will cause the records in the left panel to automatically synchronize with the collection of records that's currently visible on the map. Just enter:

`map:`

As soon as you enter this query, the previous list of records will be replaced by the exact set of records that are currently visible on the map. When you pan or zoom the viewport on the map and a fresh batch of records is loaded, the list of records in the editing pane will automatically update to display the new collection from the map.

To disable the search-by-location mode, just clear out the search box.
