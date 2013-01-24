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
  <ul>
    <li><a class="next" href="<%= next %>">«</a></li>
    <li><a class="prev" href="<%= prev %>">»</a></li>
  </ul>
  <div class="pagination-offset">
    <span class="start"><%= start %></span>&ndash;<span class="end"><%= end %></span> of
    <span class="total"><%= total %></span>
  </div>
</script>
