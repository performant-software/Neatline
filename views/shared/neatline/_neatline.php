<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Base markup for a Neatline.
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

<!-- Neatline container. -->
<div id="neatline" class="neatline-container">

    <!-- Map. -->
    <div id="map" class="neatline-block"></div>

    <!-- Timeline. -->
    <div id="timeline" class="neatline-block neatlinetime-timeline">
        <?php echo $this->partial('neatline/_timeline_zoom.php'); ?>
    </div>

    <!-- Items. -->
    <div id="items" class="neatline-block">
        <ul id="items-container"></ul>
    </div>

    <!-- Scroll arrows. -->
    <?php echo $this->partial('neatline/_arrows.php'); ?>

    <!-- Bubbles. -->
    <?php echo $this->partial('neatline/_bubbles.php'); ?>

</div>

<!-- JSON globals. -->
<script type="text/javascript">

    <?php $renderer = new NeatlineRenderer($exhibit); ?>
    Neatline = <?php echo json_encode($renderer->render()); ?>

</script>
