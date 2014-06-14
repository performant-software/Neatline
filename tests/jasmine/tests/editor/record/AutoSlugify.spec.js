
/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Record | Auto-slugify', function() {


  var inputs;


  beforeEach(function() {
    NL.loadEditor();
    inputs = NL.getRecordFormElements();
  });


  it('should auto-slugify the value of the "Slug" field', function() {

    // ------------------------------------------------------------------------
    // When the value of the "Slug" field is changed, it should be converted
    // into a valid slug to prevent slugs with spaces, punctuation, etc.
    // ------------------------------------------------------------------------

    // Set an invalid slug.
    inputs.slug.val('invalid slug!').trigger('input');

    // Should slugify the value.
    expect(inputs.slug.val()).toEqual(_.string.slugify('invalid slug!'));

  });


});
