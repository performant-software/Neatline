<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Pagination links in editor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="pagination-template" type="text/templates">

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
    if (prevStart >= 0) {
      prev += '/start='+prevStart;
    } else {
      prev += '/start=0';
      prevActive = false;
    }

    // Add next offset.
    if (nextStart < records.count) {
      next += '/start='+nextStart;
    } else {
      next += '/start='+records.offset;
      nextActive = false;
    }

  %>

  <ul>
    <li <% if (!prevActive) {
      %><%='class="disabled"'%><%
    } %>><a href="<%= prev %>">«</a></li>
    <li <% if (!nextActive) {
      %><%='class="disabled"'%><%
    } %>><a href="<%= next %>">»</a></li>
  </ul>
  <div class="pagination-offset">
    <span class="start"><%= records.offset+1 %></span> -
    <span class="end"><%= records.offset+records.length %></span> of
    <span class="total"><%= records.count %></span>
  </div>

</script>
