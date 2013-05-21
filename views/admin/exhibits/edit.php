<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php nl_queueExhibitForm(); ?>

<?php
  echo head(array(
    'title' => __('Neatline | Edit "%s"', nl_getExhibitField('title')),
    'content_class' => 'neatline'
  ));
?>

<div id="primary">
  <?php echo flash(); ?>
  <?php echo $form; ?>
</div>

<?php echo foot(); ?>
