<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_CompileFeaturesTest extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->_skipIfNotPlugin('NeatlineFeatures');
    }


    /**
     * `save` should pass silently when NeatlineFeatures is not active.
     */
    public function testNeatlineFeaturesNotInstalled()
    {

        // Deactivate features.
        $this->_setPluginActive('NeatlineFeatures', false);

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $record = new NeatlineRecord($exhibit, $item);
        $record->compileFeatures();

        // Should not set coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * `save` should pass silently when no NeatlineFeatures data exists.
     */
    public function testNoFeatureData()
    {

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $record = new NeatlineRecord($exhibit, $item);
        $record->compileFeatures();

        // Should not set coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * `save` should import WKT data from NeatlineFeatures when it exists.
     */
    public function testImportWkt()
    {

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $this->_addNeatlineFeature($item, 'POINT(1 2)');

        $record = new NeatlineRecord($exhibit, $item);
        $record->compileFeatures();

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
        $record->compileFeatures();

        // Should import KML and convert to WKT.
        $this->assertEquals(
            'GEOMETRYCOLLECTION (POINT (1 2))',
            $record->coverage
        );

    }


    /**
     * Importing neatline features shouldn't clobber existing coverages.
     */
    public function testPreserveExistingCoverages()
    {

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $this->_addNeatlineFeature($item, 'POINT(1 2)');

        $record = new NeatlineRecord($exhibit, $item);
        $record->coverage = 'GEOMETRYCOLLECTION(POINT(3 4))';
        $record->compileFeatures();

        // Shouldn't modify existing coverage.
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(3 4))',
            $record->coverage
        );

    }


}
