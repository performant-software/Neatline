<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_ImportFeaturesTest extends Neatline_Case_Default
{

    public function setUp() {
        parent::setUp();

        $this->ftable = uniqid("omeka_test_nlfeatures_");
        $sql    = <<<SQL
CREATE TABLE `{$this->ftable}` (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  item_id INT(10) UNSIGNED NOT NULL,
  is_map TINYINT(1) NOT NULL DEFAULT 0,
  geo TEXT,
  CONSTRAINT PRIMARY KEY (id)
) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL;
        $this->db->query($sql)->fetchAll();
        set_option('neatline_feature_table', $this->ftable);
    }

    public function tearDown() {
        try {
            if (!is_null($this->ex)) {
                $this->ex->delete();
            }

            $this->_removeTemporaryTable();
        } catch (Exception $e) {
            parent::tearDown();
            throw $e;
        }

        parent::tearDown();
    }

    private function _addFeature($item, $geo) {
        $this->db->query(
            "INSERT INTO `{$this->ftable}` " .
            " (item_id, is_map, geo) VALUES (?, ?, ?);",
                array(
                    $item->id,
                    1,
                    $geo
                )
        );
    }

    private function _dumpFeatures() {
        echo "\n!!! dumpFeatures '{$this->ftable}'\n";
        $results = $this->db->fetchAll(
            "SELECT id, item_id, is_map, geo FROM `{$this->ftable}`;"
        );
        foreach ($results as $r) {
            echo "{$r['id']}\t{$r['item_id']}\t{$r['is_map']}\t{$r['geo']}\n";
        }
    }

    private function _removeTemporaryTable() {
        if (!is_null($this->ftable)) {
            $this->db->query("DROP TABLE IF EXISTS `{$this->ftable}`;");
            $this->ftable = null;
            delete_option('neatline_feature_table');
        }
    }

    /**
     * `save` should pass silently on importing data from NeatlineFeatures if 
     * it's not available.
     */
    public function testImportNeatlineFeaturesUninstalled()
    {
        $this->_removeTemporaryTable();

        nl_mockView();

        $exhibit  = $this->_exhibit('nlf-uninstalled');
        $this->ex = $exhibit;
        $item     = $this->_item();

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        $this->assertEquals(0, $record->is_coverage);
        $this->assertNull($record->coverage);
    }

    /**
     * `save` should import WKT data from NeatlineFeatures.
     */
    public function testImportNeatlineFeaturesWkt()
    {
        nl_mockView();

        $exhibit  = $this->_exhibit('nlf-wkt');
        $this->ex = $exhibit;
        $item     = $this->_item();
        $this->_addFeature(
            $item,
            'POINT(-8739244.5646307 4584569.1500973)'
        );

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        $this->assertEquals(1, $record->is_coverage);
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(-8739244.5646307 4584569.1500973))',
            $record->coverage
        );
    }

    /**
     * `save` should import KML data from NeatlineFeatures.
     */
    public function testImportNeatlineFeaturesKml()
    {
        $kml = <<<KML
<kml xmlns="http://earth.google.com/kml/2.0">
<Folder>
<name>OpenLayers export</name>
<description>Exported on Thu Aug 15 2013 15:03:22 GMT-0400 (EDT)</description>
<Placemark>
<name>OpenLayers.Feature.Vector_145</name>
<description>No description available</description>
<Point><coordinates>-8739204.9736768,4584584.9922932</coordinates></Point>
</Placemark>
</Folder>
</kml>
KML;

        nl_mockView();

        $exhibit  = $this->_exhibit('nlf-kml');
        $this->ex = $exhibit;
        $item     = $this->_item();
        $this->_addFeature($item, $kml);

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        $this->assertEquals(1, $record->is_coverage);
        $this->assertEquals(
            'GEOMETRYCOLLECTION (POINT (-8739204.9736768 4584584.9922932))',
            $record->coverage
        );
    }

    /**
     * Importing neatline features shouldn't clobber existing coverages.
     */
    public function testImportNeatlineFeaturesExisting()
    {
        nl_mockView();

        $exhibit  = $this->_exhibit('nlf-wkt');
        $this->ex = $exhibit;
        $item     = $this->_item();
        $this->_addFeature(
            $item,
            'POINT(-8739244.5646307 4584569.1500973)'
        );

        $record = new NeatlineRecord($exhibit, $item);
        $record->is_coverage = 1;
        $record->coverage = 'GEOMETRYCOLLECTION (POINT (-8739204.9736768 4584584.9922932))';
        $record->save();

        $this->assertEquals(1, $record->is_coverage);
        $this->assertEquals(
            'GEOMETRYCOLLECTION (POINT (-8739204.9736768 4584584.9922932))',
            $record->coverage
        );
    }

}

