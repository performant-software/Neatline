<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Markup for the timeline options dropdown.
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

<!-- Toggle context band. -->
<input type="checkbox" name="band-active" <?php if ($exhibit->is_context_band === 1) { echo 'checked="checked"'; } ?>/>
<h5 class="inline">Enable Context Band</h5>
<hr />

<!-- Context band unit. -->
<h5>Context Band Unit</h5>
<select name="band-unit">
  <?php $unit = $exhibit->getStyle('context_band_unit'); ?>
  <option value="hour" <?php if ($unit == 'hour') { echo 'selected'; } ?>>Hour</option>
  <option value="day" <?php if ($unit == 'day') { echo 'selected'; } ?>>Day</option>
  <option value="week" <?php if ($unit == 'week') { echo 'selected'; } ?>>Week</option>
  <option value="month" <?php if ($unit == 'month') { echo 'selected'; } ?>>Month</option>
  <option value="year" <?php if ($unit == 'year') { echo 'selected'; } ?>>Year</option>
  <option value="decade" <?php if ($unit == 'decade') { echo 'selected'; } ?>>Decade</option>
  <option value="century" <?php if ($unit == 'century') { echo 'selected'; } ?>>Century</option>
</select>
<hr />

<!-- Context band height percentage. -->
<h5>Context Band Height %</h5>
<input type="text" class="integer-dragger" name="band-height" value="<?php echo $exhibit->getStyle('context_band_height'); ?>" />
<hr />

<button class="btn icon approve save">Save</button>
