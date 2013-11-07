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
  var prev = '#records/search';
  var next = '#records/search';

  // Add existing query.
  if (!_.isEmpty(query)) {
    prev += '/query='+query;
    next += '/query='+query;
  }

  // Compute back/forward offsets.
  var prevStart = records.metadata.offset-limit;
  var nextStart = records.metadata.offset+limit;

  var prevActive = true;
  var nextActive = true;

  // Add prev offset.
  if (prevStart > 0) {
    prev += '/start='+prevStart;
  } else {
    if (_.isEmpty(query)) prev = '#records';
    if (records.metadata.offset == 0) prevActive = false;
  }

  // Add next offset.
  if (nextStart < records.metadata.count) {
    next += '/start='+nextStart;
  } else {
    next += '/start='+records.metadata.offset;
    nextActive = false;
  }

%>

<% if (
  records.metadata.count > Neatline.g.neatline.per_page &&
  !_.string.startsWith(query, 'map:')
) { %>

  <div class="pagination-container">

    <ul class="pagination">

      <li <% if (!prevActive) { %><%='class="disabled"'%><% } %>>
        <a class="prev" href="<%= prev %>">&laquo;</a>
      </li>

      <li <% if (!nextActive) { %><%='class="disabled"'%><% } %>>
        <a class="next" href="<%= next %>">&raquo;</a>
      </li>

    </ul>

    <div class="offset">
      <span class="start"><%= records.metadata.offset+1 %></span>
      <span class="separator">-</span>
      <span class="end"><%= records.metadata.offset+records.length %></span>
      <span class="separator">of</span>
      <span class="total"><%= records.metadata.count %></span>
    </div>

  </div>

<% } %>
