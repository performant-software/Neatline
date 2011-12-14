/*
 * Widget instantiations for the Neatline editor.
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

jQuery(document).ready(function($) {

    var neatlineContainer = $('.neatline-container');
    var editorContainer = $('#item-browser');
    var layoutBuilderContainer = $('#configure-layout');

    // Editor instantiation.
    editorContainer.itembrowser({

        'neatlineready': function() {

            neatlineContainer.neatline({

                // When the user clicks on an item on the timeline.
                'timelineeventclick': function(event, obj) {

                    // Show the edit form.
                    editorContainer.itembrowser('showFormByItemId', obj.itemId, true, false, true);

                },

                // When the user clicks on a feature on the map.
                'mapfeatureclick': function(event, obj) {

                    // Show the edit form.
                    editorContainer.itembrowser('showFormByItemId', obj.itemId, false, true, true);

                },

                // When the user clicks on an item in the sequencing tray.
                'undateditemclick': function(event, obj) {

                    // Show the edit form.
                    editorContainer.itembrowser('showFormByItemId', obj.itemId, true, true, obj.scrollItems);

                },

                // When a geometry vector is added to the map.
                'mapfeatureadded': function() {

                    // Make the item title red.
                    editorContainer.itembrowser('markItemTitleAsUnsaved');

                }

            });

        },

        // When the window has been reisized and the Neatline blocks
        // need to be repositioned.
        'reposition': function() {
            neatlineContainer.neatline('positionDivs');
            neatlineContainer.neatline('positionBlockMarkup');
        },

        // When an item form is opened and the item's vector becomes
        // available for editing.
        'mapedit': function(event, obj) {

            neatlineContainer.neatline('editMap', obj.item, obj.immediate);

        },

        // When vector data is added to the map, and then the item
        // form is closed without saving.
        'endmapedit': function(event, obj) {
            neatlineContainer.neatline('endMapEditWithoutSave', obj.itemId, obj.immediate);
        },

        // After an edit form save, when the JSON for the map and
        // timeline needs to be reloaded.
        'savecomplete': function() {

            // Reload data for all blocks.
            neatlineContainer.neatline('reloadTimeline');
            neatlineContainer.neatline('reloadMap');
            neatlineContainer.neatline('reloadUndatedItems');

        },

        // When an item edit form is opened, focus the map and timeline
        // on the data corresponding to the item, if plotted data exists.
        'itemedit': function(event, obj) {

            if (obj.scrollMap) {
                // Focus the map.
                neatlineContainer.neatline('zoomMapToItemVectors', obj.itemId);
            }

            if (obj.scrollTimeline) {
                // Focus the timeline.
                neatlineContainer.neatline('zoomTimelineToEvent', obj.itemId);
            }

            if (obj.focusItems) {
                // Focus the items tray.
                neatlineContainer.neatline('showItemDescription', obj.itemId);
            }

        },

        // When the color picker value is changed, push the new color onto
        // the item's vectors.
        'coloredit': function(event, obj) {

            neatlineContainer.neatline('setItemColor', obj.color, obj.itemId);

        },

        // When date ambiguity sliders are changed in an item edit form.
        'ambiguityChange': function(event, obj) {

            neatlineContainer.neatline('setDateAmbiguity', obj.recordid, obj.color, obj.leftPercent, obj.rightPercent);

        },

        // When the fix item-specific map focus button is pressed, get
        // the map bounds and pass to the ajax interface in the form.
        'savemapfocus': function() {

            // Get the map extent and zoom.
            var mapExtent = neatlineContainer.neatline('getMapExtent');
            var mapZoom = neatlineContainer.neatline('getMapZoom');

            // Set.
            editorContainer.itembrowser('saveMapFocus', mapExtent, mapZoom);

        },

        // When the save button is clicked, get the coverage data.
        'saveform': function() {

            // Get the map extent and zoom.
            var coverage = neatlineContainer.neatline('getWktForSave');

            // Post the data.
            editorContainer.itembrowser('saveForm', coverage);

        }

    });

    // Layout builder instantiation.
    layoutBuilderContainer.configurelayout({

        // When the 'Fix starting viewport positions' button is pushed.
        'savepositions': function() {

            // Get the map extent and zoom.
            var mapExtent = neatlineContainer.neatline('getMapExtent');
            var mapZoom = neatlineContainer.neatline('getMapZoom');

            // Get the timeline center date.
            var timelineCenter = neatlineContainer.neatline('getTimelineCenter');

            // Save.
            layoutBuilderContainer.configurelayout('savePositions', mapExtent, mapZoom, timelineCenter);

        },

        // When a new arrangement is saved and NL blocks need to be repositioned
        // to manifest the change.
        'newarrangement': function(event, obj) {

            // Reset the core attributes object and reposition.
            neatlineContainer.neatline('setParams', obj.params);
            neatlineContainer.neatline('positionDivs');
            neatlineContainer.neatline('positionBlockMarkup');
            neatlineContainer.neatline('instantiateBlocks');
            neatlineContainer.neatline('saveSuccess');

        },

        // When new starting positions are fixed, do success flash.
        'newpositions': function() {
            neatlineContainer.neatline('saveSuccess');
        }

    });

});
