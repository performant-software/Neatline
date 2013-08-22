/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Detail bubbles.
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

(function($, undefined) {

    'use strict';

    $.widget('neatline.bubbles', {

        /*
         * Construct template.
         *
         * @return void.
         */
        _create: function() {

            // Getters.
            this._body = $('body');
            this._window = $(window);

            // Build template.
            this.template = _.template(
                $('#bubble-template').html()
            );

            // Trackers.
            this.bubble = null;
            this.title = null;
            this.body = null;
            this.frozen = false;
            this.onBubble = false;

        },

        /*
         * Show bubble.
         *
         * @param {String} title: The title.
         * @param {String} body: The body.
         *
         * @return void.
         */
        show: function(title, body) {

            // If bubble is frozen, break.
            if (this.frozen) return;

            // If both fields are empty, break.
            if (title == '' && body == '') return;

            // Store title and body.
            this.title = title;
            this.body = body;

            // If bubble exists, remove.
            if (!_.isNull(this.bubble)) {
                this.bubble.remove();
            }

            // Render template.
            this.bubble = $(this.template({
                title: title,
                body: body
            }));

            // Get components.
            this.freezeLink = this.bubble.find('a.freeze-bubble');
            this.closeLink = this.bubble.find('a.close-bubble');
            this.moreInfoDiv = this.bubble.find('div.click-for-info');
            this.titleDiv = this.bubble.find('div.title');
            this.bodyDiv = this.bubble.find('div.body');

            // If there is no body, hide click for more info.
            if (this.body === '') {
                this.moreInfoDiv.hide();
                this.bubble.addClass('no-body');
            }

            // Get native dimensions.
            this._measureBubble();

            // Inject, get styles.
            this.element.append(this.bubble);

            // Create referenced mousemove.
            this.onMouseMove = _.bind(this.position, this);

            // Listen for mousemove.
            this.options.openlayers.events.register(
                'mousemove', null, this.onMouseMove
            );

        },

        /*
         * Force hide the bubble.
         *
         * @return void.
         */
        close: function() {
            this._trigger('close');
            this.frozen = false;
            this.hide();
        },

        /*
         * Hide bubble.
         *
         * @return void.
         */
        hide: function() {

            // If bubble is frozen, break.
            if (this.frozen || _.isNull(this.bubble)) return;

            // Clear bubble.
            this.bubble.remove();
            this.bubble = null;

            // Strip mousemove listener.
            this.options.openlayers.events.unregister(
                'mousemove', null, this.onMouseMove
            );

        },

        /*
         * Freeze bubble.
         *
         * @return void.
         */
        freeze: function() {

            // If no bubble, break.
            if (_.isNull(this.bubble)) return;

            // Set frozen.
            this.bubble.addClass('frozen');
            this.frozen = true;

            // Get bubble opacity.
            this.opacity = this.bubble.css('opacity');

            // Get native dimensions, position.
            this._measureBubble();
            this.position(this.event);

            // Track cursor on bubble.
            this.bubble.bind({
                'mouseenter': _.bind(function() {
                    this.onBubble = true;
                }, this),
                'mouseleave': _.bind(function() {
                    this.onBubble = false;
                }, this)
            });

            // Strip mousemove listener.
            this.options.openlayers.events.unregister(
                'mousemove', null, this.onMouseMove
            );

            // Listen for close.
            this._window.bind('mousedown.bubbles', _.bind(function() {
                if (!this.onBubble) {
                    this.close();
                }
            }, this));

            // Listen for close link click.
            this.closeLink.mousedown(_.bind(function() {
                this.close();
            }, this));

        },

        /*
         * Position bubble.
         *
         * @param {Object} event: The mousemove event.
         *
         * @return void.
         */
        position: function(event) {

            // Store last event.
            this.event = event;

            // Get container size.
            var containerWidth = this.element.outerWidth();
            var containerHeight = this.element.outerHeight();

            // Get container offset, compensate for borders.
            var offset = this.element.offset();
            var borderTop = parseInt(this.element.css('border-top-width'), 10);
            var borderLeft = parseInt(this.element.css('border-left-width'), 10);
            offset.top += borderTop;
            offset.left += borderLeft;

            var containerX = event.clientX - offset.left;
            var containerY = event.clientY - offset.top + this._window.scrollTop();

            // If the cursor leaves the container, hide.
            if (event.clientX < offset.left ||
                event.clientX > offset.left + containerWidth ||
                event.clientY < offset.top ||
                event.clientY > offset.top + containerHeight) {
                  this._trigger('cursorleave');
                  this.hide();
                  return;
            }

            // Build starting bubble offsets.
            var bubbleY = containerY - (this.bubbleHeight/3);
            var bubbleX = containerX + 20;

            // If necessary, switch to left side.
            if (bubbleX + this.bubbleWidth > containerWidth) {
                bubbleX = containerX - this.bubbleWidth - 20;
            }

            // Block top cropping.
            if (bubbleY < 0) {
                bubbleY = 0;
            }

            // Block bottom cropping.
            if (bubbleY + this.bubbleHeight > containerHeight) {
                bubbleY = containerHeight-this.bubbleHeight;
            }

            // Catch full-height.
            if (this.bubbleHeight > containerHeight) {
                bubbleY = 0;
                this.bubbleHeight = containerHeight;
                this.bubble.css('overflow-y', 'scroll');
                this.bubble.outerHeight(this.bubbleHeight);
            }

            // Render position.
            this.bubble.css({
                left: bubbleX,
                top: bubbleY
            });

        },

        /*
         * Compute the native dimensions of the bubble.
         *
         * @return void.
         */
        _measureBubble: function() {

            // Clone and append the bubble.
            var clone = this.bubble.clone().css({
                top: -1000,
                left: -1000
            }).appendTo(this._body);

            // Get dimensions.
            this.bubbleHeight = clone.outerHeight();
            this.bubbleWidth = clone.outerWidth();

            // Remove clone.
            clone.remove();

        },

        /*
         * Get the current title of the bubble.
         *
         * @return string.
         */
        getTitle: function() {
            return this.title;
        },

        /*
         * Is this bubble frozen?
         *
         * @return bool.
         */
        isFrozen: function() {
            return this.frozen;
        }

    });


})(jQuery);
