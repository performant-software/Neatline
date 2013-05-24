
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Static Bubble Map Interactions', function() {


  var el, layers, feature1, feature2, fx = {
    records: readFixtures('PublicPresentersStaticBubble.records.json')
  };


  beforeEach(function() {

    NL.loadNeatline();
    NL.respondMap200(fx.records);

    layers = NL.vw.MAP.getVectorLayers();
    feature1 = layers[0].features[0];
    feature2 = layers[1].features[0];

  });


  it('should hide the bubble by default', function() {

    // --------------------------------------------------------------------
    // By default, when a record is not bound to the bubble, the bubble
    // container should be appended to the map container and invisible.
    // --------------------------------------------------------------------

    expect(NL.vw.MAP.$el).toContain(NL.vw.BUBBLE.$el);
    expect(NL.vw.BUBBLE.$el).not.toBeVisible();

  });

  describe('when cursor hovers on a feature', function() {

    it('should show the title, not the body or close "X"', function() {

      // ------------------------------------------------------------------
      // When the cursor hovers on a feature, the the record should be
      // bound to the bubble and the title should be displayed in the map
      // container. The body and close "X" should stay hidden.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(feature1);

      // Title and body should be populated.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body1');

      // Title should be visible.
      expect(NL.vw.BUBBLE.$('.title')).toBeVisible();

      // Close "X' and body should be hidden.
      expect(NL.vw.BUBBLE.$('.close')).not.toBeVisible();
      expect(NL.vw.BUBBLE.$('.body')).not.toBeVisible();

    });

    it('should not override a selected record', function() {

      // ------------------------------------------------------------------
      // When a record is selected and the cursor hovers on a feature for
      // a different record, the new record should not be highlighted.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(feature1);
      NL.clickOnMapFeature(feature1);
      NL.hoverOnMapFeature(feature2);

      // Title and body should not change.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body1');

    });

  });

  describe('when cursor leaves a feature', function() {

    it('should hide the bubble if it is not selected', function() {

      // ------------------------------------------------------------------
      // When the cursor leaves a feature and a record is not selected,
      // the bubble should be hidden.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(feature1);
      NL.unHoverOnMapFeature();

      // Bubble should be hidden.
      expect(NL.vw.BUBBLE.$el).not.toBeVisible();

    });

    it('should not hide the bubble if it is selected', function() {

      // ------------------------------------------------------------------
      // When the cursor leaves a feature and a record is selected, the
      // bubble should be hidden.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(feature1);
      NL.clickOnMapFeature(feature1);
      NL.unHoverOnMapFeature();

      // Bubble should not be hidden.
      expect(NL.vw.BUBBLE.$el).toBeVisible();

    });

    it('should hide the bubble when cursor leaves exhibit', function() {

      // ------------------------------------------------------------------
      // When the cursor leaves the exhibit, the bubble should be hidden.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(feature1);
      NL.triggerMapMouseout();

      // Bubble should be hidden.
      expect(NL.vw.BUBBLE.$el).not.toBeVisible();

    });

  });

  describe('when a feature is clicked', function() {

    it('should show close "X" and body if body is non-null', function() {

      // ------------------------------------------------------------------
      // When a feature is selected and the record body content is non-
      // null, the body and close "X" should be displayed.
      // ------------------------------------------------------------------

      // Set non-null body.
      layers[0].nModel.set('body', 'content');

      NL.hoverOnMapFeature(feature1);
      NL.clickOnMapFeature(feature1);

      // Body and close "X" should be visible.
      expect(NL.vw.BUBBLE.$('.body')).toBeVisible();
      expect(NL.vw.BUBBLE.$('.close')).toBeVisible();

    });

    it('should show close "X" but not body if body is null', function() {

      // ------------------------------------------------------------------
      // When a feature is selected and the record body content is null,
      // the close "X" should be displayed but the body should be hidden.
      // ------------------------------------------------------------------

      // Set null body.
      layers[0].nModel.set('body', null);

      NL.hoverOnMapFeature(feature1);
      NL.clickOnMapFeature(feature1);

      // Close "X" should be visible.
      expect(NL.vw.BUBBLE.$('.close')).toBeVisible();

      // Body should not be visible.
      expect(NL.vw.BUBBLE.$('.body')).not.toBeVisible();

    });

    it('should override a selected record', function() {

      // ------------------------------------------------------------------
      // When a feature is selected, the model for the feature should be
      // bound to the bubble even if another record is already selected.
      // ------------------------------------------------------------------

      NL.hoverOnMapFeature(feature1);
      NL.clickOnMapFeature(feature1);
      NL.clickOnMapFeature(feature2);

      // Title and body should change.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body2');

    });

  });

  describe('when a feature is unselected', function() {

    // --------------------------------------------------------------------
    // When the bubble is closed by clicking the close "X" or unselecting
    // a map feature, the bubble should be hidden and start responding to
    // highlight events.
    // --------------------------------------------------------------------

    beforeEach(function() {
      NL.hoverOnMapFeature(feature1);
      NL.clickOnMapFeature(feature1);
    });

    afterEach(function() {

      // Bubble should be hidden.
      expect(NL.vw.BUBBLE.$el).not.toBeVisible();

      NL.hoverOnMapFeature(feature2);

      // Should start responding to highlight events.
      expect(NL.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(NL.vw.BUBBLE.$('.body')).toHaveText('body2');

    });

    it('should close when "X" is clicked', function() {
      NL.vw.BUBBLE.$('.close').trigger('click');
    });

    it('should close when a feature is unselected', function() {
      NL.clickOffMapFeature();
    });

  });


});
