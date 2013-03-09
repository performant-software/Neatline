<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record list.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="record-list-template" type="text/templates">

  <!-- Top pagination. -->
  <div class="pagination"></div>

  <ul class="list">

    <!-- Add record link. -->
    <a href="#record/add">New Record</a>

    <% records.each(function(r) { %>

      <!-- Record listing. -->
      <a href="#record/<%= r.get('id') %>"
        data-id="<%= r.get('id') %>">

        <!-- Title. -->
        <span class="title">
          <% if (!_.isEmpty(r.get('_title'))) { %>
            <%= _.string.stripTags(r.get('_title')) %>
          <% } else { %>
            <%= STRINGS.placeholders.title %>
          <% } %>
        </span>

        <!-- Body. -->
        <span class="body">
          <%= _.string.stripTags(r.get('_body')) %>
        </span>

      </a>

    <% }); %>

  </ul>

  <!-- Bottom pagination. -->
  <div class="pagination"></div>

</script>
