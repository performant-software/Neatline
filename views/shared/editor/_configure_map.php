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

<table class="map-styles map-styles-defaults form-stacked">
    <tr>
        <td>
            <label><?php echo __('Shape Color'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="color-picker miniColors" name="default-vector-color" value="<?php echo $neatline->getStyle('vector_color'); ?>" />
                </div>
            </div>
        </td>
        <td>
            <label><?php echo __('Line Color'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="color-picker miniColors" name="default-stroke-color"  value="<?php echo $neatline->getStyle('stroke_color'); ?>" />
                </div>
            </div>
        </td>
        <td>
            <label><?php echo __('Selected Color'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="color-picker miniColors" name="default-highlight-color" value="<?php echo $neatline->getStyle('highlight_color'); ?>" />
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <label><?php echo __('Shape Opacity'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="integer-dragger" name="default-vector-opacity" value="<?php echo $neatline->getStyle('vector_opacity'); ?>" />
                </div>
            </div>
        </td>
        <td>
            <label><?php echo __('Selected Opacity'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="integer-dragger" name="default-select-opacity" value="<?php echo $neatline->getStyle('select_opacity'); ?>" />
                </div>
            </div>
        </td>
        <td>
            <label><?php echo __('Line Opacity'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="integer-dragger" name="default-stroke-opacity" value="<?php echo $neatline->getStyle('stroke_opacity'); ?>" />
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <label><?php echo __('Graphic Opacity'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="integer-dragger" name="default-graphic-opacity" value="<?php echo $neatline->getStyle('graphic_opacity'); ?>" />
                </div>
            </div>
        </td>
        <td>
            <label><?php echo __('Line Width'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="integer-dragger" name="default-stroke-width" value="<?php echo $neatline->getStyle('stroke_width'); ?>" />
                </div>
            </div>
        </td>
        <td>
            <label><?php echo __('Point Radius'); ?></label>
            <div class="input">
                <div class="inline-inputs">
                    <input type="text" class="integer-dragger" name="default-point-radius" value="<?php echo $neatline->getStyle('point_radius'); ?>" />
                </div>
            </div>
        </td>
    </tr>
</table>

<!-- Base layer picker. -->
<h5><?php echo __('Default Base Layer'); ?></h5>
<select name="base-layer">
    <?php foreach ($layers as $layer): ?>
    <option value="<?php echo $layer->id; ?>" <?php if ($neatline->getBaseLayer()->id == $layer->id) { echo 'selected="selected"'; } ?>>
        <?php echo $layer->name; ?>
    </option>
    <?php endforeach; ?>
</select>
<hr />

<button class="btn icon approve save"><?php echo __('Save'); ?></button>
