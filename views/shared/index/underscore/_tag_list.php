<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag list underscore template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="tag-list-template" type="text/templates">
  <% tags.each(function(t) { %>
    <a href="#tags/<%= t.get('id') %>">
      <span class="tag"><%= t.get('tag') %></span>
    </a>
  <% }); %>
</script>
