
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
        records:    readFixtures('MapOutgoingEvents.records.json')
      },

      MapRecordFocusing: {
        records:    readFixtures('MapRecordFocusing.records.json'),
        record:     readFixtures('MapRecordFocusing.record.json')
      },

      MapRecordIngesting: {
        records: {
          one:      readFixtures('MapRecordIngesting.records.one.json'),
          two:      readFixtures('MapRecordIngesting.records.two.json')
        }
      },

      MapVectorLayers: {
        records: {
          regular:  readFixtures('MapVectorLayers.records.regular.json'),
          deleted:  readFixtures('MapVectorLayers.records.deleted.json'),
          styles:   readFixtures('MapVectorLayers.records.styles.json')
        }
      },

      MapWmsLayers: {
        records: {
          regular:  readFixtures('MapWmsLayers.records.regular.json'),
          deleted:  readFixtures('MapWmsLayers.records.deleted.json')
        }
      },

      MapLayerRefreshing: {
        records: {
          regular:  readFixtures('MapLayerRefreshing.records.regular.json'),
          changed:  readFixtures('MapLayerRefreshing.records.changed.json')
        }
      },

      MapLayerFiltering: {
        records: {
          regular:  readFixtures('MapLayerFiltering.records.regular.json'),
          deleted:  readFixtures('MapLayerFiltering.records.deleted.json')
        }
      },

      MapEditLayer: {
        records: {
          regular:  readFixtures('MapEditLayer.records.regular.json'),
          deleted:  readFixtures('MapEditLayer.records.deleted.json')
        }
      },

      StaticBubble: {
        records:    readFixtures('StaticBubble.records.json')
      },

      RecordForm: {
        record:     readFixtures('RecordForm.record.json'),
        records:    readFixtures('RecordForm.records.json')
      },

      RecordFormAdd: {
        records:    readFixtures('RecordFormAdd.records.json'),
        record:     readFixtures('RecordFormAdd.record.json')
      },

      RecordFormOpen: {
        records:    readFixtures('RecordFormOpen.records.json')
      },

      RecordFormClose: {
        records:    readFixtures('RecordFormClose.records.json'),
        record:     readFixtures('RecordFormClose.record.json')
      },

      RecordsList: {
        records: {
          regular:  readFixtures('RecordsList.records.regular.json'),
          html:     readFixtures('RecordsList.records.html.json'),
          empty:    readFixtures('RecordsList.records.empty.json')
        }
      },

      RecordsPagination: {
        records: {
          p12:      readFixtures('RecordsPagination.records.p12.json'),
          p23:      readFixtures('RecordsPagination.records.p23.json'),
          p34:      readFixtures('RecordsPagination.records.p34.json'),
          p56:      readFixtures('RecordsPagination.records.p56.json'),
          p6:       readFixtures('RecordsPagination.records.p6.json')
        }
      },

      SearchInit: {
        records:    readFixtures('SearchInit.records.json')
      },

      SearchMapMirror: {
        records: {
          list:     readFixtures('SearchMapMirror.records.list.json'),
          map:      readFixtures('SearchMapMirror.records.map.json')
        }
      },

      SearchQuery: {
        records:    readFixtures('SearchQuery.records.json')
      },

      Styles: {
        exhibit:    readFixtures('Styles.exhibit.json')
      }

    };

    this.xml = {

      RecordFormText: {
        items:      readFixtures('RecordFormText.items.xml')
      }

    };

  };


  return NL;


})(NL || {});
