<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<%

  // Base fragment.
  var prevUrl = '#records/search';
  var nextUrl = '#records/search';

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
    if (_.isEmpty(query)) prevUrl = '#records';
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

<% if (
  records.metadata.numFound > Neatline.g.neatline.per_page &&
  !_.string.startsWith(query, 'map:')
) { %>

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
