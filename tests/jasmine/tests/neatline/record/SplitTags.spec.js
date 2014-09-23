
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Split Tags', function() {


  it('should return an empty array when no tags', function() {

    // ------------------------------------------------------------------------
    // When a record has no tags, return an empty array.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model();
    expect(record.splitTags('tags')).toEqual([]);

  });


  it('should return tags as an array', function() {

    // ------------------------------------------------------------------------
    // When tags are defined, they should be returned as an array.
    // ------------------------------------------------------------------------

    var record = new Neatline.Shared.Record.Model({
      tags: 'tag1, tag2, tag3'
    });

    expect(record.splitTags('tags')).toEqual([
      'tag1',
      'tag2',
      'tag3'
    ]);

  });


});
