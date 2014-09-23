
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Has Tag', function() {


  it('no tags', function() {
    var record = new Neatline.Shared.Record.Model();
    expect(record.hasTag('tag')).toBeFalsy();
  });


  it('one tag', function() {

    var record = new Neatline.Shared.Record.Model({
      tags: 'tag1'
    });

    expect(record.hasTag('tag1')).toBeTruthy();
    expect(record.hasTag('tag2')).toBeFalsy();

  });


  it('multiple tags', function() {

    var record = new Neatline.Shared.Record.Model({
      tags: 'tag1, tag2'
    });

    expect(record.hasTag('tag1')).toBeTruthy();
    expect(record.hasTag('tag2')).toBeTruthy();
    expect(record.hasTag('tag3')).toBeFalsy();

  });


  it('untrimmed tags', function() {

    var record = new Neatline.Shared.Record.Model({
      tags: ' tag1 , tag2 '
    });

    expect(record.hasTag('tag1')).toBeTruthy();
    expect(record.hasTag('tag2')).toBeTruthy();
    expect(record.hasTag('tag3')).toBeFalsy();

  });


  it('substring tags', function() {

    var record = new Neatline.Shared.Record.Model({
      tags: 'tag1, tag2'
    });

    expect(record.hasTag('tag1')).toBeTruthy();
    expect(record.hasTag('tag2')).toBeTruthy();
    expect(record.hasTag('tag')).toBeFalsy();

  });


});
