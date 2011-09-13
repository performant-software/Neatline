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

            // Misc.
            fade_duration: 150

        },

        _create: function() {

            // Get rows and confirm markup.
            this.rows = this.element.find('tbody tr');
            this.coverDiv = $('#neatline-cover');
            this.transparencyDiv = this.coverDiv.find('.transparency');
            this.confirmDiv = $('#neatline-delete-confirm');

            // Gloss.
            this._glossRows();

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
                        self._doConfirm();
                    },

                    // Just to override the default..
                    'click': function(event) {
                        event.preventDefault();
                    }

                });

            });

        },

        _doConfirm: function() {

            var self = this;

            // Show and position the cover div.
            this.coverDiv.css('display', 'block');
            this._positionCover();

            // Tween the opacity up.
            this.transparencyDiv.animate({
                'opacity': 0.4
            }, this.options.fade_duration);

            // Show the box.
            this._showConfirmBox();

            // Add the resize event to the window.
            $(window).bind('resize', function() {
                self._positionCover();
            });

        },

        _showConfirmBox: function() {



        },

        _positionCover: function() {

            var docX = $(document).width();
            var docY = $(document).height();
            var winY = $(window).height();

            var confirmY = this.confirmDiv.height();
            var confirmTopOffset = (winY - confirmY) / 2;

            this.coverDiv.css({
                'height': docY,
                'width': docX
            });

            this.confirmDiv.css('top', confirmTopOffset);

        }

    });


})( jQuery );


// Usage.
jQuery(document).ready(function($) {

    $('table.neatline').deleteconfirm();

});
