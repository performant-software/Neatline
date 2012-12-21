
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record', function(
  Record, Neatline, Backbone, Marionette, $, _) {


  Record.View = Backbone.View.extend({


    template:   '#record-form-template',
    className:  'form-stacked record',
    tagName:    'form',


    /**
     * Inject the template, get elements.
     */
    initialize: function() {
      this.$el.append(_.template($(this.template).html()));
    }


  });


});
