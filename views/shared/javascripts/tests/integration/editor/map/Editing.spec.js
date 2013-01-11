
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map editing.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Editing', function() {

  var recordRows, recordModels, mapLayers, feature1, feature2;

  beforeEach(function() {

    _t.loadEditor();

    // Get record rows and models.
    recordRows    = _t.getRecordRows();
    recordModels  = _t.getRecordModels();

    // Get layers and features.
    mapLayers     = _t.getVectorLayers();
    feature1      = mapLayers[0].features[0];
    feature2      = mapLayers[1].features[0];

  });

  // it('should create map edit layer when one does not exist', function() {

  //   // --------------------------------------------------------------------
  //   // When an edit form is opened for a record that does not already have
  //   // a corresponding map layer (for example, when the record list is not
  //   // set in map mirroring mode, and there are listings for records that
  //   // are not visible in the current viewport on the map), the model for
  //   // the record housed in the editor application should be passed to the
  //   // map and used to create a map layer for the record on the fly.
  //   // --------------------------------------------------------------------

  //   // Load map without Record 2.
  //   _t.refreshMap(_t.json.records.removed);

  //   // Just 2 layer on the map.
  //   expect(_t.vw.map.layers.length).toEqual(2);

  //   // Open form for Record 2.
  //   _t.click($(recordRows[1]));

  //   // Check for new layer.
  //   mapLayers = _t.getVectorLayers();
  //   expect(mapLayers.length).toEqual(3);
  //   expect(_.last(mapLayers).features[0].geometry.x).toEqual(3);
  //   expect(_.last(mapLayers).features[0].geometry.y).toEqual(4);

  // });

});
