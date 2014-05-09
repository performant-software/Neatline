<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
  echo head(array(
    'title' => __('Neatline | Edit "%s"', nl_getExhibitField('title')),
  ));
?>

<div id="primary">
  <?php echo flash(); ?>
  <?php echo $form; ?>
</div>

<?php echo foot(); ?>
