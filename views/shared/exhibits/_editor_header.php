<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<!DOCTYPE html>
<html lang="en-us">
<head>

  <meta charset="utf-8">
  <title><?php echo __(
    'Neatline Editor: %s', nl_exhibit()->title
  ); ?></title>

  <?php
    nl_queueNeatlineEditor(nl_exhibit());
    echo head_js(false);
    echo head_css();
  ?>

</head>

<?php echo body_tag(array(
  'id' => @$bodyid, 'class' => @$bodyclass
)); ?>
