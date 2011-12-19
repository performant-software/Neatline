<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Markup base for the layout builder block.
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

<div id="options">
    <span id="toggle-map">Map</span>
    <span id="toggle-timeline">Timeline</span>
    <span id="toggle-items">Items</span>
</div>

<div id="drag-box"></div>

<button id="save-arrangement" class="btn icon approve save">Save arrangement</button>
<button id="fix-positions" class="btn icon pin save">Fix starting viewport positions</button>

<hr />

<p>Use the toggle buttons to activate and deactivate blocks; drag the
blocks to rearrange them. Click the "Fix starting viewport positions" button
to store the current viewport settings as the public defaults.</p>
