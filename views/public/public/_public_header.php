<!DOCTYPE html>
<!--[if IE 6]>
<html id="ie6" dir="ltr" lang="en-US">
<![endif]-->
<!--[if IE 7]>
<html id="ie7" dir="ltr" lang="en-US">
<![endif]-->
<!--[if IE 8]>
<html id="ie8" dir="ltr" lang="en-US">
<![endif]-->
<!--[if IE 9]>
<html id="ie9" dir="ltr" lang="en-US">
<![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8)  ]><!-->
<html dir="ltr" lang="en-US">
<!--<![endif]-->
<head>

    <meta charset="utf-8">
<?php
    $titleString = get_option('site_title') . ' | ' . $titlePrefix . ':' . $exhibit->name;
?>
    <title><?php echo $titleString; ?></title>

    <!-- Plugin Stuff -->
    <?php plugin_header(); ?>

    <!-- Stylesheets -->
    <?php display_css(); ?>

    <!-- JavaScripts -->
    <?php display_js(); ?>

    <script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.5&amp;sensor=false"></script>

</head>

<body class="<?php echo $exhibit->slug; ?>">
