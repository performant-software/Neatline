# Styling Exhibits with Neatline-Flavored CSS

## The Rationale - Why Should You Use Stylesheets?

Neatline 2.0 makes it possible to work with _really_ large collections of records - as many as about 1,000,000 in a single exhibit. That level of scalability is liberating, but it also introduces some interesting new content management challenges. If the map can _display_ that many records, there also need to be new tools that make it possible to effectively update and maintain content at that scale.

For example, imagine you're plotting returns from the last four presidental election. You import a big collection of about 800,000 records, 200,000 for each of the four elections. Each record represents an individual precinct somewhere in the country with a dot on the map, scaled according to how many votes were cast at the location and shared red or blue depending on which party won more votes. Once the data is loaded into Neatline, you realize that you want to change the shade of blue used to represent the democratic precincts. How do you do that, short of manually making the change on all **~400,000** democratic records?

This is obviously a problem with really massive data sets, but, as you work with Neatline, you'll find that this type of problem rears its head surprisingly quickly, even with quite small exhibits in the 50- to 100-record range. The essence of the problem is this - records are almost never "unique snowflakes" in the exhibit. They almost always exist as part of some kind of general taxonomy or grouping in the exhibit - `democratic`, `2012`, `northeast`, etc. And, in almost every case, those groupings should share some common attributes. All democratic records should be the same shade of blue; all precincts from 2004 should be visible on the map during the same range of dates; all precinct records should have the same basic opacity settings; ad infinitum.

But, as you can see, they shouldn't share _all_ of their attributes - all 2004 precincts should share the same range of dates (the "After Date" and "Before Date" fields), but they most definitely should _not_ share the "Fill Color" field, since that would clobber out the all-important distinction between the blue democratic records and the red republican precincts. In other words, _different groups of records need to share different sets of attributes_.

We can map this out schematically. Here's a list of all the "categories" in the exhibit, and the fields that should be shared for each of the categories:

```yaml

# Colors controlled by party categories:

Democratic precincts:
  - Fill Color

Republican precincts:
  - Fill Color

# Visibility dates controlled by election cycle categories:

2000 precincts:
  - After Date
  - Before Date

2004 precincts:
  - After Date
  - Before Date

2008 precincts:
  - After Date
  - Before Date

2012 precincts:
  - After Date
  - Before Date

# Basic styling options that should apply to all precincts:

All precinct records:
  - Fill Opacity
  - Fill Opacity (Selected)
  - Stroke Width
```
