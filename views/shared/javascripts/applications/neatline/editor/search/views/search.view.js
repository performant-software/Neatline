
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2; */

/**
 * Search view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


Neatline.module('Editor.Search.Views', function(
  Views, Search, Backbone, Marionette, $, _) {


  Views.Search = Backbone.View.extend({

    events: {
      'keyup input': 'onKeystroke',
      'click button[name="search"]': 'executeSearch',
      'click button[name="mirror"]': 'toggleMirroring',
      'click button[name="cancel"]': 'reset'
    },

    /*
     * --------------------------------------------------------------------
     * Get components, set trackers.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    initialize: function() {

      // UX.
      this.input = this.$el.find('input');
      this.searchButton = this.$el.find('button[name="search"]');
      this.mirrorButton = this.$el.find('button[name="mirror"]');
      this.cancelButton = this.$el.find('button[name="cancel"]');
      this.icon = this.mirrorButton.find('i');

      // Trackers.
      this.mirrored = false;

    },

    /*
     * --------------------------------------------------------------------
     * Execute search on `Enter`; otherwise, parse query.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    onKeystroke: function(e) {
      if (e.keyCode == 13) this.executeSearch();
      else this.parseQuery();
    },

    /*
     * --------------------------------------------------------------------
     * Execute search.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    executeSearch: function() {
      this.parseQuery();
      Editor.vent.trigger('search:query', this.query);
      this.updateSearchStatus();
    },

    /*
     * --------------------------------------------------------------------
     * Activate/deactivate map mirroring.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    toggleMirroring: function() {
      if (!this.mirrored) this.enableMirroring();
      else this.disableMirroring();
    },

    /*
     * --------------------------------------------------------------------
     * Activate map mirroring.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    enableMirroring: function() {

      // Publish, toggle button.
      Editor.vent.trigger('search:mapMirror');
      this.setMirroringEnabled();
      this.setSearchInactive();
      this.setSearchDisabled();

      // Set trackers.
      Editor.global.mapMirror = true;
      this.mirrored = true;

    },

    /*
     * --------------------------------------------------------------------
     * Deactivate map mirroring.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    disableMirroring: function() {

      // Revert to query.
      this.executeSearch();

      // Toggle button.
      this.setMirroringDisabled();
      this.setSearchEnabled();
      this.updateSearchStatus();

      // Set trackers.
      Editor.global.mapMirror = false;
      this.mirrored = false;

    },

    /*
     * --------------------------------------------------------------------
     * Parse and publish the search string.
     * --------------------------------------------------------------------
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
        this.query.keywords = (value !== '') ? value : null;
        this.setInputUnbold();
      }


    },

    /*
     * --------------------------------------------------------------------
     * Disable mirroring, clear input, execute default query.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    reset: function() {
      this.input.val('');
      this.disableMirroring();
    },

    /*
     * --------------------------------------------------------------------
     * If input has a value, set button active.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    updateSearchStatus: function() {
      if (this.input.val() === '') this.setSearchInactive();
      else this.setSearchActive();
    },

    /*
     * --------------------------------------------------------------------
     * Set search button active.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setSearchActive: function() {
      this.searchButton.addClass('btn-primary');
    },

    /*
     * --------------------------------------------------------------------
     * Set search button inactive.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setSearchInactive: function() {
      this.searchButton.removeClass('btn-primary');
    },

    /*
     * --------------------------------------------------------------------
     * Set search button and input enabled.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setSearchEnabled: function() {
      this.searchButton.removeAttr('disabled');
      this.input.removeAttr('disabled');
    },

    /*
     * --------------------------------------------------------------------
     * Set search button and input disabled.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setSearchDisabled: function() {
      this.searchButton.attr('disabled', 'disabled');
      this.input.attr('disabled', 'disabled');
    },

    /*
     * --------------------------------------------------------------------
     * Set mirror button active.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setMirroringEnabled: function() {
      this.mirrorButton.addClass('btn-primary');
      this.icon.addClass('icon-white');
    },

    /*
     * --------------------------------------------------------------------
     * Set mirror button inactive.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setMirroringDisabled: function() {
      this.mirrorButton.removeClass('btn-primary');
      this.icon.removeClass('icon-white');
    },

    /*
     * --------------------------------------------------------------------
     * Bold search query with structured format.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setInputBold: function() {
      this.input.addClass('bold');
    },

    /*
     * --------------------------------------------------------------------
     * Un-bold search query with unstructured format.
     * --------------------------------------------------------------------
     *
     * @return void.
     */
    setInputUnbold: function() {
      this.input.removeClass('bold');
    }

  });

});
