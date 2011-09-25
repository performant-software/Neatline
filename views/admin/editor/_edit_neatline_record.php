<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Partial template for the Nealtine record edit form.
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

<div class="neatline-record-edit-form">

    <form>

        <fieldset>

            <div class="clearfix">
                <label for="title-<?php echo $item->id; ?>">Title</label>
                <div class="input">
                    <input class="xlarge" name="title-<?php echo $item->id; ?>" size="30" type="text" />
                    <span class="help-block">By default, the item's title in Neatline is the same as its Dublin Core title. Enter a new title here to override the default.</span>
                </div>
            </div>

            <div class="clearfix">
                <label for="map-description-<?php echo $item->id; ?>">Description</label>
                <div class="input">
                    <textarea class="xlarge" name="description-<?php echo $item->id; ?>" rows="3"></textarea>
                    <span class="help-block">This text will be displayed when the user selects on item's timeline entry.</span>
                </div>
            </div>

            <div class="clearfix">
                <label>Date range</label>
                <div class="input">
                    <div class="inline-inputs">
                        <input class="small" type="text" value="April 26, 1564">
                        <input class="mini" type="text" value="12:00am">
                        to
                        <input class="small" type="text" value="April 23, 1616">
                        <input class="mini" type="text" value="11:59pm">
                        <span class="help-inline">Enter the dates for the item on the timeline. If the item represents a span of time, specifiy the start and end date; if it represents a single point on the timeline, just enter a start date and leave the end date blank.</span>
                    </div>
                </div>
            </div>

        </fieldset>

    </form>

</div>
