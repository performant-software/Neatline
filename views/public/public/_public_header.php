<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Page header markup for the editor.
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
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <title><?php echo $titlePrefix; ?>: <?php echo $title; ?></title>

<!-- Plugin Stuff -->
<?php plugin_header(); ?>

<!-- Stylesheets -->
<?php display_css(); ?>

<!-- JavaScripts -->
<?php display_js(); ?>

<script type="text/javascript" src="http://openlayers.org/api/OpenLayers.js"></script>
<script type="text/javascript" src="http://api.simile-widgets.org/timeline/2.3.1/timeline-api.js?bundle=true"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.5&amp;sensor=false"></script>

</head>
<?php echo body_tag(array('id' => @$bodyid, 'class' => @$bodyclass)); ?>
