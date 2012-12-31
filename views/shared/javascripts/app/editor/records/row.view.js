
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record row view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.RowView = Backbone.View.extend({


    className:  'record',
    tagName:    'li',


    /**
     * Store model, render template.
     */
    initialize: function() {
      this.model = this.options.model;
      this.$el.append(this.options.template({
        title:  this.model.get('title'),
        body:   this.model.get('body')
      }));
    }


  });


});
