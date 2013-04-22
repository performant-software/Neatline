
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Assert that the pagination `<<` link is enabled.
   */
  NL.assertPaginationPrevEnabled = function() {
    var prev = this.vw.RECORDS.$el.find('.pagination .prev');
    expect($(prev[0]).parent('li')).not.toHaveClass('disabled');
    expect($(prev[1]).parent('li')).not.toHaveClass('disabled');
  };


  /**
   * Assert that the pagination `<<` link is disabled.
   */
  NL.assertPaginationPrevDisabled = function() {
    var prev = this.vw.RECORDS.$el.find('.pagination .prev');
    expect($(prev[0]).parent('li')).toHaveClass('disabled');
    expect($(prev[1]).parent('li')).toHaveClass('disabled');
  };


  /**
   * Assert that the pagination `>>` link is enabled.
   */
  NL.assertPaginationNextEnabled = function() {
    var next = this.vw.RECORDS.$el.find('.pagination .next');
    expect($(next[0]).parent('li')).not.toHaveClass('disabled');
    expect($(next[1]).parent('li')).not.toHaveClass('disabled');
  };


  /**
   * Assert that the pagination `>>` link is disabled.
   */
  NL.assertPaginationNextDisabled = function() {
    var next = this.vw.RECORDS.$el.find('.pagination .next');
    expect($(next[0]).parent('li')).toHaveClass('disabled');
    expect($(next[1]).parent('li')).toHaveClass('disabled');
  };


  /**
   * Assert the `href` attribute on the pagination `<<` link.
   *
   * @param {String} route: The hash.
   */
  NL.assertPaginationPrevRoute = function(route) {
    var prev = this.vw.RECORDS.$el.find('.pagination .prev');
    expect($(prev[0])).toHaveAttr('href', route);
    expect($(prev[1])).toHaveAttr('href', route);
  };


  /**
   * Assert the `href` attribute on the pagination `>>` link.
   *
   * @param {String} route: The hash.
   */
  NL.assertPaginationNextRoute = function(route) {
    var next = this.vw.RECORDS.$el.find('.pagination .next');
    expect($(next[0])).toHaveAttr('href', route);
    expect($(next[1])).toHaveAttr('href', route);
  };


  return NL;


})(NL || {});
