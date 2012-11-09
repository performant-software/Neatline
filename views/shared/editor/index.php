<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * The top-level Neatline editor view. Wraps the markup for the editing
 * interface and then calls the central _neatline.php partial, which is
 * shared with public views.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php echo $this->partial('editor/_editor_header.php', array(
    'exhibit' => $exhibit,
    'title' => __('Neatline Editor: %s', $exhibit->title)
)); ?>

<!-- Editor. -->
<?php echo $this->partial('editor/_item_browser.php'); ?>

<!-- Exhibit. -->
<?php echo $this->partial('neatline/_neatline.php', array(
    'exhibit' => $exhibit
)); ?>

<?php echo $this->partial('editor/_editor_footer.php'); ?>
