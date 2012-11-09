<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

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
  <title><?php echo $title; ?></title>

  <?php
  fire_plugin_hook('admin_theme_header');
  neatline_queueEditorAssets();
  echo head_css();
  echo head_js();
  ?>

</head>

<?php echo body_tag(array(
  'id' => @$bodyid, 'class' => @$bodyclass
)); ?>
