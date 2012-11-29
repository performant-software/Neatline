
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Search view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Editor.Views.Search = Backbone.View.extend({

  events: {
    'keyup input': 'keystroke',
    'click button.search': 'search'
  },

  /*
   * Get components.
   *
   * @return void.
   */
  initialize: function() {

    // UX.
    this.input = this.$el.find('input');
    this.button = this.$el.find('button');

  },

  /*
   * Execute search.
   *
   * @return void.
   */
  keystroke: function() {
    this.parseQuery();
  },

  /*
   * Execute search.
   *
   * @return void.
   */
  search: function(e) {

    // TODO|dev.
    // Set map mirroring.
    // Editor.global.mapMirror = this.query.mapMirror;
    // if (this.query.mapMirror) Editor.vent.trigger('search:mapMirror');

    // Execute query.
    Editor.vent.trigger('search:query', this.query);
    console.log(this.query);

    // Update button
    this.updateStatus();

  },

  /*
   * Parse and publish the search string.
   *
   * @return void.
   */
  parseQuery: function() {

    this.query = {
      keywords: null,
      tags: null
    };

    // Get the raw query.
    var value = this.input.val();


    // Tags:
    // -----

    if (_.string.startsWith(value, 'tags:')) {
      var tags = _.string.strRight(value, 'tags:');
      this.query.tags = _.string.trim(tags);
      this.bold();
    }


    // Keywords:
    // ---------

    else {
      this.query.keywords = value;
      this.unbold();
    }


  },

  /*
   * If input has a value, set button active.
   *
   * @return void.
   */
  updateStatus: function() {
    if (this.input.val() === '') this.inactive();
    else this.active();
  },

  /*
   * Set search button active.
   *
   * @return void.
   */
  active: function() {
    this.button.addClass('btn-primary');
  },

  /*
   * Set search button inactive.
   *
   * @return void.
   */
  inactive: function() {
    this.button.removeClass('btn-primary');
  },

  /*
   * Bold search query with structured format.
   *
   * @return void.
   */
  bold: function() {
    this.input.addClass('bold');
  },

  /*
   * Un-bold search query with unstructured format.
   *
   * @return void.
   */
  unbold: function() {
    this.input.removeClass('bold');
  }

});
