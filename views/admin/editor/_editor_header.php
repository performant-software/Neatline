<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <title>Neatline Editor: <?php echo $title; ?></title>

<?php
    queue_css('jquery-ui', 'screen');
?>

<!-- Plugin Stuff -->
<?php admin_plugin_header(); ?>

<!-- Stylesheets -->
<?php display_css(); ?>

<!-- JavaScripts -->
<?php display_js(); ?>

</head>
<?php echo body_tag(array('id' => @$bodyid, 'class' => @$bodyclass)); ?>
