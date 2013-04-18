
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Static Bubble Map Interactions', function() {


  var el, layers, feature1, feature2;


  beforeEach(function() {

    _t.loadNeatline();
    _t.respondMap200(_t.json.StaticBubble.records);

    layers = _t.vw.MAP.getVectorLayers();
    feature1 = layers[0].features[0];
    feature2 = layers[1].features[0];

  });


  it('should hide the bubble by default', function() {

    // --------------------------------------------------------------------
    // By default, when a record is not bound to the bubble, the bubble
    // container should be appended to the map container and invisible.
    // --------------------------------------------------------------------

    expect(_t.vw.MAP.$el).toContain(_t.vw.BUBBLE.$el);
    expect(_t.vw.BUBBLE.$el).not.toBeVisible();

  });

  describe('highlight', function() {

    it('should show the title, not the body', function() {

      // ------------------------------------------------------------------
      // When the cursor hovers on a feature, the the record should be
      // bound to the bubble and the title should be displayed in the map
      // container. (The body should stay hidden).
      // ------------------------------------------------------------------

      _t.hoverOnMapFeature(feature1);

      // Title and body should be populated.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');

      // Title should be visible.
      expect(_t.vw.BUBBLE.$('.title')).toBeVisible();

      // Body should be hidden.
      expect(_t.vw.BUBBLE.$('.body')).not.toBeVisible();

    });

    it('should not override a selected record', function() {

      // ------------------------------------------------------------------
      // When a record is selected and the cursor hovers on a feature for
      // a different record, the new record should not be highlighted.
      // ------------------------------------------------------------------

      _t.hoverOnMapFeature(feature1);
      _t.clickOnMapFeature(feature1);
      _t.hoverOnMapFeature(feature2);

      // Title and body should not change.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title1');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body1');

    });

  });

  describe('unlighlight', function() {

    it('should hide the bubble if it is not selected', function() {

      // ------------------------------------------------------------------
      // When the cursor leaves a feature and a record is not selected,
      // the bubble should be hidden.
      // ------------------------------------------------------------------

      _t.hoverOnMapFeature(feature1);
      _t.unHoverOnMapFeature();

      // Bubble should be hidden.
      expect(_t.vw.BUBBLE.$el).not.toBeVisible();

    });

    it('should not hide the bubble if it is selected', function() {

      // ------------------------------------------------------------------
      // When the cursor leaves a feature and a record is selected, the
      // bubble should be hidden.
      // ------------------------------------------------------------------

      _t.hoverOnMapFeature(feature1);
      _t.clickOnMapFeature(feature1);
      _t.unHoverOnMapFeature();

      // Bubble should not be hidden.
      expect(_t.vw.BUBBLE.$el).toBeVisible();

    });

  });

  describe('select', function() {

    it('should show body and close "X" if body is non-null', function() {

      // ------------------------------------------------------------------
      // When a feature is selected, the body and close button should be
      // displayed if the body content is non-null.
      // ------------------------------------------------------------------

      // Set non-null body.
      layers[0].nModel.set('body', 'content');

      _t.hoverOnMapFeature(feature1);
      _t.clickOnMapFeature(feature1);

      // Body and close "X" should be visible.
      expect(_t.vw.BUBBLE.$('.body')).toBeVisible();
      expect(_t.vw.BUBBLE.$('.close')).toBeVisible();

    });

    it('should not show body and close "X" if body is null', function() {

      // ------------------------------------------------------------------
      // When a feature is selected, the body and close button should not
      // be displayed if the body content is null.
      // ------------------------------------------------------------------

      // Set null body.
      layers[0].nModel.set('body', null);

      _t.hoverOnMapFeature(feature1);
      _t.clickOnMapFeature(feature1);

      // Body and close "X" should not be visible.
      expect(_t.vw.BUBBLE.$('.body')).not.toBeVisible();
      expect(_t.vw.BUBBLE.$('.close')).not.toBeVisible();

    });

    it('should override a selected record', function() {

      // ------------------------------------------------------------------
      // When a feature is selected, the model for the feature should be
      // bound to the bubble even if another record is already selected.
      // ------------------------------------------------------------------

      _t.hoverOnMapFeature(feature1);
      _t.clickOnMapFeature(feature1);
      _t.clickOnMapFeature(feature2);

      // Title and body should change.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body2');

    });

  });

  describe('close', function() {

    // --------------------------------------------------------------------
    // When the bubble is closed by clicking the close "X" or unselecting
    // a map feature, the bubble should be hidden and start responding to
    // highlight events.
    // --------------------------------------------------------------------

    beforeEach(function() {
      _t.hoverOnMapFeature(feature1);
      _t.clickOnMapFeature(feature1);
    });

    afterEach(function() {

      // Bubble should be hidden.
      expect(_t.vw.BUBBLE.$el).not.toBeVisible();

      _t.hoverOnMapFeature(feature2);

      // Should start responding to highlight events.
      expect(_t.vw.BUBBLE.$('.title')).toHaveText('title2');
      expect(_t.vw.BUBBLE.$('.body')).toHaveText('body2');

    });

    it('should close when close "X" is clicked', function() {
      _t.vw.BUBBLE.$('.close').trigger('click');
    });

    it('should close when a feature is unselected', function() {
      _t.clickOffMapFeature();
    });

  });


});
