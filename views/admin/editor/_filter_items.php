<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Filter items dropdown interface.
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

<div id="filter-items" class="popover">

    <div class="filter-items-column">

        <h5 class="title">Tags</h3>
        <?php foreach ($tags as $tag): ?>
            <div class="filter-option">
                <label class="filter-checkbox">
                    <input type="checkbox" />
                </label>
                <span><?php echo $tag->name; ?></span>
            </div>
        <?php endforeach; ?>

    </div>

    <div class="filter-items-column">

        <h5 class="title">Collections</h3>
        <?php foreach ($collections as $collection): ?>
            <div><?php echo $collection->name; ?></div>
        <?php endforeach; ?>

    </div>

    <div class="filter-items-column">

        <h5 class="title">Types</h3>
        <?php foreach ($types as $type): ?>
            <div><?php echo $type->name; ?></div>
        <?php endforeach; ?>

    </div>

</div>
