
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Map', { startWithParent: false,
  define: function(Map, Editor, Backbone, Marionette, $, _) {


  Map.ID = 'EDITOR:MAP';


  Map.addInitializer(function() {
    Map.__collection = Neatline.Map.__collection;
    Map.__view = Neatline.Map.__view;
    Map.__view.__initEditor();
  });


}});
