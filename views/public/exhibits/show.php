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

<?php _nl_exhibitAssets(_nl_exhibit()); ?>
<?php echo head(array('title' => _nl_field('title'))); ?>

<!-- The core Neatline partial. -->
<?php echo $this->partial('neatline/_neatline.php', array(
  'exhibit' => _nl_exhibit()
)); ?>

<div class="exhibit-description">
    <?php echo _nl_field('description'); ?>
</div>

<?php echo foot(); ?>
