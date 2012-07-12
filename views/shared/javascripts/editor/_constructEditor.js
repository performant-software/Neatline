/**
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


    // Get markup.
    var neatlineContainer =         $('#neatline');
    var editorContainer =           $('#item-browser');
    var configureLayoutButton =     $('#configure-layout-button');
    var configureMapButton =        $('#configure-map-button');
    var configureTimelineButton =   $('#configure-timeline-button');
    var configureItemsButton =      $('#configure-items-button');


    /*
     * =================
     * Item browser.
     * =================
     */


    editorContainer.itembrowser({

        'neatlineready': function() {

            /*
             * =================
             * Neatline.
             * =================
             */

            neatlineContainer.neatline({

                'isPublic': false,

                // When the user clicks on an item on the timeline.
                'timelineeventclick': function(event, obj) {

                    // Show the edit form.
                    editorContainer.itembrowser(
                        'showFormByRecordId',
                        obj.recordid,
                        true,
                        false,
                        true);

                },

                // When the user clicks on a feature on the map.
                'mapfeatureclick': function(event, obj) {

                    // Show the edit form.
                    editorContainer.itembrowser(
                        'showFormByRecordId',
                        obj.recordid,
                        false,
                        true,
                        true);

                },

                // When the user clicks on an item in the sequencing tray.
                'itemclick': function(event, obj) {

                    // Show the edit form.
                    editorContainer.itembrowser(
                        'showFormByRecordId',
                        obj.recordid,
                        true,
                        true,
                        obj.scrollItems);

                },

                // When a geometry vector is added to the map.
                'mapfeatureadded': function() {

                    // Make the item title red.
                    editorContainer.itembrowser('markItemTitleAsUnsaved');

                },

                // When the item tray is reloaded.
                'newitems': function() {

                    // Get the current edit item on the browser.
                    var editId = editorContainer.itembrowser('getCurrentEditId');

                    // If there is an active edit form.
                    if (editId) {
                        neatlineContainer.neatline('showItemDescription', editId);
                    }

                },

                // When the viewport dimensions are dragged.
                'widthdrag': function(event, obj) {
                    configureLayoutButton.configurelayout(
                        'setViewportProportions',
                        obj.h_percent,
                        obj.v_percent
                    );
                }

            });
            neatlineContainer.on({
                'drawingmodeon': function() {
                    var ec = editorContainer.data('itembrowser');
                    if (ec.editForm != null) {
                        ec.editForm.itemform('lockForm');
                    }
                },
                'drawingmodeoff': function() {
                    var ec = editorContainer.data('itembrowser');
                    if (ec.editForm != null) {
                        ec.editForm.itemform('unlockForm');
                    }
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
            neatlineContainer.neatline('endMapEditWithoutSave', obj.immediate);
        },

        // After an edit form save, reload viewport data.
        'savecomplete': function() {

            // Reload data for all blocks.
            neatlineContainer.neatline('reloadTimeline');
            neatlineContainer.neatline('reloadMap');
            neatlineContainer.neatline('reloadItems');

        },

        // When an item edit form is opened, focus the map and timeline
        // on the data corresponding to the item, if plotted data exists.
        'itemedit': function(event, obj) {

            if (obj.scrollMap) {
                // Focus the map.
                neatlineContainer.neatline('zoomMapToItemVectors', obj.recordid);
            }

            if (obj.scrollTimeline) {
                // Focus the timeline.
                neatlineContainer.neatline('zoomTimelineToEvent', obj.recordid);
            }

            if (obj.focusItems) {
                // Focus the items tray.
                neatlineContainer.neatline('showItemDescription', obj.recordid);
            }

        },

        // When the fill color picker value is changed, push the new color onto
        // the item's vectors.
        'vectorcoloredit': function(event, obj) {
            neatlineContainer.neatline('setItemVectorColor', obj.color, obj.recordid);
        },

        // When the stroke color picker value is changed, push the new color onto
        // the item's vectors.
        'strokecoloredit': function(event, obj) {
            neatlineContainer.neatline('setItemStrokeColor', obj.color);
        },

        // When the stroke color picker value is changed, push the new color onto
        // the item's vectors.
        'highlightcoloredit': function(event, obj) {
            neatlineContainer.neatline('setItemHighlightColor', obj.color);
        },

        // When the vector opacity dragger is changed, push the value onto the
        // item's vectors.
        'vectoropacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemVectorOpacity', obj.value);
        },

        // When the stroke opacity dragger is changed, push the value onto the
        // item's vectors.
        'strokeopacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemStrokeOpacity', obj.value);
        },

        // When the stroke opacity dragger is changed, push the value onto the
        // item's vectors.
        'graphicopacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemGraphicOpacity', obj.value);
        },

        // When the stroke width dragger is changed, push the value onto the
        // item's vectors.
        'strokewidthedit': function(event, obj) {
            neatlineContainer.neatline('setItemStrokeWidth', obj.value);
        },

        // When the point radius dragger is changed, push the value onto the
        // item's vectors.
        'pointradiusedit': function(event, obj) {
            neatlineContainer.neatline('setItemPointRadius', obj.value);
        },

        // When date ambiguity sliders are changed in an item edit form.
        'ambiguityChange': function(event, obj) {

            neatlineContainer.neatline(
                'setDateAmbiguity',
                obj.recordid,
                obj.color,
                obj.leftPercent,
                obj.rightPercent);

        },

        // When the fix item-specific map focus button is pressed, get
        // the map center and pass to the ajax interface in the form.
        'savemapfocus': function() {

            // Get the map extent and zoom.
            var mapCenter = neatlineContainer.neatline('getMapCenter');
            var mapZoom = neatlineContainer.neatline('getMapZoom');

            // Set.
            editorContainer.itembrowser('saveMapFocus', mapCenter, mapZoom);

        },

        // When the save button is clicked, get the coverage data.
        'saveform': function() {

            // Get the map extent and zoom.
            var coverage = neatlineContainer.neatline('getWktForSave');

            // Post the data.
            editorContainer.itembrowser('saveForm', coverage);

        }

    });


    /*
     * =================
     * Dropdown menus.
     * =================
     */


    // Configure layout.
    configureLayoutButton.configurelayout({

        // When the 'Fix starting viewport positions' button is pushed.
        'savepositions': function() {

            // Get the map extent, zoom, and layer.
            var mapCenter = neatlineContainer.neatline('getMapCenter');
            var mapZoom = neatlineContainer.neatline('getMapZoom');
            var mapLayer = neatlineContainer.neatline('getMapBaseLayer');

            // Get the timeline center date and zoom.
            var timelineCenter =    neatlineContainer.neatline('getTimelineCenter');
            var timelineZoom =      neatlineContainer.neatline('getTimelineZoom');

            // Save.
            configureLayoutButton.configurelayout(
                'savePositions',
                mapCenter,
                mapZoom,
                mapLayer,
                timelineCenter,
                timelineZoom
            );

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
        },

        // When the width of the viewports is dragged.
        'widthDrag': function(event, obj) {
            neatlineContainer.neatline(
                'applyViewportProportions',
                obj.h_percent,
                obj.v_percent
            );
        }

    });

    // Configure map.
    configureMapButton.configuremap({

        // Manifest new default vector fill color.
        'vectorcoloredit': function(event, obj) {
            neatlineContainer.neatline('setDefaultVectorColor', obj.color);
        },

        // Manifest new default stroke color.
        'strokecoloredit': function(event, obj) {
            neatlineContainer.neatline('setDefaultStrokeColor', obj.color);
        },

        // Manifest new default highlight color.
        'highlightcoloredit': function(event, obj) {
            neatlineContainer.neatline('setDefaultHighlightColor', obj.color);
        },

        // Manifest new default vector opacity.
        'vectoropacityedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultVectorOpacity', obj.value);
        },

        // Manifest new default stroke opacity.
        'strokeopacityedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultStrokeOpacity', obj.value);
        },

        // Manifest new default graphic opacity.
        'graphicopacityedit': function(event, obj) {
            neatlineContainer.neatline('setItemGraphicOpacity', obj.value);
        },

        // Manifest new default stroke width.
        'strokewidthedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultStrokeWidth', obj.value);
        },

        // Manifest new default point radius.
        'pointradiusedit': function(event, obj) {
            neatlineContainer.neatline('setDefaultPointRadius', obj.value);
        },

        // When new defaults have been successfully committed.
        'newdefaults': function(event, obj) {
            neatlineContainer.neatline('saveSuccess');
            editorContainer.itembrowser('reloadItemForm');
        }

    });

    // Configure timeline.
    configureTimelineButton.configuretimeline({

        // When new defaults have been successfully committed.
        'newdefaults': function(event, obj) {
            neatlineContainer.neatline('saveSuccess');
            neatlineContainer.neatline('renderTimelineDefaults', 
                obj.context_band_height,
                obj.context_band_unit,
                obj.is_context_band
            );
        }

    });

    // Configure items.
    configureItemsButton.configureitems({

        // Put the item try into reorder mode.
        'reorder': function() {
            neatlineContainer.neatline('reorderItems');
        },

        // Get ordering.
        'getorder': function() {
            var order = neatlineContainer.neatline('getOrder');
            configureItemsButton.configureitems('setOrder', order);
        },

        // End reordering session and set new order.
        'endreorder': function() {
            var order = neatlineContainer.neatline('endReorderItems');
            configureItemsButton.configureitems('setOrder', order);
        },

        // When a order save succeeds.
        'neworder': function(event, obj) {
            neatlineContainer.neatline('saveSuccess');
        }

    });

});
