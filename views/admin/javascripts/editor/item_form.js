/*
 * Manager class for the dropdown item edit forms in the Neatline editor.
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


    $.widget('neatline.itemform', {

        options: {

            // CSS constants.
            css: {

            },

            // Hexes.
            colors: {
                light_blue: '#f3f6ff',
                light_yellow: '#fffef8',
                dark_purple: '#4f1d6a',
                purple: '#724e85',
                text: '#515151',
                gray: '#8d8d8d',
                red: '#ca3c3c',
                orange: '#ffda82'
            }

        }

    });

})( jQuery );
