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

<div id="filter-items">

    <div class="filter-items-content small-scroll-content">

        <div class="filter-items-column">
            <div class="filter-option all-none">
                <input type="checkbox" />
                <span class="filter-items-all-none">All / None</span>
            </div>
        </div>

        <div class="filter-items-column tags">

            <div class="filter-header">
                <input type="checkbox" />
                <h5 class="title">Tags</h5>
            </div>

            <?php foreach ($tags as $tag): ?>
                <div class="filter-option">
                    <input type="checkbox" />
                    <span><?php echo $tag->name; ?></span>
                </div>
            <?php endforeach; ?>

        </div>

        <div class="filter-items-column types">

            <div class="filter-header">
                <input type="checkbox" />
                <h5 class="title">Types</h5>
            </div>

            <?php foreach ($types as $type): ?>
                <div class="filter-option">
                    <input type="checkbox" />
                    <span><?php echo $type->name; ?></span>
                </div>
            <?php endforeach; ?>

        </div>

        <div class="filter-items-column collections">

            <div class="filter-header">
                <input type="checkbox" />
                <h5 class="title">Collections</h5>
            </div>

            <?php foreach ($collections as $collection): ?>
                <div class="filter-option">
                    <input type="checkbox" />
                    <span><?php echo $collection->name; ?></span>
                </div>
            <?php endforeach; ?>

        </div>

    </div>

</div>
