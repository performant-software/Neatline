
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Assert the active record form tab.
   *
   * @param {String} slug: The tab slug.
   */
  NL.assertActiveTab = function(slug) {

    var label = this.vw.RECORD.$('a[href="#record-'+slug+'"]');
    var panel = this.vw.RECORD.$('#record-'+slug);

    // Tab should be active, pane visible.
    expect(label.parent('li')).toHaveClass('active');
    expect(panel).toHaveClass('active');

  };


  return NL;


})(NL || {});
