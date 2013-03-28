<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Document header for editor.
 *
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
    'Neatline Editor: %s', _nl_exhibit()->title
  ); ?></title>

  <?php
  _nl_editorAssets(_nl_exhibit());
  echo head_js(false);
  echo head_css();
  ?>

</head>

<?php echo body_tag(array(
  'id' => @$bodyid, 'class' => @$bodyclass
)); ?>
