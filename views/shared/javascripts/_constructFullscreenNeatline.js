/**
 * Application runner for public-facing Neatline exhibits.
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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

jQuery(document).ready(function($) {


    // Disable Simile history.
    SimileAjax.History.enabled = false;

    // Get markup.
    var neatlineContainer = $('.neatline-container');


    /*
     * =================
     * Positioner.
     * =================
     */

    neatlineContainer.fullscreenpositioner({

        'resize': function() {
            neatlineContainer.neatline('positionDivs');
        }

    });


    /*
     * =================
     * Neatline.
     * =================
     */


    neatlineContainer.neatline({

        // When the user clicks on an item on the timeline.
        'timelineeventclick': function(event, obj) {

            // Focus the map.
            neatlineContainer.neatline('zoomMapToItemVectors', obj.recordid);

            // Focus the items tray.
            neatlineContainer.neatline('showItemDescription', obj.recordid);

        },

        // When the user clicks on a feature on the map.
        'mapfeatureclick': function(event, obj) {

            // Focus the timeline.
            neatlineContainer.neatline('zoomTimelineToEvent', obj.recordid);

            // Focus the items tray.
            neatlineContainer.neatline('showItemDescription', obj.recordid);

        },

        // When the user clicks on an item in the items tray.
        'itemclick': function(event, obj) {

            // Focus the map.
            neatlineContainer.neatline('zoomMapToItemVectors', obj.recordid);

            // Focus the timeline.
            neatlineContainer.neatline('zoomTimelineToEvent', obj.recordid);

            // Focus the items tray.
            neatlineContainer.neatline('showItemDescription', obj.recordid);

        }

    });

});
