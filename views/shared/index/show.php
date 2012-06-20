<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Full-screen Neatline exhibit.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>
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
    <title><?php echo $exhibit->name; ?></title>

    <?php
    neatline_queueNeatlineAssets($exhibit);
    neatline_queuePublicAssets();
    ?>

    <!-- Stylesheets -->
    <?php display_css(); ?>

    <!-- JavaScripts -->
    <?php display_js(); ?>

    <script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.5&amp;sensor=false"></script>

    <!-- Plugin Stuff -->
    <?php plugin_header(); ?>

</head>

<body class="neatline <?php echo $exhibit->slug; ?>">

<div id="topbar">
    <div class="exhibit-title"><?php echo $exhibit->name; ?></div>
    <div class="exhibit-fullscreen">
        <a href="<?php echo public_uri('neatline-exhibits/show/' . $exhibit->slug); ?>/fullscreen">
            <span class="icon"></span> <span class="text">View Fullscreen</span>
        </a>
    </div>
</div>

<?php if ((bool) $exhibit->public): ?>

    <!-- The core Neatline partial. -->
    <?php echo $this->partial('neatline/_neatline.php', array(
        'exhibit' => $exhibit
    )); ?>

<?php else: ?>
    <?php echo $this->partial('neatline/_private.php'); ?>
<?php endif; ?>

<div id="footer">
    <div class="exhibit-description"><?php echo $exhibit->description; ?></div>
</div>

</body>
</html>
