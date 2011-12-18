/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * Given a set of layout parameters, this class computes the positions for the
 * Neatline blocks inside of the container. Used by the layout builder in the
 * editor and by the main application code that constructs the exhibit at runtime.
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

(function($, undefined) {


    $.widget('neatline.positioner', {

        options: {

        },

        /*
         * Shell out local trackers for parameters.
         */
        _create: function() {

            // Trackers for positioning parameters.
            this._is_map =              false;
            this._is_timeline =         false;
            this._is_items =            false;
            this._items_h =             'right'; // 'right' or 'left'.
            this._items_v =             'full';  // 'full' or 'partial'.

        },

        /*
         * Given a fresh parameter loadout, recompute the positions.
         */
        compute: function() {



        },

        /*
         * Apply computer positions to the markup.
         */
        apply: function() {



        },

    });


})( jQuery );
