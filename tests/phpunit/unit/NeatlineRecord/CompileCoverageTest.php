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


    // `is_coverage` flag:
    // ------------------------------------------------------------------------


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
    public function testUnsetIsCoverage()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(1 1)';
        $record->save();

        $record->coverage = null;
        $record->save();

        // Should flip off `is_coverage`.
        $this->assertEquals(0, $record->is_coverage);

    }


    // Neatline Features coverage import:
    // ------------------------------------------------------------------------


    /**
     * `save` should pass silently when NeatlineFeatures is not active.
     */
    public function testDoNothingWhenFeaturesNotInstalled()
    {

        $record = new NeatlineRecord();
        $record->save();

        // Should not set coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * `save` should pass silently when no NeatlineFeatures coverage exists.
     */
    public function testDoNothingWhenNoFeaturesCoverage()
    {

        $this->_installPluginOrSkip('NeatlineFeatures');

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
    public function testImportFeaturesWkt()
    {

        $this->_installPluginOrSkip('NeatlineFeatures');

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $this->_addNeatlineFeature($item, 'POINT(1 2)|POINT(3 4)');

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        // Should import WKT.
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(1 2),POINT(3 4))', $record->coverage
        );

    }


    /**
     * `save` should import KML data from NeatlineFeatures.
     */
    public function testImportFeaturesKml()
    {

        $this->_installPluginOrSkip('NeatlineFeatures');

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
            nl_parseWkt($kml), $record->coverage
        );

    }


    /**
     * Data from Neatline Features shouldn't clobber existing coverages.
     */
    public function testImportFeaturesPreserveExistingCoverages()
    {

        $this->_installPluginOrSkip('NeatlineFeatures');

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $this->_addNeatlineFeature($item, 'POINT(1 2)');

        $record = new NeatlineRecord($exhibit, $item);
        $record->coverage = 'POINT(3 4)';
        $record->save();

        // Shouldn't modify existing coverage.
        $this->assertEquals(
            'POINT(3 4)', $record->coverage
        );

    }


    // Dublin Core "Coverage" import:
    // ------------------------------------------------------------------------


    /**
     * `save` should not set a coverage when Dublin Core "Coverage" is empty.
     * @group wkt
     */
    public function testDoNothingWhenNoDublinCoreCoverage()
    {

        $this->_deactivatePlugin('NeatlineFeatures');

        $exhibit  = $this->_exhibit();
        $item     = $this->_item();

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        // Should not set coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * `save` should no set a coverage when Dublin Core "Coverage" cannot be
     * parsed as a valid coverage.
     * @group wkt
     */
    public function testDoNothingWhenInvalidDublinCoreCoverage()
    {
        $this->markTestSkipped();
    }


    /**
     * `save` should import WKT from the Dublin Core "Coverage" element.
     * @group wkt
     */
    public function testImportDublinCoreWkt()
    {
        $this->markTestSkipped();
    }


    /**
     * `save` should import KML from the Dublin Core "Coverage" element.
     * @group wkt
     */
    public function testImportDublinCoreKml()
    {
        $this->markTestSkipped();
    }


}
