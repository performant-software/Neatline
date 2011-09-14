/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * Row glossing effects for browse views.
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


    $.widget('neatline.rowglosser', {

        options: {

            colors: {
                default: '#fff',
                gloss: '#f7f3f9'
            },

            fade_duration: 10

        },

        _create: function() {

            // Get rows.
            this.rows = this.element.find('tbody tr');

            // Gloss.
            this._glossRows();

        },

        _glossRows: function() {

            var self = this;

            $.each(this.rows, function(i, row) {

                $(row).bind({

                    'mouseenter': function() {
                        $(row).animate({
                            'background-color': self.options.colors.gloss
                        }, self.options.fade_duration);
                    },

                    'mouseleave': function() {
                        $(row).animate({
                            'background-color': self.options.colors.default
                        }, self.options.fade_duration);
                    }

                });

            });

        }

    });


})( jQuery );


// Usage.
jQuery(document).ready(function($) {

    $('table.neatline').rowglosser();

});

