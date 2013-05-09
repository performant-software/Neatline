
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


var NL = (function(NL) {


  /**
   * Read JSON fixtures.
   */
  NL.loadJsonFixtures = function() {

    this.json = {

      MapOutgoingEvents: {
        records:      readFixtures('MapOutgoingEvents.records.json')
      },

      MapRecordFocusing: {
        records:      readFixtures('MapRecordFocusing.records.json'),
        record:       readFixtures('MapRecordFocusing.record.json')
      },

      MapRecordIngesting: {
        records: {
          one:        readFixtures('MapRecordIngesting.records.one.json'),
          two:        readFixtures('MapRecordIngesting.records.two.json')
        }
      },

      MapVectorLayers: {
        records: {
          regular:    readFixtures('MapVectorLayers.records.regular.json'),
          deleted:    readFixtures('MapVectorLayers.records.deleted.json'),
          zindex:     readFixtures('MapVectorLayers.records.zindex.json'),
          styles:     readFixtures('MapVectorLayers.records.styles.json'),
          focusing:   readFixtures('MapVectorLayers.records.focusing.json')
        }
      },

      MapWmsLayers: {
        records: {
          regular:    readFixtures('MapWmsLayers.records.regular.json'),
          deleted:    readFixtures('MapWmsLayers.records.deleted.json'),
          zindex:     readFixtures('MapWmsLayers.records.zindex.json'),
          styles:     readFixtures('MapWmsLayers.records.styles.json')
        },
        record: {
          noFocus:    readFixtures('MapWmsLayers.record.noFocus.json'),
          focus:      readFixtures('MapWmsLayers.record.focus.json')
        }
      },

      MapLayerRefreshing: {
        records: {
          vector: {
            regular:  readFixtures('MapLayerRefreshing.records.vector.regular.json'),
            changed:  readFixtures('MapLayerRefreshing.records.vector.changed.json')
          },
          wms: {
            regular:  readFixtures('MapLayerRefreshing.records.wms.regular.json'),
            changed:  readFixtures('MapLayerRefreshing.records.wms.changed.json')
          }
        }
      },

      MapLayerFiltering: {
        records: {
          regular:    readFixtures('MapLayerFiltering.records.regular.json'),
          deleted:    readFixtures('MapLayerFiltering.records.deleted.json')
        }
      },

      StaticBubble: {
        records:      readFixtures('StaticBubble.records.json')
      },

      SearchInit: {
        records:      readFixtures('SearchInit.records.json')
      },

      SearchMapMirror: {
        records: {
          list:       readFixtures('SearchMapMirror.records.list.json'),
          map:        readFixtures('SearchMapMirror.records.map.json')
        }
      },

      SearchQuery: {
        records:      readFixtures('SearchQuery.records.json')
      },

      Styles: {
        exhibit:      readFixtures('Styles.exhibit.json')
      }

    };

    this.xml = {

      RecordFormText: {
        items:        readFixtures('RecordFormText.items.xml')
      }

    };

  };


  return NL;


})(NL || {});
