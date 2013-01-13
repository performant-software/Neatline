
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Styles', function(
  Styles, Neatline, Backbone, Marionette, $, _) {


  Styles.View = Backbone.Neatline.View.extend({


    template:   '#styles-template',
    className:  'form-stacked styles',
    tagName:    'form',


    /**
     * Render template.
     */
    initialize: function() {
      this.getTemplate();
    }


  });


});
