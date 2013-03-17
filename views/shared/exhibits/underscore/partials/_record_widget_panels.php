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

<?php $tabs = _nl_getRecordTabs(_nl_exhibit()); if (count($tabs) > 0): ?>
  <?php foreach ($tabs as $label => $tab): ?>

    <!-- Panels. -->
    <div id="record-<?php echo $tab['slug']; ?>"
      class="tab-pane plugin <?php echo $tab['slug']; ?>"
    ><?php echo $tab['form']; ?></div>

  <?php endforeach; ?>
<?php endif; ?>
