
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
    'keyup input': 'onKeystroke',
    'click button[name="search"]': 'executeSearch',
    'click button[name="mirror"]': 'toggleMirrored'
  },

  /*
   * Get components.
   *
   * @return void.
   */
  initialize: function() {

    // UX.
    this.input = this.$el.find('input');
    this.searchButton = this.$el.find('button[name="search"]');
    this.mirrorButton = this.$el.find('button[name="mirror"]');
    this.icon = this.mirrorButton.find('i');

    // Trackers.
    this.mirrored = false;

  },

  /*
   * Execute search on `Enter`; otherwise, parse query.
   *
   * @return void.
   */
  onKeystroke: function(e) {
    if (e.keyCode == 13) this.executeSearch();
    else this.parseQuery();
  },

  /*
   * Execute search.
   *
   * @return void.
   */
  executeSearch: function() {
    this.parseQuery();
    Editor.vent.trigger('search:query', this.query);
    this.updateSearchStatus();
    console.log(this.query);
  },

  /*
   * Activate/deactivate map mirroring.
   *
   * @return void.
   */
  toggleMirrored: function() {

    // Activate.
    if (!this.mirrored) {

      // Publish, toggle button.
      Editor.vent.trigger('search:mapMirror');
      this.setMirroredActive();

      // Set trackers.
      Editor.global.mapMirror = true;
      this.mirrored = true;

    }

    // Deactivate.
    else {

      // Revert to query.
      this.parseQuery();
      this.executeSearch();

      // Toggle button.
      this.setMirroredInactive();

      // Set trackers.
      Editor.global.mapMirror = true;
      this.mirrored = true;

    }

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
      this.setInputBold();
    }


    // Keywords:
    // ---------

    else {
      this.query.keywords = value;
      this.setInputUnbold();
    }


  },

  /*
   * If input has a value, set button active.
   *
   * @return void.
   */
  updateSearchStatus: function() {
    if (this.input.val() === '') this.setSearchInactive();
    else this.setSearchActive();
  },

  /*
   * Set search button active.
   *
   * @return void.
   */
  setSearchActive: function() {
    this.searchButton.addClass('btn-primary');
  },

  /*
   * Set search button inactive.
   *
   * @return void.
   */
  setSearchInactive: function() {
    this.searchButton.removeClass('btn-primary');
  },

  /*
   * Set mirror button active.
   *
   * @return void.
   */
  setMirroredActive: function() {
    this.mirrorButton.addClass('btn-primary');
    this.icon.addClass('icon-white');
  },

  /*
   * Set mirror button inactive.
   *
   * @return void.
   */
  setMirroredInactive: function() {
    this.mirrorButton.removeClass('btn-primary');
    this.icon.removeClass('icon-white');
  },

  /*
   * Bold search query with structured format.
   *
   * @return void.
   */
  setInputBold: function() {
    this.input.addClass('bold');
  },

  /*
   * Un-bold search query with unstructured format.
   *
   * @return void.
   */
  setInputUnbold: function() {
    this.input.removeClass('bold');
  }

});
