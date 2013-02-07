<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Public exhibit show.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */
?>

<?php _nl_exhibitAssets(get_current_neatline()); ?>
<?php echo head(array('title' => neatline('title'))); ?>

<!-- The core Neatline partial. -->
<?php echo $this->partial('neatline/_neatline.php', array(
  'exhibit' => get_current_neatline()
)); ?>

<div class="exhibit-description">
    <?php echo neatline('description'); ?>
</div>

<?php echo foot(); ?>
