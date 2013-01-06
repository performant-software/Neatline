
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Unit tests for record model.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record Model', function() {

  var model;

  beforeEach(function() {
    model = new Neatline.Record.Model();
    __exhibit.api.record = 'record';
  });

  it('should form url with id when id is set', function() {

    // --------------------------------------------------------------------
    // When the `id` attribute is populated on the model, the model's url
    // should point to `record/:id`.
    // --------------------------------------------------------------------

    model.set('id', 1);
    expect(model.url()).toEqual('record/1');

  });

  it('should form url without id when id is not set', function() {

    // --------------------------------------------------------------------
    // When the `id` attribute is not populated on the model, the model's
    // url should point to `record`.
    // --------------------------------------------------------------------

    expect(model.url()).toEqual('record');;

  });

});
