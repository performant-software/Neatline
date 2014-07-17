<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<%

if (

  // If we're not map-mirroring.
  !_.string.startsWith(query, 'map:') &&

  // And if the records don't fit on a single page.
  records.metadata.numFound > Neatline.g.neatline.per_page

) {

  // Base fragment.
  var prevUrl = '#browse';
  var nextUrl = '#browse';

  // Add existing query.
  if (!_.isEmpty(query)) {
    prevUrl += '/query=' + query;
    nextUrl += '/query=' + query;
  }

  // Compute previous/next start offsets.
  var prevStart = records.metadata.start - limit;
  var nextStart = records.metadata.start + limit;

  var prevActive = true;
  var nextActive = true;

  // Add offset to previous URL.
  if (prevStart > 0) {
    prevUrl += '/start=' + prevStart;
  } else {
    if (_.isEmpty(query)) prevUrl = '#browse';
    if (records.metadata.start == 0) prevActive = false;
  }

  // Add offset to next URL.
  if (nextStart < records.metadata.numFound) {
    nextUrl += '/start=' + nextStart;
  } else {
    nextUrl += '/start=' + records.metadata.start;
    nextActive = false;
  }

%>

  <div class="pagination-container">

    <ul class="pagination">
      <li <% if (!prevActive) { %><%='class="disabled"'%><% } %>>
        <a class="prev" href="<%= prevUrl %>">&laquo;</a>
      </li>
      <li <% if (!nextActive) { %><%='class="disabled"'%><% } %>>
        <a class="next" href="<%= nextUrl %>">&raquo;</a>
      </li>
    </ul>

    <div class="offset">
      <span class="start"><%= records.metadata.start + 1 %></span>
      <span class="separator">-</span>
      <span class="end"><%= records.metadata.start+records.length %></span>
      <span class="separator">of</span>
      <span class="total"><%= records.metadata.numFound %></span>
    </div>

  </div>

<% } %>
