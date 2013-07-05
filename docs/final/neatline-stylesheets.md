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
  - `state, republican, 2008`

## Getting started with stylesheets

Let's see how this works in practice. All exhibits have a built-in stylesheet (which can always be left empty, if you don't want to use the feature):

  1. Open the editing environment for an exhibit.
  2. Click on the **Styles** tab. Right under the tab, you'll see a code editor labelled "Stylesheet," which is where you can enter in the styling rules for the exhibit.

Let's start by defining some basic, generic styles for the each of the precincts, which are all represented as dots on the map:

```css
.precinct {
  fill-opacity: 0.5;
  stroke-width: 0;
}
```

Now, when I click "Save" at the bottom of the form, Neatline will update the "Fill Opacity" and "Stroke Width" of all 800,000 records tagged as `precinct`s with `0.5` and `0`. Next, let's add the date visibility settings for each of the three election-season tags:

```css
.precinct {
  fill-opacity: 0.5;
  stroke-width: 0;
}

.2000 {
  after-date: 2000;
  before-date: 2004;
}
 
.2004 {
  after-date: 2004;
  before-date: 2008;
}
 
.2008 {
  after-date: 2008;
  before-date: 2012;
}
 
.2012 {
  after-date: 2012;
  before-date: 2016;
}
```

Likewise, when I click "Save," Neatline will update the "After Date" and "Before Date" fields on each record depending on which of the election-season is assigned to it.

## Auto-Updating Stylesheet Values

This is all fine and well, but what if we don't actually know what value we want to use? In each of these cases, we're working with fields that have fairly "semantic" values that we can reason about in the abstract (eg, `2004` just means what it means). This isn't always true, though, notably in the case of colors, where it's impossible to reason in the abstract about which specific hexadecimal value you want to use. For example, I know that I want the democratic precincts to be "blue" and the republican precints to be "red," but I don't know that I want to use the `#206bbf` and `#9d0000`.

You could always just open one of the individual record forms, use the built-in color pickers to find a color that works well, and copy and paste it back into the stylesheet. This is sort of awkward, though. To fix this, Neatline makes it possible to just "activate" a set of styles for a tag in the stylesheet _without providing a concrete value_, and then set the value for the entire group of tagged records by making a change to an individual record.

We do this with the special `auto` value:

```css
.precinct {
  fill-opacity: 0.5;
  stroke-width: 0;
}

.2000 {
  after-date: 2000;
  before-date: 2004;
}
 
.2004 {
  after-date: 2004;
  before-date: 2008;
}
 
.2008 {
  after-date: 2008;
  before-date: 2012;
}
 
.2012 {
  after-date: 2012;
  before-date: 2016;
}

.democrat {
  fill-color: auto;
}

.republican {
  fill-color: auto;
}
```

Once this is in place, I can just open up any of the individual republican precinct records and pick a shade of red for that specific record. When I click "Save," Neatline recognizes that the "Fill Color" style has been enabled for the `republican` tag, and that the record being saved is tagged as `republican`. When this happens, Neatline does two things. First, it _update the stylesheet with the new value_:

```css
.republican {
  fill-color: #9d0000;
}
```

And, second, it immediately propagates the new value to all of the other `republican` records, just as if the stylesheet had been directly saved. This actually works for all styles, even ones that already have concrete values in the stylesheet (as opposed to `auto`). For example, if I opened up one of the precinct records and changed the value of "Fill Opacity" to `0.7`, and then saved that individual record, the `fill-opacity` rule under the precinct tag in the stylesheet would be updated with the new value and all of the precincts would be updated with the new value of `0.7`. Effectively, this means that it's _impossible for the records and the stylesheet to get out of sync_ - changes made to the stylesheet are immediately propagated out to the records, and changes made to individual records are immediately pushed back into the stylesheet.


[css]: https://en.wikipedia.org/wiki/Cascading_Style_Sheets
