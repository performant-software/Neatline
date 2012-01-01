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

    <div id="map" class="neatline-block"></div>

    <div id="timeline" class="neatline-block neatlinetime-timeline"></div>

    <div id="items" class="neatline-block">
        <div id="items-container"></div>
    </div>

    <div id="scroll">
        <div class="arrow-left">‹</div>
        <div class="arrow-right">›</div>
    </div>

</div>

<!-- Generic markup for the timeline popups. -->
<?php echo $this->partial('neatline/_popups.php'); ?>

<!-- JSON globals. -->
<script type="text/javascript">

    // Exhibit parameters.
    var Neatline = <?php echo json_encode($neatline); ?>;
        Neatline.dataSources = <?php echo json_encode($dataSources); ?>;
        Neatline.public = <?php echo json_encode($public); ?>;

    // Map parameters.
    <?php if (isset($map)): ?>
        Neatline.map = <?php echo json_encode($map); ?>;
    <?php endif; ?>

    // Image parameters.
    <?php if (isset($image)): ?>

        Neatline.image = <?php echo json_encode(
            array(
                'path' =>   $image['path'],
                'name' =>   $image['name'],
                'width' =>  (int) $this->fileMetadata(
                                $image['record'],
                                'Omeka Image File',
                                'Width'),
                'height' => (int) $this->fileMetadata(
                                $image['record'],
                                'Omeka Image File',
                                'Height')
            )
        ); ?>

    <?php endif; ?>

</script>
