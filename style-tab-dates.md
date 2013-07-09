---
layout: default
---
# Editing Record Dates

## At a glance

  - If a record represents an event, these fields store when the event occurred and how long it lasted.
  - They can also be used to control when a record is be _visible_ in the exhibit.
  - **Important**: All dates must be entered in a portable, standards-compliant format called [ISO 8601][iso8601].
  - To display temporal information, you'll need to install a widget like [NeatlineSimile][neatline-simile].

### Examples:

  - `1564` - The year 1564.
  - `1564-04` - April, 1564.
  - `1564-04-23` - April 23, 1564.
  - `1564-04-23T08:30` - 8:30 AM on April 23, 1564.
  - `1564-04-23T08:30:15` - 15 seconds after 8:30 AM on April 23, 1564.

## Start Date

The "first" or "beginning" date for an event. If the event is an instant (it happened exactly once, and did not occupy any kind of duration or interval of time), enter the date of the instant in this field.

**If you're working with NeatlineSimile**: If you just enter a "Start Date" and leave "End Date" blank, the record will be displayed as point on the timeline.

## End Date

The "last" or "finishing" date for an event.

**If you're working with NeatlineSimile**: If you just enter a "Start Date" _and_ an "End Date" date, the record will be displayed as span (line) on the timeline.

## After Date

The date _after which_ the record should be displayed in the exhibit.

**If you're working with NeatlineSimile**: If an "After Date" is defined, then the record will only be displayed on the map when the timeline is centered on a date that falls after this date. For example, imagine you're working with a record that's plotted as a point on the map. If you set the "After Date" to `2000`, then the point will disappear when you scroll the timeline back to 1999, and reappear when you scroll forward to 2001.

## Before Date

The date _before which_ the record should be displayed in the exhibit.

**If you're working with NeatlineSimile**: If a "Before Date" is defined, then the record will only be displayed on the map when the timeline is centered on a date that falls before this date. Again, imagine you're working with a record that's plotted as a point on the map. If you set "Before Date" to `2000`, then the point will disappear when you scroll the timeline forward to 2001, and reappear when you scroll back to 1999.

If both a "After Date" and a "Before Date" are defined, then the record will only be visible when the timeline is within the duration between the two dates. For example, if "After Date" is `2000`, and "Before Date" is `2010`, the record would be visible between those two dates, but not before `2000` or after `2010`. By stringing together collections of records with different after- and before-dates, it's possible to create complex time-series animations


[iso8601]: https://en.wikipedia.org/wiki/ISO_8601
[neatline-simile]: https://github.com/scholarslab/nl-widget-Simile
