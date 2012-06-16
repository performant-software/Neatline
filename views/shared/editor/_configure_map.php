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
<input type="text" class="color-picker miniColors" name="default-vector-color" value="<?php echo $neatline->getStyle('vector_color'); ?>" />
<hr />

<!-- Stroke color. -->
<h5>Default Line Color</h5>
<input type="text" class="color-picker miniColors" name="default-stroke-color" value="<?php echo $neatline->getStyle('stroke_color'); ?>" />
<hr />

<!-- Highlight color. -->
<h5>Default Highlight Color</h5>
<input type="text" class="color-picker miniColors" name="default-highlight-color" value="<?php echo $neatline->getStyle('highlight_color'); ?>" />
<hr />

<!-- Vector opacity. -->
<h5>Default Shape Opacity</h5>
<input type="text" class="integer-dragger" name="default-vector-opacity" value="<?php echo $neatline->getStyle('vector_opacity'); ?>" />
<hr />

<!-- Select opacity. -->
<h5>Default Select Opacity</h5>
<input type="text" class="integer-dragger" name="default-select-opacity" value="<?php echo $neatline->getStyle('select_opacity'); ?>" />
<hr />

<!-- Stroke opacity. -->
<h5>Default Line Opacity</h5>
<input type="text" class="integer-dragger" name="default-stroke-opacity" value="<?php echo $neatline->getStyle('stroke_opacity'); ?>" />
<hr />

<!-- Graphic opacity. -->
<h5>Default Graphic Opacity</h5>
<input type="text" class="integer-dragger" name="default-graphic-opacity" value="<?php echo $neatline->getStyle('graphic_opacity'); ?>" />
<hr />

<!-- Stroke width. -->
<h5>Default Line Thickness</h5>
<input type="text" class="integer-dragger" name="default-stroke-width" value="<?php echo $neatline->getStyle('stroke_width'); ?>" />
<hr />

<!-- Point radius. -->
<h5>Default Point Radius</h5>
<input type="text" class="integer-dragger" name="default-point-radius" value="<?php echo $neatline->getStyle('point_radius'); ?>" />
<hr />

<!-- Base layer picker. -->
<h5>Default Base Layer</h5>
<select name="base-layer">
    <?php foreach ($layers as $layer): ?>
    <option value="<?php echo $layer->id; ?>" <?php if ($neatline->getBaseLayer()->id == $layer->id) { echo 'selected="selected"'; } ?>>
        <?php echo $layer->name; ?>
    </option>
    <?php endforeach; ?>
</select>
<hr />

<button class="btn icon approve save">Save</button>
