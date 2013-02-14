
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Medium bubble initializer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Presenter.MediumBubble', function(
  MediumBubble, Neatline, Backbone, Marionette, $, _) {


  MediumBubble.init = function() {
    this.__view = new MediumBubble.View();
  };

  MediumBubble.addInitializer(MediumBubble.init);


});
