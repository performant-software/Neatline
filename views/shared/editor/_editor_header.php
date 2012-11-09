<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

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

<!-- Plugin Stuff -->
<?php fire_plugin_hook('admin_theme_header'); ?>

<?php
neatline_queueNeatlineAssets($exhibit);
neatline_queueEditorAssets();
?>

<!-- Stylesheets -->
<?php echo head_css(); ?>

<!-- JavaScripts -->
<?php echo head_js(); ?>

</head>

<?php echo body_tag(array(
    'id' => @$bodyid, 'class' => @$bodyclass
)); ?>
