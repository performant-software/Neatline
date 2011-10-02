<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * The core Neatline editor. Wraps the markup for the editing interface and then
 * calls the central _neatline.php partial, which is shared with public views.
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

<?php echo $this->partial('editor/_editor_header.php', array(
    'title' => $neatline->name
)); ?>

<?php echo $this->partial('editor/_topbar.php', array(
    'title' => $neatline->name
)); ?>

<?php echo $this->partial('editor/_item_browser.php', array(
    'tags' => $tags,
    'collections' => $collections,
    'types' => $types
)); ?>

<?php echo $this->partial('index/_neatline.php', array(
    'neatline' => $neatline,
    'timeline' => $timeline,
    'map' => array(
        'boundingBox' => $map->boundingBox,
        'epsg' => $map->epsg,
        'wmsAddress' => $map->wmsAddress,
        'layers' => $map->layers
    ),
    'dataSources' => array(
        'timeline' => neatline_getTimelineDataUrl($neatline->id)
    )
)); ?>

<?php echo $this->partial('editor/_tooltips.php'); ?>
