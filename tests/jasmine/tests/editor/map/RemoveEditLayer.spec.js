
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | Remove Edit Layer', function() {


  var record3, fixtures = {
    records12:  read('EditorMapRemoveEditLayer.records12.json'),
    records123: read('EditorMapRemoveEditLayer.records123.json')
  };


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should not garbage collect edit layer', function() {

    // ------------------------------------------------------------------------
    // When a record is being edited, the edit layer should not be removed if
    // the saved geometry for the record does not overlap with the viewport.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures.records123);

    // Open edit form for record 3.
    NL.navigate('record/'+NL.getRecordListModelByTitle('title3').id);

    // Load map without record 3.
    NL.refreshMap(fixtures.records12);

    // Record 3 layer should still be present.
    expect(NL.getVectorLayer('title3')).toBeDefined();
    NL.assertVectorLayerCount(3);

  });


  it('should resume updating edit layer when edit ends', function() {

    // ------------------------------------------------------------------------
    // When the record form is closed, the layer that was previouly the edit
    // layer should start updating again in response to map moves.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures.records123);

    // Open edit form for record 3.
    NL.navigate('record/'+NL.getRecordListModelByTitle('title3').id);
    NL.navigate('records');

    // Respond to map refresh.
    NL.respondMap200(fixtures.records123);

    // Reload map without record 3.
    NL.refreshMap(fixtures.records12);

    // Record 3 layer should be cleared.
    expect(NL.getVectorLayer('title3')).toBeUndefined();
    NL.assertVectorLayerCount(2);

  });


  it('should clear unsaved edit layer when edit ends', function() {

    // ------------------------------------------------------------------------
    // When a new record is added, but then the form is closed without being
    // saved, the edit layer that was created for the model should be garbage
    // collected by the map refresh.
    // ------------------------------------------------------------------------

    NL.respondAll200(fixtures.records123);

    // Add new record.
    NL.navigate('record/add');

    // Should add new layer.
    NL.assertVectorLayerCount(4);

    // Close without saving.
    NL.navigate('records');

    // Respond to map refresh.
    NL.respondMap200(fixtures.records123);

    // Edit layer should be removed.
    expect(NL.getVectorLayer('title1')).toBeDefined();
    expect(NL.getVectorLayer('title2')).toBeDefined();
    expect(NL.getVectorLayer('title3')).toBeDefined();
    NL.assertVectorLayerCount(3);

  });


});
