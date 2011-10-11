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

    var neatlineContainer = $('#neatline-editor');
    var editorContainer = $('#item-browser');

    editorContainer.itemeditor({

        'neatlineready': function() {

            neatlineContainer.neatline({

                // When the user clicks on an item on the timeline.
                'timelineeventclick': function(event, obj) {

                    // Show the edit form.
                    editorContainer.itemeditor('showFormByItemId', obj.itemId, true, false);

                    // Focus the map.
                    neatlineContainer.neatline('zoomMapToItemVectors', obj.itemId);

                },

                // When a geometry vector is added to the map.
                'mapfeatureadded': function() {

                    editorContainer.itemeditor('markItemTitleAsUnsaved');

                }

            });

        },

        // When the window has been reisized and the Neatline blocks
        // need to be repositioned.
        'reposition': function() {
            neatlineContainer.neatline('positionDivs');
        },

        // When an item form is opened and the item's vector becomes
        // available for editing.
        'mapedit': function(event, obj) {
            neatlineContainer.neatline('editMap', obj.item);
        },

        // When vector data is added to the map, and then the item
        // form is closed without saving.
        'endmapedit': function(event, obj) {
            neatlineContainer.neatline('endMapEditWithoutSave', obj.itemId);
        },

        // When an item form is saved, and new vector data needs to
        // be fethed and posted back to the server.
        'savemapedit': function() {

            // Fetch the coverage data from the map, push back into
            // the item editor.
            var wkts = neatlineContainer.neatline('getWktForSave');
            editorContainer.itemeditor('setCoverageData', wkts);

        },

        // After an edit form save, when the JSON for the map and
        // timeline needs to be reloaded.
        'savecomplete': function() {

            // Reload data for all blocks.
            neatlineContainer.neatline('reloadTimeline');
            neatlineContainer.neatline('reloadMap');

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

        }

    });

});
