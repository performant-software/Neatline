
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Browser layout manager.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Browser', function(
  Browser, Neatline, Backbone, Marionette, $, _) {


  Browser.View = Backbone.View.extend({


    template: '#browser-template',
    tagName: 'header',


    /**
     * Inject the template, get elements.
     */
    initialize: function() {
      this.$el.append(_.template($(this.template).html()));
      this.recordsTab = this.$('li.records');
      this.tagsTab    = this.$('li.tags');
    },


    /**
     * Activate the "Records" tab.
     */
    activateRecords: function() {
      this.recordsTab.addClass('active');
      this.tagsTab.removeClass('active');
    },


    /**
     * Activate the "Tags" tab.
     */
    activateTags: function() {
      this.recordsTab.removeClass('active');
      this.tagsTab.addClass('active');
    }


  });


});
