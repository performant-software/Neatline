<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Markup for the map options dropdown.
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

<!-- Vector color. -->
<h5>Default Shape Color</h5>
<input type="text" class="color-picker miniColors" name="default-vector-color" />
<hr />

<!-- Stroke color. -->
<h5>Default Line Color</h5>
<input type="text" class="color-picker miniColors" name="default-stroke-color" />
<hr />

<!-- Vector opacity. -->
<h5>Default Shape Opacity</h5>
<input type="text" class="integer-dragger" name="default-vector-opacity" />
<hr />

<!-- Stroke opacity. -->
<h5>Default Line Opacity</h5>
<input type="text" class="integer-dragger" name="default-stroke-opacity" />
<hr />

<!-- Stroke width. -->
<h5>Default Line Thickness</h5>
<input type="text" class="integer-dragger" name="default-stroke-width" />
<hr />

<!-- Point radius. -->
<h5>Default Point Radius</h5>
<input type="text" class="integer-dragger" name="default-point-radius" />
<hr />

<!-- Base layer picker. -->
<h5>Base Layer</h5>
<select name="base-layer">
    <option>[none]</option>
    <option>OpenStreetMap</option>
</select>
<hr />

<button class="btn icon approve save">Save</button>
