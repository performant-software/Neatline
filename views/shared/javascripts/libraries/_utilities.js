/*
 * Miscellaneous JavaScript workers.
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

// remove() - Removes all instances of element el from an array.
// Emulates Python's set.remove().
Array.prototype.remove = function(el) {

    for (var i = 0; i < this.length; i++) {
        if (this[i] == el) {
            this.splice(i,1);
            this.remove(el);
            break;
        }
    }

};

// contains() - Checks to see if the supplied element is in the array.
Array.prototype.contains = function(el) {

    var match = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == el) {
            match = true;
        }
    }

    return match;

};

// disableSelect() - Nukes default browser text selection.
var NeatlineHelpers = {

    'disableSelect': function() {

        var _window = $(window);

        $(window).css('MozUserSelect', 'none');
        $(window).bind('selectstart', function() {
            return false;
        });

    }

}
