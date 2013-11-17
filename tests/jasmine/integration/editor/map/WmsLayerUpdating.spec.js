
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map | WMS Layer Updating', function() {


  beforeEach(function() {
    NL.loadEditor();
  });


  it('should add a new WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When a WMS address and layers are entered in the record form and the
    // record is saved, the new WMS layer should immediately be added to the
    // map by the layer refresh.
    // ------------------------------------------------------------------------

  });


  it('should reload an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved without changes to the WMS fields, the WMS layer should be re-
    // loaded without modification.
    // ------------------------------------------------------------------------

  });


  it('should update an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved _with_ changes to the WMS fields, the WMS layer should be re-
    // loaded with the new values.
    // ------------------------------------------------------------------------

  });


  it('should remove an existing WMS layer for the form record', function() {

    // ------------------------------------------------------------------------
    // When the record being edited already has a WMS layer and the record is 
    // re-saved with empty WMS fields, the WMS layer should be removed.
    // ------------------------------------------------------------------------

  });
