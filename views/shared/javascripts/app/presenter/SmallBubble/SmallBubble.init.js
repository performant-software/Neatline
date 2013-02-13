
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Small-content bubble initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.SmallBubble', function(
  SmallBubble, Neatline, Backbone, Marionette, $, _) {


  SmallBubble.init = function() {
    this.__view = new SmallBubble.View();
  };

  SmallBubble.addInitializer(SmallBubble.init);


});
