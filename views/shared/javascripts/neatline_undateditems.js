/*
 * Component widget that controls the undated items block. Instantiated by the
 * parent Neatline widget.
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


    $.widget('neatline.neatlineundateditems', {

        options: {

            // Markup hooks.
            markup: {
                list_container_id: 'undated-items-list-container'
            },

            // Hexes.
            colors: {

            }

        },

        /*
         * Getters and starting get items call.
         */
        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');
            this.listContainer = $('#' + this.options.markup.list_container_id);
            this.params = Neatline;

            // Build list.
            this._getItems();

        },

        /*
         * Request item markup and gloss the results.
         */
        loadData: function() {

            // Build list.
            this._getItems();

        },

        /*
         * Populate content.
         */
        _getItems: function() {

            var self = this;

            // Core ajax call to get items.
            $.ajax({

                url: this.params.dataSources.undated,
                dataType: 'html',

                success: function(data) {
                    self.listContainer.html(data);
                }

            });

        }

    });


})( jQuery );
