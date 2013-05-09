
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Stamen Base Layer Constructor', function() {


  var layer;


  beforeEach(function() {
    NL.loadNeatline();
  });


  afterEach(function() {
    expect(layer.CLASS_NAME).toEqual('OpenLayers.Layer.OSM');
    expect(layer.name).toEqual('Title');
  });


  it('should construct a `toner` layer', function() {

    layer = Neatline.request('MAP:LAYERS:Stamen', {
      title: 'Title',
      properties: {
        provider: 'toner'
      }
    });

    expect(_.string.startsWith(
      layer.url[0], 'http://tile.stamen.com/toner'
    )).toBeTruthy();

  });


  it('should construct a `terrain` layer', function() {

    layer = Neatline.request('MAP:LAYERS:Stamen', {
      title: 'Title',
      properties: {
        provider: 'terrain'
      }
    });

    expect(_.string.startsWith(
      layer.url[0], 'http://tile.stamen.com/terrain'
    )).toBeTruthy();

  });


  it('should construct a `watercolor` layer', function() {

    layer = Neatline.request('MAP:LAYERS:Stamen', {
      title: 'Title',
      properties: {
        provider: 'watercolor'
      }
    });

    expect(_.string.startsWith(
      layer.url[0], 'http://tile.stamen.com/watercolor'
    )).toBeTruthy();

  });


});
