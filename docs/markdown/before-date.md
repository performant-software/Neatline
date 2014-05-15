## Before Date

The date _before which_ the record should be displayed in the exhibit.

**If you're working with NeatlineSimile**: If a "Before Date" is defined, then the record will only be displayed on the map when the timeline is centered on a date that falls before this date. Again, imagine you're working with a record that's plotted as a point on the map. If you set "Before Date" to `2000`, then the point will disappear when you scroll the timeline forward to 2001, and reappear when you scroll back to 1999.

If both a "After Date" and a "Before Date" are defined, then the record will only be visible when the timeline is within the duration between the two dates. For example, if "After Date" is `2000`, and "Before Date" is `2010`, the record would be visible between those two dates, but not before `2000` or after `2010`. By stringing together collections of records with different after- and before-dates, it's possible to create complex time-series animations


### Examples

Dates need to follow the [ISO 8601][iso8601]standard:

**CE Dates**

  - `1564` - The year 1564.
  - `1564-04` - April, 1564.
  - `1564-04-23` - April 23, 1564.
  - `1564-04-23T08:30` - 8:30 AM on April 23, 1564.
  - `1564-04-23T08:30:15` - 15 seconds after 8:30 AM on April 23, 1564.

**BCE Dates**

  - `-001563` - The year 1564 BCE.
  - `-000563` - The year 564 BCE.
  - `-000063` - The year 64 BCE.
  - `-000003` - The year 4 BCE.
  - `-001563-04` - April, 1564 BCE.
  - `-001563-04-23` - April 23, 1564 BCE.

[iso8601]: https://en.wikipedia.org/wiki/ISO_8601
