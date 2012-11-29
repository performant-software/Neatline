
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
    'click button': 'search'
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

    // Block reload.
    e.preventDefault();

    // Set map mirroring.
    Editor.global.mapMirror = this.query.mapMirror;
    if (this.query.mapMirror) Editor.vent.trigger('search:mapMirror');

    // If not "map:", execute query normally.
    else Editor.vent.trigger('search:query', this.query);

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
      mapMirror: false,
      query: null
    };

    // Get the raw query.
    var value = this.input.val();


    // Map mirroring:
    // --------------

    if (_.string.startsWith(value, 'map:')) {
      this.query.mapMirror = true;
      this.boldQuery();
    }


    // Normal keyword:
    // ---------------

    else {
      this.query = value;
      this.unboldQuery();
    }


  },

  /*
   * If input has a value, set button active.
   *
   * @return void.
   */
  updateStatus: function() {
    if (this.input.val() === '') this.setSearchInactive();
    else this.setSearchActive();
  },

  /*
   * Bold search query with structured format.
   *
   * @return void.
   */
  boldQuery: function() {
    this.input.addClass('bold');
  },

  /*
   * Un-bold search query with unstructured format.
   *
   * @return void.
   */
  unboldQuery: function() {
    this.input.removeClass('bold');
  },

  /*
   * Set search button active.
   *
   * @return void.
   */
  setSearchActive: function() {
    this.button.addClass('btn-primary');
  },

  /*
   * Set search button inactive.
   *
   * @return void.
   */
  setSearchInactive: function() {
    this.button.removeClass('btn-primary');
  }

});
