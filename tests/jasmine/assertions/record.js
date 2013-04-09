
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record assertions.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var _t = (function(_t) {


  /**
   * Assert the active record form tab.
   *
   * @param {String} slug: The tab slug.
   */
  _t.assertActiveTab = function(slug) {

    // Get tab and pane.
    var tab = this.vw.RECORD.$('a[href="#record-'+slug+'"]');
    var pane = this.vw.RECORD.$('#record-'+slug);

    // Tab should be active, pane visible.
    expect(tab.parent('li')).toHaveClass('active');
    expect(pane).toHaveClass('active');

  };


  return _t;


})(_t || {});
