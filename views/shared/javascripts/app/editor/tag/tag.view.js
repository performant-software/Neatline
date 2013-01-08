
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tag form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Tag', function(
  Tag, Neatline, Backbone, Marionette, $, _) {


  Tag.View = Backbone.Neatline.View.extend({


    template:   '#tag-form-template',
    className:  'form-stacked tag',
    tagName:    'form',


    /**
     * Render template, get elements.
     */
    initialize: function() {
      this.getTemplate();
      this.getUi();
    }


  });


});
