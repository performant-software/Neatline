
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for Google layer handler.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Google Layer Handler', function() {


  var google;


  beforeEach(function() {
    _t.loadNeatline();
  });


  afterEach(function() {
    expect(google.CLASS_NAME).toEqual('OpenLayers.Layer.Google');
    expect(google.name).toEqual('Title');
  });


  it('should construct a `physical` layer', function() {

    google = Neatline.request('map:layers:Google', {
      provider: 'physical',
      title:    'Title'
    });

    expect(google.type).toEqual(google.maps.MapTypeId.TERRAIN);

  });


  it('should construct a `streets` layer', function() {

    google = Neatline.request('map:layers:Google', {
      provider: 'streets',
      title:    'Title'
    });

    expect(google.type).toEqual(google.maps.MapTypeId.ROADMAP);

  });


  it('should construct a `satellite` layer', function() {

    google = Neatline.request('map:layers:Google', {
      provider: 'satellite',
      title:    'Title'
    });

    expect(google.type).toEqual(google.maps.MapTypeId.SATELLITE);

  });


  it('should construct a `hybrid` layer', function() {

    google = Neatline.request('map:layers:Google', {
      provider: 'hybrid',
      title:    'Title'
    });

    expect(google.type).toEqual(google.maps.MapTypeId.HYBRID);

  });


});
