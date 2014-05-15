## After Date

The date _after which_ the record should be displayed in the exhibit.

**If you're working with NeatlineSimile**: If an "After Date" is defined, then the record will only be displayed on the map when the timeline is centered on a date that falls after this date. For example, imagine you're working with a record that's plotted as a point on the map. If you set the "After Date" to `2000`, then the point will disappear when you scroll the timeline back to 1999, and reappear when you scroll forward to 2001.

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
