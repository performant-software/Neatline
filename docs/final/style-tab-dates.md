# Editing Record Dates

## At a Glance

  - These fields describe when a record "occurred," or when the record should be visible in the exhibit.
  - **Important**: All dates must be entered in a portable, standards-compliant format called [ISO 8601][iso8601].
  - To display temporal information, you'll need to install a sub-plugin like [NeatlineSimile][neatline-simile].

### Examples:

  - `1564` - The year 1564.
  - `1564-04` - April, 1564.
  - `1564-04-23` - April 23, 1564.
  - `1564-04-23T08:30` - 8:30 AM on April 23, 1564.
  - `1564-04-23T08:30:15` - 15 seconds after 8:30 AM on April 23, 1564.

## Start Date

The "first" or "beginning" date for an event. If the event is an instant (it happened exactly once, and did not occupy any kind of duration or interval of time), enter the date of the instant in this field.

## End Date

The "last" or "finishing" date for an event.

## After Date

The date _after which_ the record should be displayed in the exhibit.

## Before Date

The date _before which_ the record should be displayed in the exhibit.


[iso8601]: https://en.wikipedia.org/wiki/ISO_8601
[neatline-simile]: https://github.com/scholarslab/nl-widget-Simile
