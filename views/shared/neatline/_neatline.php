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

<div id="neatline-editor" class="neatline-container">

    <div id="map" class="neatline-block"></div>

    <div id="timeline" class="neatline-block"></div>

    <div id="undated" class="neatline-block">
        <?php echo $this->partial('neatline/_undated_items.php'); ?>
    </div>

</div>

<!-- Generic markup for the timeline popups. -->
<?php echo $this->partial('neatline/_popups.php'); ?>

<!-- JSON globals. -->
<script type="text/javascript">
    var Neatline = <?php echo json_encode($neatline); ?>;
        Neatline.timeline = <?php echo json_encode($timeline); ?>;
        Neatline.map = <?php echo json_encode($map); ?>;
        Neatline.dataSources = <?php echo json_encode($dataSources); ?>;
</script>
