<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!-- Texts. -->
<?php echo all_element_texts('item'); ?>

<!-- Files. -->
<?php if (metadata('item', 'has files')): ?>
  <h3><?php echo __('Files'); ?></h3>
  <?php echo files_for_item(array('imageSize' => 'fullsize')); ?>
<?php endif; ?>
