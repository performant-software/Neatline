<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record list underscore template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="record-list-template" type="text/templates">
  <% records.each(function(r) { %>
    <a href="#records/<%= r.get('id') %>" data-id="<%= r.get('id') %>">
      <span class="title"><%= r.get('title') %></span>
      <span class="body"><%= r.get('body') %></span>
    </a>
  <% }); %>
</script>
