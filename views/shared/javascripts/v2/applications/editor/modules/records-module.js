/**
 * Records controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Modules.Records = (function(Backbone, Editor, Neatline) {

  var Records = {};


  /*
   * Instantiate the records collection and view.
   *
   * @return void.
   */
  Records.init = function() {
    this.view = new Editor.Views.Records({ el: '#editor' });
    this.collection = new Neatline.Collections.Records();
    this.fetch();
  };

  /*
   * Query for records.
   *
   * @param {Object} params: Query parameters.
   *
   * @return void.
   */
  Records.fetch = function(params) {

    params = params || {};

    // Get records.
    this.collection.fetch({
      data: $.param(params),
      success: _.bind(function() {
        this.view.show(this.collection);
        console.log('editor fetch');
      }, this)
    });

  };


  // -------
  // Events.
  // -------

  /*
   * Show form.
   *
   * @return void.
   */
  Editor.vent.on('form:close', function() {
    Records.view.show(Records.collection);
  });


  // Export.
  Editor.addInitializer(function() { Records.init(); });
  return Records;

})(Backbone, Editor, Neatline);
