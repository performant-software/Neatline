
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


    /**
     * Get markup components, initialize the `mirrored` tracker.
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

    /**
     * Execute search on `Enter`; otherwise, parse query.
     */
    onKeystroke: function(e) {
      if (e.keyCode == 13) this.executeSearch();
      else this.parseQuery();
    },


    /**
     * Execute search.
     */
    executeSearch: function() {
      this.parseQuery();
      Neatline.vent.trigger('editor:search:query', this.query);
      this.updateSearchStatus();
    },


    /**
     * Activate/deactivate map mirroring.
     */
    toggleMirroring: function() {
      if (!this.mirrored) this.enableMirroring();
      else this.disableMirroring();
    },


    /**
     * Activate map mirroring.
     */
    enableMirroring: function() {

      // Publish, toggle button.
      Neatline.vent.trigger('editor:search:mapMirror');
      this.setMirroringEnabled();
      this.setSearchInactive();
      this.setSearchDisabled();

      // Set tracker.
      this.mirrored = true;

    },


    /**
     * Deactivate map mirroring.
     */
    disableMirroring: function() {

      // Revert to query.
      this.executeSearch();

      // Toggle button.
      this.setMirroringDisabled();
      this.setSearchEnabled();
      this.updateSearchStatus();

      // Set tracker.
      this.mirrored = false;

    },


    /**
     * Parse and publish the search string.
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


    /**
     * Disable mirroring, clear input, execute default query.
     */
    reset: function() {
      this.input.val('');
      this.disableMirroring();
    },


    /**
     * If input has a value, set button active.
     */
    updateSearchStatus: function() {
      if (this.input.val() === '') this.setSearchInactive();
      else this.setSearchActive();
    },


    /**
     * Set search button active.
     */
    setSearchActive: function() {
      this.searchButton.addClass('btn-primary');
    },


    /**
     * Set search button inactive.
     */
    setSearchInactive: function() {
      this.searchButton.removeClass('btn-primary');
    },


    /**
     * Set search button and input enabled.
     */
    setSearchEnabled: function() {
      this.searchButton.removeAttr('disabled');
      this.input.removeAttr('disabled');
    },


    /**
     * Set search button and input disabled.
     */
    setSearchDisabled: function() {
      this.searchButton.attr('disabled', 'disabled');
      this.input.attr('disabled', 'disabled');
    },


    /**
     * Set mirror button active.
     */
    setMirroringEnabled: function() {
      this.mirrorButton.addClass('btn-primary');
      this.icon.addClass('icon-white');
    },


    /**
     * Set mirror button inactive.
     */
    setMirroringDisabled: function() {
      this.mirrorButton.removeClass('btn-primary');
      this.icon.removeClass('icon-white');
    },


    /**
     * Bold search query with structured format.
     */
    setInputBold: function() {
      this.input.addClass('bold');
    },


    /**
     * Un-bold search query with unstructured format.
     */
    setInputUnbold: function() {
      this.input.removeClass('bold');
    }


  });


});
