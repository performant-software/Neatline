# Editing Record Groups

## At a Glance

  - Use tags to slice and dice large collections into subsets of related records.
  - Tags can be used as the "selectors" for Neatline's stylesheet system, which uses a simplified dialect of CSS.
  - Each record is assigned to a "Presenter," which controls how the record's content is displayed.

## Tags

The tags field takes a comma-delimited list of one or more tags. For example:

  - `virginia`
  - `precinct, democrat, 2004`
  - `precinct, republican, 2012`
  - `confederate, may_3`
  - `union, may_4`

Neatline's tagging system provides a powerful and flexible way to slice and dice records into groups of related subsets. This can be useful for a number of reasons:

  - Tags provide the "selectors" that makes it possible for the Neatline styling system to apply bulk updates to large collections of records. For example, you could do something like:

  ```css
  .virginia {
      fill-color: #08c;
  }
  ```

  This automatically updates the "Fill Color" of all records in the exhibit tagged with `virginia`, even if there are hundreds of thousands of them. For more infomation about this, head over to the "Styling Exhibits with Neatline CSS" guide.

  - You can filter the list of records in the content management pane in the editor with a query syntax. For example, you could search for:

  `tags: precinct, democrat`

  And just show the records that are tagged with both `precinct` and `democrat`.

  - If you're developing a custom theme or sub-plugin for an exhibit, you can use tags to toggle on and off different portions of the exhibit. For example, imagine you're mapping presidential election results, and you want to add a little widget that makes it possible for the user to check on or off different batches of data from 2000, 2004, etc. If all the data points are tagged to one of the election cycles, you could just run simple API queries like:

  ```javascript
  Neatline.execute('MAP:load', { tags: ['2004', 'democrat'] });
  ```

## Presenter

Each record is assigned to a "presenter," which determines the mechanism by which the record's content is displayed (the "Title" and "Body" fields). Out of the box, Neatline comes with two simple presenters - the "Static Bubble," which displays the pop-up bubbles that appear when the cursor hovers or clicks on a record, and the "None" presenter, which, as you might guess, does nothing (this is useful for purely-visual annotations that don't need any kind of text content - arrows, brackets, etc).

The Neatline plugin API makes it easy for developers to implement completely new presenters, which would then be available for selection in this field. For example, it would be easy to write a presenter that would add a "floating" bubble that would track the location of the cursor on the page, or a presenter that would open up a full-screen modal view. See the developer documentation for more information about creating new presenters.
