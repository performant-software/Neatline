<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * The core Neatline editor. Wraps the markup for the editing interface and then
 * calls the map/timeline/udi markup as a partial.
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

<div id="topbar" class="topbar-inner topbar">

    <img id="neatline-logo" src="<?php echo img('neatline-logo-white-small.png'); ?>" />

</div>

<div id="item-browser">

    <div id="items-list-header">

        <input type="text" placeholder="Search items" id="search-box" />
        <span id="search-cancel">x</span>

        <ul class="tabs filter-items">
            <li id="filter-items-tab" class="drop-down">
                <a href="#" class="dropdown-toggle">Filter Items</a>
            </li>

            <?php echo $this->partial('editor/_filter_items.php', array(
                'tags' => $tags,
                'collections' => $collections,
                'types' => $types
            )); ?>

        </ul>

    <div id="columns">
        <div class="col-1 col-cell"><span class="header">S</span></div>
        <div class="col-2 col-cell"><span class="header">T</span></div>
        <div class="col-3 col-cell"><span class="header">U</span></div>
    </div>

    </div>

    <div id="items-list-container"></div>

</div>
