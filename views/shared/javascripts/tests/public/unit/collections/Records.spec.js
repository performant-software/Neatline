
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record collection unit tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Collection', function() {

  beforeEach(function() {
    _t.loadNeatline();
  });

  it('should propagate model changes to all collections', function() {

    // --------------------------------------------------------------------
    // When any instance of Neatline.Models.Record is changed by way of a
    // call to `set`, all instances of Neatline.Collections.Records should
    // check to see if a model with the same id as the originally changed
    // model is present, and, if so, updated the local copy of the model.
    // This ensures that all instances of a model are kept up-to-date when
    // a model is changed in the editor. For example, when the title of a
    // record is changed in an edit form, the new title should immediately
    // manifest on the map, in the list of records, etc.
    // --------------------------------------------------------------------

    // Create two collections.
    var coll1 = new Neatline.Collections.Records();
    var coll2 = new Neatline.Collections.Records();

    // Populate with the same model.
    var model1 = coll1.create({ id: 1 });
    var model2 = coll2.create({ id: 1 });

    // Change model1.
    model1.set({ newAttr: 'val' });

    // Check for change on model2.
    expect(model2.get('newAttr')).toEqual('val');

  });

  describe('getCollection', function() {

    it('should issue GET request for updated records');

  });

  describe('getModel', function() {

    it('should return a model when one is present');
    it('should fetch a new model when one is not present');

  });

});
