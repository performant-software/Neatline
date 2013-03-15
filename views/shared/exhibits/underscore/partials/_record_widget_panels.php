<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Widget panels.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php foreach (_nl_getRecordWidgets(_nl_exhibit())
  as $label => $widget): ?>

  <!-- Panels. -->
  <div id="record-<?php echo $widget['slug']; ?>"
    class="tab-pane plugin <?php echo $widget['slug']; ?>"
  ><?php echo $widget['record_form']; ?></div>

<?php endforeach; ?>
