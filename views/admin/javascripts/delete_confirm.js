/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/*
 * Delete confirm widget for browse views. Gets called on the entire table.
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

(function($, undefined) {


    $.widget('neatline.deleteconfirm', {

        options: {

            // Classes for getters.
            classes: {
                title: 'title'
            },

            fade_duration: 200

        },

        _create: function() {

            // Get rows.
            this.rows = this.element.find('tbody tr');

            // Create the cover div.
            this._createCover();

            // Gloss.
            this._glossRows();

        },

        _createCover: function() {

            this.coverDiv = $('<div class="neatline-cover"></div>');
            $('body').prepend(this.coverDiv);

        },

        _glossRows: function() {

            var self = this;

            $.each(this.rows, function(index, row) {

                // Get DOM for row and delete button, title text.
                var row = $(row);
                var deleteButton = row.find('input[name="delete-neatline"]');
                var title = row.find('td.title a').html();

                deleteButton.bind({

                    'mousedown': function(event) {
                        event.preventDefault();
                        self._showConfirm();
                    },

                    // Just to override the default..
                    'click': function(event) {
                        event.preventDefault();
                    }

                });

            });

        },

        _showConfirm: function() {

            // Show the cover div.
            this.coverDiv.css('display', 'block');
            this.coverDiv.animate({
                'opacity': 0.4
            }, this.options.fade_duration);

            this._positionCover();

        },

        _positionCover: function() {

            var docX = $(document).width();
            var docY = $(document).height();

            this.coverDiv.css({
                'height': docY,
                'width': docX
            });

        }

    });


})( jQuery );


// Usage.
jQuery(document).ready(function($) {

    $('table.neatline').deleteconfirm();

});
