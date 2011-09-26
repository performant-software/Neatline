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

    <form class="form-stacked">

        <fieldset>

            <div class="clearfix">
                <label for="title">Title</label>
                <div class="input">
                    <input class="xlarge" name="title" size="30" type="text" />
                    <span class="help-block">By default, the item's title in Neatline is the same as its Dublin Core title. Enter a new title here to override the default.</span>
                </div>
            </div>

            <div class="clearfix">
                <label for="map-description">Description</label>
                <div class="input">
                    <textarea class="xlarge" name="description" rows="3"></textarea>
                    <span class="help-block">This text will be displayed when the user selects on item's timeline entry.</span>
                </div>
            </div>

            <div class="clearfix">
                <label>Start Date</label>
                <div class="input">
                    <div class="inline-inputs">
                        <input class="medium" name="start-date-day-month" type="text">
                        <input class="mini" name="start-date-year" type="text">
                        <span class="help-inline">Enter the date of the item, or its starting date if it occupies a time interval.</span>
                    </div>
                </div>
            </div>

            <div class="clearfix">
                <label>End Date</label>
                <div class="input">
                    <div class="inline-inputs">
                        <input class="medium" name="end-date-day-month" type="text">
                        <input class="mini" name="end-date-year" type="text">
                        <span class="help-inline">Enter the ending date. Leave blank if the item does not occupy a time interval.</span>
                    </div>
                </div>
            </div>

            <div class="actions">
                <input type="submit" class="btn primary" value="Save">&nbsp;<button type="reset" class="btn">Cancel</button>
            </div>

        </fieldset>

    </form>

    <div class="form-save-cover"></div>

</div>
