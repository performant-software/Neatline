<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Neatline editor.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!-- Header. -->
<?php echo $this->partial('exhibits/_editor_header.php', array(
  'exhibit' => $exhibit,
  'title' => __('Neatline Editor: %s', $exhibit->title)
)); ?>

<!-- Editor partial. -->
<?php echo $this->partial('exhibits/_editor.php', array(
  'exhibit' => $exhibit
)); ?>

<!-- Footer. -->
<?php echo $this->partial('exhibits/_editor_footer.php'); ?>
