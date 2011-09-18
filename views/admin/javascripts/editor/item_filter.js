/*
 * Item filter dropdown in the Neatline editor.
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


    $.widget('neatline.itemfilter', {

        options: {

            // // Markup hooks.
            // topbar_id: 'topbar',
            // search_wrapper_id: 'search-wrapper',
            // search_box_id: 'search-box',
            // search_cancel_id: 'search-cancel',
            // items_list_container_id: 'items-list-container',
            // items_list_header_id: 'items-list-header',

            // // Durations and CSS constants.
            // item_list_highlight_duration: 10,
            // drag_handle_width: 4,
            // drag_tooltip_Y_offset: 16,
            // drag_tooltip_X_offset: 15,

            // // Hexes.
            // colors: {
            //     item_list_highlight: '#f2f3fa',
            //     drag_border: '#a79aae'
            // }

        },

        _create: function() {

            // Getters.
            this._window = $(window);
            this._body = $('body');
            // this.topBar = $('#' + this.options.topbar_id);
            // this.searchWrapper = $('#' + this.options.search_wrapper_id);
            // this.searchBox = $('#' + this.options.search_box_id);
            // this.itemsList = $('#' + this.options.items_list_container_id);
            // this.itemsListHeader = $('#' + this.options.items_list_header_id);
            // this.searchCancel = $('#' + this.options.search_cancel_id);

            // // Disable text selection on the document. This is aggressive
            // // and controversial, but it solves lots of annoyances.
            // this._disableSelect();

            // // Get the os scrollbar width.
            // this.__getScrollBarWidth();

            // // Position the container, add window resize listener.
            // this._positionDivs();
            // this._addWindowResizeListener();

            // // Construct the drag handle on the items stack.
            // this._buildDragHandle();

            // // Set starting filtering parameters.
            // this._searchString = '';
            // this._tagFilter = null;
            // this._collectionFilter = null;

            // // Add listener to the search box and instantiate the input
            // // canceller.
            // this._glossSearchBox();

            // // Fire starting ajax request.
            // this._getItems();

        }

    });


})( jQuery );
