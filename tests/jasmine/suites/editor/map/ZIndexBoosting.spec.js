
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for edit layer management.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Edit Layer Z-index Boosting', function() {


  var el, recordModels;


  beforeEach(function() {

    _t.loadEditor();
    recordModels = _t.getRecordListModels();

    el = {
      pan:      _t.vw.RECORD.$('input[value="pan"]'),
      point:    _t.vw.RECORD.$('input[value="point"]'),
      line:     _t.vw.RECORD.$('input[value="line"]'),
      poly:     _t.vw.RECORD.$('input[value="poly"]'),
      regPoly:  _t.vw.RECORD.$('input[value="regPoly"]'),
      svg:      _t.vw.RECORD.$('input[value="svg"]'),
      modify:   _t.vw.RECORD.$('input[value="modify"]'),
      rotate:   _t.vw.RECORD.$('input[value="rotate"]'),
      resize:   _t.vw.RECORD.$('input[value="resize"]'),
      drag:     _t.vw.RECORD.$('input[value="drag"]'),
      remove:   _t.vw.RECORD.$('input[value="remove"]')
    };

  });


  describe('when the map edit mode is changed', function() {

    describe('when a vector modify mode is active', function() {

      afterEach(function() {
        // assert edit layer raised.
      });

    });

    describe('when a vector modify mode is not active', function() {

      afterEach(function() {
        // assert edit layer not raised.
      });

    });

  });


  describe('when new records are ingested', function() {

    describe('when a vector modify mode is active', function() {

      afterEach(function() {
        // assert edit layer raised.
      });

    });

    describe('when a vector modify mode is not active', function() {

      afterEach(function() {
        // assert edit layer not raised.
      });


    });

  });


});
