/**
 * Timeline dropdown menu.
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


    $.widget('neatline.configuretimeline', {

        /*
         * Get and prepare markup, run start-up routine.
         *
         * - return void.
         */
        _create: function() {

            // Construct the dropdown manager and form widgets.
            this._constructDropdown();
            this._constructFormWidgets();

        },

        /*
         * Instantiate the dropdown manager widget, define callbacks.
         *
         * - return void.
         */
        _constructDropdown: function() {
            this.element.dropdown();
        },

        /*
         * .
         *
         * - return void.
         */
        _constructFormWidgets: function() {

        }

    });

})( jQuery );
