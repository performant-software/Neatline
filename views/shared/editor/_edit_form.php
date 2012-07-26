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

        <ul class="tabs-header">
            <li><a href="#tabs-1" class="btn">Text</a></li>
            <li><a href="#tabs-2" class="btn">Spatial</a></li>
            <li><a href="#tabs-3" class="btn">Temporal</a></li>
            <li><a href="#tabs-4" class="btn">Styling</a></li>
            <li><a href="#tabs-5" class="btn">Relations</a></li>
        </ul>

        <div id="tabs-1">

            <div class="control-group">
                <label for="title">Title</label>
                <div class="controls">
                    <textarea id="item-title" class="xlarge" name="title" placeholder="Title" rows="1"></textarea>
                </div>
            </div>

            <div class="control-group">
                <label for="description">Description</label>
                <div class="controls">
                    <textarea id="item-description" class="xlarge" name="description" placeholder="Description" rows="4"></textarea>
                </div>
            </div>

            <div class="clearfix checkbox">
                <label>
                    <input type="checkbox" name="show-bubble">
                    <span>Show pop-up bubble.</span>
                </label>
                <label>
                    <input type="checkbox" name="use-dc-data">
                    <span>Use default item metadata.</span>
                </label>
            </div>

        </div>

        <div id="tabs-2">

            <div class="control-group">
                <label>Geocoverage</label>
                <div class="controls">
                    <textarea class="xlarge" name="geocoverage" rows="16"></textarea>
                </div>
            </div>

        </div>

        <div id="tabs-3">

            <div class="control-group">
                <label>Start Date</label>
                <div class="controls">
                    <div class="inline-inputs">
                        <input class="xlarge" name="start-date-date" type="text" placeholder="Start Date" />
                    </div>
                </div>
            </div>

            <div class="control-group">
                <label>End Date</label>
                <div class="controls">
                    <div class="inline-inputs">
                        <input class="xlarge" name="end-date-date" type="text" placeholder="End Date" />
                    </div>
                </div>
            </div>

            <div class="control-group">
                <label>Start Visible Date</label>
                <div class="controls">
                    <div class="inline-inputs">
                        <input class="xlarge" name="start-visible-date" type="text" placeholder="Start Date" />
                    </div>
                </div>
            </div>

            <div class="control-group">
                <label>End Visible Date</label>
                <div class="controls">
                    <div class="inline-inputs">
                        <input class="xlarge" name="end-visible-date" type="text" placeholder="End Date" />
                    </div>
                </div>
            </div>

            <div class="control-group">
                <label>Date Ambiguity</label>
                <div class="controls">
                    <div class="inline-inputs">
                        <div class="date-ambiguity-container">
                            <div class="date-ambiguity-editor">
                                <div class="stop-marker left"><div class="color-swatch"></div></div>
                                <div class="stop-marker right"><div class="color-swatch"></div></div>
                            </div>
                            <input name="left-ambiguity-percentage" type="hidden" />
                            <input name="right-ambiguity-percentage" type="hidden" />
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div id="tabs-4">

            <table class="map-styles">
                <tr>
                    <td>
                        <label>Shape Color</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="color-picker" name="vector-color" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <label>Line Color</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="color-picker" name="stroke-color" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <label>Selected Color</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="color-picker" name="highlight-color" />
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Shape Opacity</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="integer-dragger" name="vector-opacity" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <label>Selected Opacity</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="integer-dragger" name="select-opacity" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <label>Line Opacity</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="integer-dragger" name="stroke-opacity" />
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Graphic Opacity</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="integer-dragger" name="graphic-opacity" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <label>Line Width</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="integer-dragger" name="stroke-width" />
                            </div>
                        </div>
                    </td>
                    <td>
                        <label>Point Radius</label>
                        <div class="controls">
                            <div class="inline-inputs">
                                <input type="text" class="integer-dragger" name="point-radius" />
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="control-group">
                <label>Point Graphic</label>
                <div class="controls">
                    <div class="inline-inputs">
                        <input class="xlarge" name="point-image" type="text" placeholder="An external graphic to represent a point" />
                    </div>
                </div>
            </div>

            <table class="map-styles map-buttons">
                <tr>
                    <td>
                        <div class="controls">
                            <div class="inline-inputs">
                                <button class="btn icon undo reset-styles">Reset Item Styles</button>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="controls">
                            <div class="inline-inputs">
                                <button class="btn icon home map-focus">Set Map Focus</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

        </div>

        <div id="tabs-5">

            <div class="control-group">
                <label>Parent Record</label>
                <div class="controls">
                    <div class="inline-inputs">
                        <select name="parent-record">
                        </select>
                    </div>
                </div>
            </div>

        </div>

        <div class="fieldset">

            <div id="edit-form-actions" class="form-actions">
                <button id="record-save-button" class="btn btn-large btn-neatline"><i class="icon-ok-circle icon-white"></i> Save</button>
                <button id="record-close-button" class="btn btn-large"><i class="icon-download"></i> Close</button>
                <button id="record-delete-button" class="btn btn-large btn-neatline-delete"><i class="icon-remove-circle icon-white"></i> Delete</button>
            </div>

        </div>

    </form>

</div>
