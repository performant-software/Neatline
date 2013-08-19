<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<script id="record-list-template" type="text/template">

  <!-- Add record link. -->
  <a href="#record/add" class="btn btn-primary add">
    <?php echo __('New Record'); ?>
  </a>

  <!-- Top pagination. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/pagination.php'
  ); ?>

  <table class="table table-striped table-condensed list">

    <% records.each(function(r) { %>
      <tr>
        <td>

          <!-- Record listing. -->
          <a href="#record/<%= r.id %>" data-id="<%= r.id %>">

            <!-- Title. -->
            <span class="title">
              <% if (!_.isEmpty(r.get('title'))) { %>
                <%= _.string.stripTags(r.get('title')) %>
              <% } else { %>
                <%= STRINGS.record.placeholders.title %>
              <% } %>
            </span>

            <!-- Body. -->
            <span class="body">
              <%= _.string.prune(
                _.string.stripTags(r.get('body')), 100
              ) %>
            </span>

          </a>

        </td>
      </tr>
    <% }); %>

  </table>

  <!-- Bottom pagination. -->
  <?php echo $this->partial(
    'exhibits/underscore/partials/pagination.php'
  ); ?>

</script>
