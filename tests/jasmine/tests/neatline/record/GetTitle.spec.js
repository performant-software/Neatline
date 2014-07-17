
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Get Title', function() {


  it('no record title, no item title -> `undefined`', function() {

    // ------------------------------------------------------------------------
    // If neither a record title nor an item title are defined on the record,
    // the `title` key should return nothing.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model();

    expect(record.get('title')).toBeUndefined();

  });


  it('item title, no record title -> item title', function() {

    // ------------------------------------------------------------------------
    // If an item title is defined but no record title, the `title` key should
    // return the item title.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({
      item_title: 'item'
    });

    expect(record.get('title')).toEqual('item');

  });


  it('record title, no item title -> record title', function() {

    // ------------------------------------------------------------------------
    // If a record title is defined but no item title, the `title` key should
    // return the record title.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({
      title: 'record'
    });

    expect(record.get('title')).toEqual('record');

  });


  it('record title and item title -> record title', function() {

    // ------------------------------------------------------------------------
    // If both a record title and an item title are defined, the `title` key
    // should return the record title.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({
      title: 'record', item_title: 'item'
    });

    expect(record.get('title')).toEqual('record');

  });


});
