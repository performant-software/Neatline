<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_CompileCoverageTest extends Neatline_Case_Default
{


    /**
     * `save` should toggle the `is_coverage` flag depending on whether or not
     * a coverage geometry is set.
     */
    public function testSetIsCoverage()
    {

        $record = new NeatlineRecord();
        $record->save();

        // Should be off by default.
        $this->assertEquals(0, $record->is_coverage);

        $record->coverage = 'POINT(1 1)';
        $record->save();

        // Should flip on for defined coverage.
        $this->assertEquals(1, $record->is_coverage);

        $record->coverage = null;
        $record->save();

        // Should flip off when no coverage.
        $this->assertEquals(0, $record->is_coverage);

    }


    /**
     * When a coverage was previously defined but then cleared, `save` should
     * flip off `is_coverage`.
     */
    public function testDeactivateIsCoverage()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(1 1)';
        $record->save();

        $record->coverage = null;
        $record->save();

        // Should flip off `is_coverage`.
        $this->assertEquals(0, $record->is_coverage);

    }


    /**
     * `save` should pass silently when NeatlineFeatures is not active.
     */
    public function testNeatlineFeaturesNotInstalled()
    {

        $this->_skipIfNotPlugin('NeatlineFeatures');

        // Deactivate features.
        $this->_setPluginActive('NeatlineFeatures', false);

        $record = new NeatlineRecord();
        $record->save();

        // Should not set coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * `save` should pass silently when no NeatlineFeatures data exists.
     */
    public function testNoFeatureData()
    {

        $this->_skipIfNotPlugin('NeatlineFeatures');

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        // Should not set coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * `save` should import WKT data from NeatlineFeatures when it exists.
     */
    public function testImportWkt()
    {

        $this->_skipIfNotPlugin('NeatlineFeatures');

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $this->_addNeatlineFeature($item, 'POINT(1 2)');

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        // Should import WKT.
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(1 2))',
            $record->coverage
        );

    }


    /**
     * `save` should import KML data from NeatlineFeatures.
     */
    public function testImportKml()
    {

        $this->_skipIfNotPlugin('NeatlineFeatures');

        $kml = <<<KML
        <kml xmlns="http://earth.google.com/kml/2.0">
            <Folder>
                <Placemark>
                    <Point><coordinates>1,2</coordinates></Point>
                </Placemark>
            </Folder>
        </kml>
KML;

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $this->_addNeatlineFeature($item, $kml);

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        // Should import KML and convert to WKT.
        $this->assertEquals(
            'GEOMETRYCOLLECTION (POINT (1 2))',
            $record->coverage
        );

    }


    /**
     * Data from Neatline Features shouldn't clobber existing coverages.
     */
    public function testPreserveExistingCoverages()
    {

        $this->_skipIfNotPlugin('NeatlineFeatures');

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $this->_addNeatlineFeature($item, 'POINT(1 2)');

        $record = new NeatlineRecord($exhibit, $item);
        $record->coverage = 'GEOMETRYCOLLECTION(POINT(3 4))';
        $record->save();

        // Shouldn't modify existing coverage.
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(3 4))',
            $record->coverage
        );

    }


}
