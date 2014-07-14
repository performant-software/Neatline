<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="record-list-template" type="text/template">

  <!-- Add record link. -->
  <a href="#edit/new" class="btn btn-primary btn-lg add">
    <span class="glyphicon glyphicon-file"></span>
    <?php echo __('New Record'); ?>
  </a>

  <!-- Top pagination. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/pagination.php'
  ); ?>

  <div class="list-group">

    <% records.each(function(r) { %>

      <!-- Record listing. -->
      <a href="#edit/<%= r.id %>" data-id="<%= r.id %>"
        class="list-group-item">

        <!-- Title. -->
        <span class="title">
          <% if (r.has('title')) { %>
            <%= _.string.stripTags(r.get('title')) %>
          <% } else { %>
            <%= Neatline.g.neatline.strings.record.placeholders.title %>
          <% } %>
        </span>

        <!-- Body. -->
        <span class="body">
          <%= _.string.prune(
            _.string.stripTags(r.get('body')), 100
          ) %>
        </span>

      </a>

    <% }); %>

  </table>

  <!-- Bottom pagination. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/pagination.php'
  ); ?>

</script>
