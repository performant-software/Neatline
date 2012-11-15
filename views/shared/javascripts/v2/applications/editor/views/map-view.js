/**
 * Monkey patches to Neatline map view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/*
 * .
 *
 * @return void.
 */
Neatline.Views.Map.prototype.test = function() {
  console.log(this.map);
};
