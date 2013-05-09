
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

      StaticBubble: {
        records:      readFixtures('StaticBubble.records.json')
      }

    };

  };


  return NL;


})(NL || {});
