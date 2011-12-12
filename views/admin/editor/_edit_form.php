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

<div id="edit-form" class="neatline-record-edit-form">

    <form class="form-stacked">

        <fieldset>

            <div class="clearfix">
                <label for="title">Title</label>
                <div class="input">
                    <input class="xlarge" name="title" size="30" placeholder="Title" type="text" />
                    <span class="help-block">The text displayed as the item's icon on the timeline.</span>
                </div>
            </div>

            <div class="clearfix">
                <label for="map-description">Description</label>
                <div class="input">
                    <textarea class="xlarge" name="description" placeholder="Description" rows="4"></textarea>
                    <span class="help-block">Descriptive text associated with the item's timeline entry.</span>
                </div>
            </div>

            <div class="clearfix">
                <label>Start Date</label>
                <div class="input">
                    <div class="inline-inputs">
                        <input class="medium" name="start-date-date" type="text" placeholder="Date" />
                        <input class="mini" name="start-date-time" type="text" placeholder="Time" />
                        <span class="help-inline">Enter the date (or start date) of the item.</span>
                    </div>
                </div>
            </div>

            <div class="clearfix">
                <label>End Date</label>
                <div class="input">
                    <div class="inline-inputs">
                        <input class="medium" name="end-date-date" type="text" placeholder="Date" />
                        <input class="mini" name="end-date-time" type="text" placeholder="Time" />
                        <span class="help-inline">Enter an ending date, if applicable.</span>
                    </div>
                </div>
            </div>

            <div class="clearfix">
                <label>Date Ambiguity</label>
                <div class="input">
                    <div class="inline-inputs">
                        <div class="date-ambiguity-container">
                            <div class="date-ambiguity-editor">
                                <div class="stop-marker left"><div class="color-swatch"></div></div>
                                <div class="stop-marker right"><div class="color-swatch"></div></div>
                            </div>
                            <input name="left-ambiguity-percentage" type="hidden" />
                            <input name="right-ambiguity-percentage" type="hidden" />
                        </div>
                        <span class="help-inline">Drag the beginning and ending sliders inward to capture
                            uncertainty over the date interval.</span>
                    </div>
                </div>
            </div>

            <div class="clearfix">
                <label>Vector Color</label>
                <input type="text" id="color" class="color-picker" name="color" />
                <span class="help-inline">Select a color for the item's spatial vectors.</span>
            </div>

            <div class="clearfix">
                <button class="btn icon home">Fix Item-Specific Map Focus</button>
                <span class="help-inline">Click here to set a custom map focus for the item.</span>
            </div>

            <div class="actions">
                <input type="submit" class="btn primary" value="Save">
                <button type="reset" class="btn">Close</button>
            </div>

        </fieldset>

    </form>

</div>
