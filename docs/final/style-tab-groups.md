# Editing Record Groups

## At a Glance

## Tags

The tags field takes a comma-delimited list of one or more tags. For example:

`virginia`
`precinct, democrat, 2004`
`precinct, republican, 2012`
`confederate, may_3`
`union, may_4`

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

## Widgets
