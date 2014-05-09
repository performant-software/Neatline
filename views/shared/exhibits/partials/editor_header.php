<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!DOCTYPE html>
<html lang="en-us">
<head>

  <meta charset="utf-8">
  <title><?php echo __(
    'Neatline Editor: %s', nl_getExhibit()->title
  ); ?></title>

  <?php
    echo head_js(false);
    echo head_css();
  ?>

</head>

<?php echo body_tag(array(
  'id' => @$bodyid, 'class' => @$bodyclass
)); ?>
