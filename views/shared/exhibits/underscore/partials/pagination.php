<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Pagination links.
 *
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
  var prevStart = records.offset-limit;
  var nextStart = records.offset+limit;

  var prevActive = true;
  var nextActive = true;

  // Add prev offset.
  if (prevStart > 0) {
    prev += '/start='+prevStart;
  } else {
    if (_.isEmpty(query)) prev = '#records';
    if (records.offset == 0) prevActive = false;
  }

  // Add next offset.
  if (nextStart < records.count) {
    next += '/start='+nextStart;
  } else {
    next += '/start='+records.offset;
    nextActive = false;
  }

%>

<% if (
  !_.string.startsWith(query, 'map:') &&
  records.count > Neatline.global.page_length
) { %>

  <div class="pagination">
    <ul class="prev-next">
      <li <% if (!prevActive) {
        %><%='class="disabled"'%><%
      } %>><a class="prev" href="<%= prev %>">«</a></li>
      <li <% if (!nextActive) {
        %><%='class="disabled"'%><%
      } %>><a class="next" href="<%= next %>">»</a></li>
    </ul>
    <div class="pagination-details">
      <span class="start"><%= records.offset+1 %></span> -
      <span class="end"><%= records.offset+records.length %></span> of
      <span class="total"><%= records.count %></span>
    </div>
  </div>

<% } %>
