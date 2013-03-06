<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form plugin panes.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<?php foreach (_nl_getRecordTabs() as $label => $data): ?>

  <!-- Pane content. -->
  <div id="record-<?php echo $data['slug']; ?>"
    class="tab-pane <?php echo $data['slug']; ?>"
  ><?php echo $data['pane']; ?></div>

<?php endforeach; ?>
