
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record list layout manager.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Lists.Records', function(
  Records, Neatline, Backbone, Marionette, $, _) {


  Records.Layout = Backbone.Marionette.Layout.extend({


    template: '#record-list-template',

    regions: {
      search:   '#search',
      records:  '#records'
    }


  });


});
