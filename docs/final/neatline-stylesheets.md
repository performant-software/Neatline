# Styling Exhibits with Neatline-Flavored CSS

## Why are stylesheets, and why should I use them?

Neatline 2.0 makes it possible to work with _really_ large collections of records - as many as about 1,000,000 in a single exhibit. That level of scalability is liberating, but it also introduces some interesting new content management challenges. If the map can _display_ that many records, there also need to be new tools that make it possible to effectively update and maintain content at that scale.

For example, imagine you're plotting returns from the last four presidental election. You import a big collection of about 800,000 records, 200,000 for each of the four elections. Each record represents an individual precinct somewhere in the country with a dot on the map, scaled according to how many votes were cast at the location and shared red or blue depending on which party won more votes. Once the data is loaded into Neatline, you realize that you want to change the shade of blue used to represent the democratic precincts. How do you do that, short of manually making the change on all **~400,000** democratic records?

This is obviously a problem with really massive data sets, but, as you work with Neatline, you'll find that this type of problem rears its head surprisingly quickly, even with quite small exhibits in the 50- to 100-record range. The essence of the problem is this - records are almost never "unique snowflakes" in the exhibit. They almost always exist as part of some kind of general taxonomy or grouping in the exhibit - `democratic`, `2012`, `northeast`, etc. And, in almost every case, those groupings should share some common attributes. All democratic records should be the same shade of blue; all precincts from 2004 should be visible on the map during the same range of dates; all precinct records should have the same basic opacity settings; ad infinitum.

But, as you can see, they shouldn't share _all_ of their attributes - all 2004 precincts should share the same range of dates (the "After Date" and "Before Date" fields), but they most definitely should _not_ share the "Fill Color" field, since that would clobber out the all-important distinction between the blue democratic records and the red republican precincts. In other words, _different groups of records need to share different sets of attributes_.

We can map this out schematically. Here's a list of all the "categories" in the exhibit, and the fields that should be shared for each of the categories:

- **All Precincts**: Fill Opacity, Stroke Width
- **Democratic**: Fill Color
- **Republican**: Fill Color
- **2000**: After Date, Before Date
- **2004**: After Date, Before Date
- **2008**: After Date, Before Date 
- **2012**: After Date, Before Date

How do we keep the groups synchronized? Really, this is a familiar problem - it's almost exactly the same task as styling web pages with [CSS][css] (Cascading Style Sheets), a simple styling language that makes it possible to "select" specific parts of a page and apply a set of rules to those elements. In Neatline 2.0, it's possible to use a simplified dialect of CSS - integrated directly into the editing environment - to model these kinds of relationships among records and keep them in sync.

In Neatline, the stylesheet system is closely tied to the tagging system. Tags are just comma-delimited lists of identifiers that can be added to each individual record under the "Style" tab in the record edit form. In this example, individual records in the collection might have tag strings that look like this:

  - `precinct, democrat, 2000`
  - `precinct, republican, 2000`
  - `precinct, democrat, 2012`
  - `county, republican, 2008`

## Getting started with stylesheets

Let's see how this works in practice. All exhibits have a built-in stylesheet (which can always be left empty, if you don't want to use the feature):

  1. Open the editing environment for an exhibit.
  2. Click on the **Styles** tab. Under the tab, you'll see a code editor labelled "Stylesheet," which is where you can enter in the styling rules for the exhibit.


[css]: https://en.wikipedia.org/wiki/Cascading_Style_Sheets
