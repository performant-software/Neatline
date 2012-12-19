
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Lists layout manager.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Lists', function(
  Editor, Neatline, Backbone, Marionette, $, _) {


  Editor.Layout = Backbone.Marionette.Layout.extend({


    regions: {
      records:  '#record-list',
      tags:     '#tag-list'
    }


  });


});
