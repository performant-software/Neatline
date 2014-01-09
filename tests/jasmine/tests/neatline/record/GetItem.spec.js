
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Get Item', function() {


  var async = new AsyncSpec(this);


  beforeEach(function() {
    NL.loadNeatline();
  });


  async.it('should load the item on first access', function(done) {

    // ------------------------------------------------------------------------
    // When the `item` field is accessed for the first time, the item content
    // should be lazy-loaded from the server and set on the model.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({ id: 1, item_id: 1 });

    // Should set `item` when loaded.
    record.on('change:item', function() {
      expect(record.get('item')).toEqual('item');
      done();
    });

    record.get('item');

    // Should spawn GET request to items body API.
    var route = Neatline.g.neatline.item_body_api+'/1/record/1';
    NL.assertLastRequestRoute(route);
    NL.assertLastRequestMethod('GET');

    // Respond with item.
    NL.respondLast200('item', 'text/html');

  });


  it('should not load the item when record is unsaved', function() {

    // ------------------------------------------------------------------------
    // If the record is unsaved, the item body should not be requested, since
    // the record doesn't have an ID to pass to the API.
    // ------------------------------------------------------------------------

    // Record hasn't been saved, and has no id.
    var record = new Neatline.Shared.Record.Model({ item_id: 1 });

    var c1 = NL.server.requests.length;
    record.get('item');
    var c2 = NL.server.requests.length;
    expect(c2).toEqual(c1);

  });


  it('should not load the item when no parent item is defined', function() {

    // ------------------------------------------------------------------------
    // If the record isn't associated with an Omeka item, item content should
    // never be requested.
    // ------------------------------------------------------------------------

    // Record with no parent item.
    var record = new Neatline.Shared.Record.Model({ id: 1 });

    var c1 = NL.server.requests.length;
    record.get('item');
    var c2 = NL.server.requests.length;
    expect(c2).toEqual(c1);

  });


  it('should not reload the item', function() {

    // ------------------------------------------------------------------------
    // Once the item content has been hydrated by the first access, it should
    // not be reloaded by subsequent requests for the `item` key.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({ id: 1, item_id: 1 });

    record.get('item');

    // Hydrate the item.
    NL.respondLast200('item', 'text/html');

    var c1 = NL.server.requests.length;
    record.get('item');
    var c2 = NL.server.requests.length;
    expect(c2).toEqual(c1);

  });


});
