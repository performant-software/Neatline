## Presenter

Each record is assigned to a "presenter," which determines the mechanism by which the record's content is displayed (the "Title" and "Body" fields). Out of the box, Neatline comes with two simple presenters - the "Static Bubble," which displays the pop-up bubbles that appear when the cursor hovers or clicks on a record, and the "None" presenter, which, as you might guess, does nothing (this is useful for purely-visual annotations that don't need any kind of text content - arrows, brackets, etc).

The Neatline plugin API makes it easy for developers to implement completely new presenters, which would then be available for selection in this field. For example, it would be easy to write a presenter that would add a "floating" bubble that would track the location of the cursor on the page, or a presenter that would open up a full-screen modal view. See the developer documentation for more information about creating new presenters.
