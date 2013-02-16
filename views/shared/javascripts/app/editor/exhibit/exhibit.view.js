
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit defaults view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit', function(
  Exhibit, Neatline, Backbone, Marionette, $, _) {


  Exhibit.View = Backbone.Neatline.View.extend({


    template:   '#exhibit-template',
    className:  'form-stacked styles',
    tagName:    'form',

    events: {
      'click a[name="save"]': 'save'
    },


    /**
     * Render template.
     */
    initialize: function() {
      this.getTemplate();
    },


    /**
     * Save the YAML.
     */
    save: function() {
      // TODO
    },


    /**
     * When a save succeeds.
     */
    onSuccess: function() {
      // TODO
      // Neatline.execute('editor:notifySuccess',
        // STRINGS.styles.save.success
      // );
    },


    /**
     * When a save fails.
     */
    onError: function() {
      // TODO
      // Neatline.execute('editor:notifyError',
        // STRINGS.styles.save.error
      // );
    }


  });


});
