<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

require_once 'NeatlinePlugin_Migration_TestBase.php';

class NeatlinePlugin_Migration_Test extends NeatlinePlugin_Migration_TestBase
{


    /**
     * This tests that old tables are renamed.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testRenameOldTables()
    {
        $tables = $this->db->listTables();
        $prefix = "{$this->db->prefix}neatline_";
        $this->assertContains("{$prefix}exhibits_migrate",     $tables);
        $this->assertContains("{$prefix}data_records_migrate", $tables);
        $this->assertContains("{$prefix}base_layers_migrate",  $tables);
    }


    /**
     * This tests that new tables are created.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testCreateNewTables()
    {
        $tables = $this->db->listTables();
        $prefix = "{$this->db->prefix}neatline_";
        $this->assertContains("{$prefix}exhibits", $tables);
        $this->assertContains("{$prefix}records",  $tables);
    }


    /**
     * Tests whether the fixtures are working.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testFixtureLoading()
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";

        $sql    = "SELECT COUNT(*) AS c FROM {$prefix}exhibits_migrate;";
        $stmt   = $db->query($sql);
        $stmt->setFetchMode(Zend_Db::FETCH_NUM);
        $counts = $stmt->fetchAll();
        $this->assertNotEquals(0, $counts[0][0]);

        $sql    = "SELECT COUNT(*) AS c FROM {$prefix}data_records_migrate;";
        $stmt   = $db->query($sql);
        $stmt->setFetchMode(Zend_Db::FETCH_NUM);
        $counts = $stmt->fetchAll();
        $this->assertNotEquals(0, $counts[0][0]);
    }


    /**
     * Tests whether the background job is started.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testBackgroundJob()
    {
        $db     = $this->db;
        $select = $db
            ->select()
            ->from("{$db->prefix}processes")
            ->where("class='Omeka_Job_Process_Wrapper'")
            ->where("args LIKE '%Neatline_Job_UpgradeFrom1x%'")
            ->where("status='starting'")
            ->where("PID IS NULL")
            ;

        $q    = $select->query();
        $jobs = $q->fetchAll();

        $this->assertGreaterThan(0, $jobs);
    }


    /**
     * This tests whether the migration handles all data items.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateCounts()
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";

        $this->_migrate();

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}exhibits_migrate;");
        $c_old = $q->fetch();

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}exhibits;");
        $c_new = $q->fetch();

        $this->assertEquals($c_old['COUNT(*)'], $c_new['COUNT(*)']);
        $this->assertGreaterThan(0, $c_old['COUNT(*)']);
        $this->assertGreaterThan(0, $c_new['COUNT(*)']);

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}data_records_migrate;");
        $c_old = $q->fetch();

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}records;");
        $c_new = $q->fetch();

        $this->assertEquals($c_old['COUNT(*)'], $c_new['COUNT(*)']);
        $this->assertGreaterThan(0, $c_old['COUNT(*)']);
        $this->assertGreaterThan(0, $c_new['COUNT(*)']);
    }


    /**
     * This tests that simply transfered fields are handled correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateExhibitSimpleTransfers()
    {
        $this->_migrate();
        $this->_testExhibitMigration('id',                 'id');
        $this->_testExhibitMigration('name',               'title');
        $this->_testExhibitMigration('slug',               'slug');
        $this->_testExhibitMigration('public',             'public');
        $this->_testExhibitMigration('description',        'narrative');
        $this->_testExhibitMigration('modified',           'modified');
        $this->_testExhibitMigration('query',              'query');
        $this->_testExhibitMigration('default_map_bounds', 'map_focus');
        $this->_testExhibitMigration('default_map_zoom',   'map_zoom');
    }


    /**
     * This tests that simply transfered data record fields are handled
     * correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateDataRecordSimpleTransfers()
    {
        $this->_migrate();

        $this->_testRecordMigration('id',                 'id');
        $this->_testRecordMigration('exhibit_id',         'exhibit_id');
        $this->_testRecordMigration('item_id',            'item_id');
        $this->_testRecordMigration('slug',               'slug');
        $this->_testRecordMigration('start_date',         'start_date');
        $this->_testRecordMigration('end_date',           'end_date');
        $this->_testRecordMigration('start_visible_date', 'after_date');
        $this->_testRecordMigration('end_visible_date',   'before_date');
        $this->_testRecordMigration('vector_color',       'fill_color');
        $this->_testRecordMigration('stroke_color',       'stroke_color');
        $this->_testRecordMigration('highlight_color',    'fill_color_select');
        $this->_testRecordMigration('point_image',        'point_image');
        $this->_testRecordMigration('display_order',      'weight');
        $this->_testRecordMigration('map_bounds',         'map_focus');
        $this->_testRecordMigration('map_zoom',           'map_zoom');

    }


    /**
     * This tests fields that are pulled from a style hierarchy.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateParentStyle()
    {
        $this->_migrate();

        $this->_testMigrateDecimalParentStyle('vector_opacity', 'fill_opacity');
        $this->_testMigrateDecimalParentStyle('stroke_opacity', 'stroke_opacity');
        $this->_testMigrateDecimalParentStyle('select_opacity', 'fill_opacity_select');
        $this->_testMigrateParentStyle('stroke_width', 'stroke_width');
        $this->_testMigrateParentStyle('point_radius', 'point_radius');
    }


    /**
     * item_id should never be propagated, since it can clobber title fields.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateToNull()
    {
        $this->_migrate();

        $this->_testAllNull('tags');
        $this->_testAllNull('stroke_color_select');
        $this->_testAllNull('stroke_opacity_select');
        $this->_testAllNull('zindex');
        $this->_testAllNull('min_zoom');
        $this->_testAllNull('max_zoom');
    }


    /**
     * All `owner_id` columns on exhibits and records should be set to 0.
     *
     * @return void
     * @author David McClure
     **/
    public function testOwnerIds()
    {
        $this->_migrate();
        $this->_testAllZero($this->__exhibits, 'owner_id');
        $this->_testAllZero($this->__records, 'owner_id');
    }


    /**
     * This tests that the added and modified fields are set to the very recent 
     * past (i.e., the last three seconds).
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testAddedModifiedDates()
    {
        $db      = $this->db;
        $prefix  = "{$db->prefix}neatline_";
        $table_b = 'NeatlineRecord';
        $b       = 'added';

        $t2 = $db->getTable($table_b);
        $c  = $db->fetchRow(
            "SELECT COUNT(*) FROM {$t2->getTableName()} "
            . "WHERE $b IS NOT NULL AND "
            . "$b <= ADDDATE(NOW(), INTERVAL -3 SECOND);"
        );
        $this->assertEquals(0, $c['COUNT(*)']);
    }


    /**
     * This tests whether a WKT coverage field is correctly handled.
     *
     * @return void
     * @author Eric Rochester
     **/
    function testMigrateDataRecordCoverageWKT()
    {
        $db      = $this->db;
        $prefix  = "{$db->prefix}neatline_";
        $table_a = 'data_records';
        $table_b = 'NeatlineRecord';
        $a       = 'geocoverage';
        $b       = 'coverage';

        $this->_migrate();

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate", array('id', $a));

        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        $is1     = array();

        foreach ($v1 as $e) {
            $value         = $e[$a];
            $is1[$e['id']] = (int)!is_null($value);
            $parts         = explode('|', $value);
            if (count($parts) > 1) {
                $value = 'GEOMETRYCOLLECTION(' . implode(',', $parts) . ')';
            }
            $values1[$e['id']] = $value;
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        $values2 = array();
        $is2     = array();

        foreach ($v2 as $e) {
            if (!$e->is_wms) $this->assertEquals($e->coverage, $values1[$e->id]);
            $this->assertEquals($e->is_coverage, (int) !is_null($e->coverage));
        }

    }


    /**
     * This tests whether a KML coverage field is correctly handled.
     *
     * @return void
     * @author Eric Rochester
     **/
    function testMigrateDataRowCoverageKML()
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";
        $tname  = $prefix . "data_records_migrate";
        $sql    = "SELECT COUNT(*) FROM $tname;";
        $insert = <<<SQL
INSERT INTO $tname
    (id, item_id, use_dc_metadata, exhibit_id, parent_record_id, show_bubble,
        title, slug, description, start_date, end_date, start_visible_date,
        end_visible_date, geocoverage, left_percent, right_percent, vector_color,
        stroke_color, highlight_color, vector_opacity, select_opacity, stroke_opacity,
        graphic_opacity, stroke_width, point_radius, point_image, space_active,
        time_active, items_active, display_order, map_bounds, map_zoom)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
SQL;

        $db->delete($tname);
        $this->assertEquals(0, $db->fetchOne($sql));

        $db->query(
            $insert,
            array(
                1,
                null,
                null,
                1,
                null,
                0,
                'A title',
                null,
                'Some descriptive text.',
                '2013-01-01',
                '2013-12-31',
                null,
                null,
                '<kml xmlns="http://earth.google.com/kml/2.0"><Folder><name>OpenLayers export</name><description>Exported on Tue May 21 2013 14:18:48 GMT-0400 (EDT)</description><Placemark><name>OpenLayers.Feature.Vector_294</name><description>No description available</description><Polygon><outerBoundaryIs><LinearRing><coordinates>-10722123.575577,5383403.6586166 -10746583.424625,5275780.3228061 -10643852.058624,4952910.3153745 -10174222.956905,4962694.2549936 -10130195.228619,5065425.6209946 -10076383.560714,5119237.2888999 -10032355.832428,5207292.7454721 -10159547.047477,5295348.2020444 -10159547.047477,5383403.6586166 -10722123.575577,5383403.6586166</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Folder></kml>',
                0,
                100,
                '#ff1971',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                1,
                1,
                1,
                null,
                '-9748621.5834729, 4808597.2059922',
                5
            ));
        $db->query(
            $insert,
            array(
                2,
                null,
                null,
                1,
                null,
                0,
                'Another title',
                null,
                'Something else descriptive',
                '2012-08-01',
                '2013-04-01',
                '2012-08-01',
                '2013-04-01',
                '<kml xmlns="http://earth.google.com/kml/2.0"><Folder><name>OpenLayers export</name><description>Exported on Tue May 21 2013 14:18:48 GMT-0400 (EDT)</description><Placemark><name>OpenLayers.Feature.Vector_734</name><description>No description available</description><Point><coordinates>-8736595.329118,4583260.8466388</coordinates></Point></Placemark></Folder></kml>',
                13,
                87,
                null,
                null,
                null,
                80,
                null,
                null,
                null,
                null,
                10,
                null,
                1,
                1,
                1,
                null,
                null,
                null,
            ));

        $this->assertEquals(2, $db->fetchOne($sql));

        $this->_migrate();

        $table = $db->getTable('NeatlineRecord');
        $recs  = $table->findAll();

        $this->assertCount(2, $recs);

        foreach ($recs as $r) {
            if ($r->id == 1) {
                $this->assertEquals(
                    'POLYGON((-10722123.575577 5383403.6586166,-10746583.424625 5275780.3228061,-10643852.058624 4952910.3153745,-10174222.956905 4962694.2549936,-10130195.228619 5065425.6209946,-10076383.560714 5119237.2888999,-10032355.832428 5207292.7454721,-10159547.047477 5295348.2020444,-10159547.047477 5383403.6586166,-10722123.575577 5383403.6586166))',
                    $r->coverage
                );

            } else if ($r->id == 2) {
                $this->assertEquals(
                    'POINT(-8736595.329118 4583260.8466388)',
                    $r->coverage
                );

            } else {
                $this->assertTrue(false, 'Invalid ID #.');
            }
        }

    }


    /**
     * This tests the description/body fields.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateBody()
    {
        $db      = $this->db;
        $prefix  = "{$db->prefix}neatline_";
        $table_a = 'data_records';
        $a       = 'description';
        $table_b = 'NeatlineRecord';
        $b       = 'body';

        $this->_migrate();

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate",
                   array('id', $a, 'use_dc_metadata', 'item_id'));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $body = null;
            if (is_null($e[$a])
                && $e['use_dc_metadata']
                && !is_null($e['item_id'])) {

                $item = get_record_by_id('Item', $e['item_id']);
                if (!is_null($item)) {
                    set_current_record('item', $item);
                    $body = get_view()->partial('exhibits/item.php');
                }

            } else {
                $body = $e[$a];
            }
            $values1[$e['id']] = $body;
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        $values2 = array();
        foreach ($v2 as $e) {
            $values2[$e->id] = $e->$b;
        }

        $this->assertNotEmpty($values1);
        $this->assertNotEmpty($values2);
        $this->assertEquals($values1, $values2);
    }


    /**
     * This tests whether show_bubble gets transfered to presenter correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateShowBubble()
    {
        $db      = $this->db;
        $prefix  = "{$db->prefix}neatline_";
        $table_a = 'data_records';
        $a       = 'show_bubble';
        $table_b = 'NeatlineRecord';
        $b       = 'presenter';

        $this->_migrate();

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate", array('id', $a));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $values1[$e['id']] = $e[$a] ? 'StaticBubble' : 'None';
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        $values2 = array();
        foreach ($v2 as $e) {
            $values2[$e->id] = $e->$b;
        }

        $this->assertNotEmpty($values1);
        $this->assertNotEmpty($values2);
        $this->assertEquals($values1, $values2);
    }


    /**
     * This tests whether widgets is getting set correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateWidgets()
    {
        $db      = $this->db;
        $prefix  = "{$db->prefix}neatline_";
        $table_a = 'data_records';
        $table_b = 'NeatlineRecord';
        $b       = 'presenter';

        $this->_migrate();

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate",
                   array('id', 'time_active', 'items_active'));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $index1  = array();
        foreach ($v1 as $el1) {
            $index1[$el1['id']] = array($el1['time_active'],
                                        $el1['items_active']);
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        foreach ($v2 as $el2) {
            $el1 = $index1[$el2->id];

            if ($el1[0]) {
                $this->assertTrue(
                    strpos('Simile', $el2->widgets) !== FALSE,
                    "time_active item missing Simile widget ({$el2->id})"
                );
            } else {
                $this->assertTrue(
                    strpos('Simile', $el2->widgets) === FALSE,
                    "time_active item includes Simile widget ({$el2->id})"
                );
            }

            if ($el1[1]) {
                $this->assertTrue(
                    strpos('Waypoints', $el2->widgets) !== FALSE,
                    "items_active item missing Waypoints widget ({$el2->id})"
                );
            } else {
                $this->assertTrue(
                    strpos('Waypoints', $el2->widgets) === FALSE,
                    "items_active item includes Waypoints widget ({$el2->id})"
                );
            }
        }

    }


    /**
     * WMS layers created by way of the old NeatlineMaps plugin should
     * be migrated into the `wms_address` and `wms_layers` fields.
     *
     * @return voi
     * @author David McClure
     **/
    public function testMigrateWmsLayers()
    {

        $this->_migrate();

        // Get new record rows.
        $newRecords = $this->db->select()
            ->from("{$this->db->prefix}neatline_records")
            ->query()->fetchAll();

        foreach ($newRecords as $record) {
            if (!is_null($record['item_id'])) {

                // For each of the new exhibit rows that has an `item_id`
                // reference, try to find a corresponding WMS service.

                $service = $this->db->select()
                    ->from("{$this->db->prefix}neatline_maps_services")
                    ->where("item_id={$record['item_id']}")
                    ->query()->fetch();

                // Check that the new `wms_address` and `wms_layers` fields
                // on the records match the values on the old services.

                if ($service) {
                    $this->assertEquals(
                        $record['wms_address'], $service['address']
                    );
                    $this->assertEquals(
                        $record['wms_layers'], $service['layers']
                    );
                }

            }
        }

    }


    /**
     * The old `default_base_layer` field on the exhibit model should be
     * migrated to the new `base_layer` field, which now takes a layer slug
     * instead of a foreign key.
     *
     * @return void
     * @author David McClure
     **/
    public function testMigrateDefaultBaseLayer()
    {

        $this->_migrate();

        // Get old exhibit rows.
        $oldExhibits = $this->db->select()
            ->from("{$this->db->prefix}neatline_exhibits_migrate")
            ->query()->fetchAll();

        // Index the original `default_base_layer` field by record id.

        $oldIndex = array();
        foreach ($oldExhibits as $exhibit) {
            $oldIndex[$exhibit['id']] = $exhibit['default_base_layer'];
        }

        // Get new exhibit rows.
        $newExhibits = $this->db->select()
            ->from("{$this->db->prefix}neatline_exhibits")
            ->query()->fetchAll();

        // Index the new `base_layer` field by record id.

        $newIndex = array();
        foreach ($newExhibits as $exhibit) {
            $newIndex[$exhibit['id']] = $exhibit['base_layer'];
        }

        foreach ($oldIndex as $id => $defaultBaseLayer) {
            switch ($defaultBaseLayer) {
                case 1:
                    $this->assertEquals($newIndex[$id], 'OpenStreetMap');
                    break;
                case 2:
                    $this->assertEquals($newIndex[$id], 'GooglePhysical');
                    break;
                case 3:
                    $this->assertEquals($newIndex[$id], 'GoogleStreets');
                    break;
                case 4:
                    $this->assertEquals($newIndex[$id], 'GoogleHybrid');
                    break;
                case 5:
                    $this->assertEquals($newIndex[$id], 'GoogleSatellite');
                    break;
                case 6:
                    $this->assertEquals($newIndex[$id], 'StamenWatercolor');
                    break;
                case 7:
                    $this->assertEquals($newIndex[$id], 'StamenToner');
                    break;
                case 8:
                    $this->assertEquals($newIndex[$id], 'StamenTerrain');
                    break;
            }
        }

    }


    /**
     * This triggers the migration.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _migrate()
    {
        $helper = new Neatline_Migration_200(null, $this->db, false);
        $helper->migrateData();
    }


    /**
     * This tests whether a field was transfered correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testMigration($table_a, $a, $table_b, $b)
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate", array('id', $a));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $values1[$e['id']] = $e[$a];
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        $values2 = array();
        foreach ($v2 as $e) {
            $values2[$e->id] = $e->$b;
        }

        $this->assertNotEmpty($values1);
        $this->assertNotEmpty($values2);
        $this->assertEquals($values1, $values2);
    }


    /**
     * This tests whether an exhibit field was transfered correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testExhibitMigration($a, $b)
    {
        $this->_testMigration('exhibits', $a, 'NeatlineExhibit', $b);
    }


    /**
     * This tests whether a record field was transfered correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testRecordMigration($a, $b)
    {
        $this->_testMigration('data_records', $a, 'NeatlineRecord', $b);
    }


    /**
     * This tests whether the values from an int field matches a decimal field.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testMigrateDecimalParentStyle($a, $b)
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";
        $table_a = 'data_records';
        $table_b = 'NeatlineRecord';

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate", array('id', $a));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $values1[$e['id']] = is_null($e[$a]) ? null : (string)($e[$a] / 100.0);
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        foreach ($v2 as $e) {
            $this->assertTrue(
                is_null($values1[$e->id]) || $values1[$e->id] == $e->$b,
                "Not true that {$values1[$e->id]} == null || {$e->$b}."
            );
        }
    }


    /**
     * This tests that a value get the parent's style.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testMigrateParentStyle($a, $b)
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";
        $table_a = 'data_records';
        $table_b = 'NeatlineRecord';

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate", array('id', $a));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $values1[$e['id']] = $e[$a];
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        foreach ($v2 as $e) {
            $this->assertTrue(
                is_null($values1[$e->id]) || $values1[$e->id] == $e->$b,
                "Not true that {$values1[$e->id]} == null || {$e->$b}."
            );
        }
    }


    /**
     * This tests whether the given field has any non-NULL values.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testAllNull($b)
    {
        $db      = $this->db;
        $prefix  = "{$db->prefix}neatline_";
        $table_b = 'NeatlineRecord';

        $t2 = $db->getTable($table_b);
        $c  = $db->fetchRow(
            "SELECT COUNT(*) FROM {$t2->getTableName()} "
            . "WHERE $b IS NOT NULL;"
        );
        $this->assertEquals(0, $c['COUNT(*)']);
    }


    /**
     * Assert that all rows in a table have value `0` for a given field.
     *
     * @param Omeka_Db_Table $table
     * @param string $field
     * @return void
     * @author David McClure
     **/
    protected function _testAllZero($table, $field)
    {
        $c  = $this->db->fetchRow(
            "SELECT COUNT(*) FROM {$table->getTableName()} "
            . "WHERE $field != 0;"
        );
        $this->assertEquals(0, $c['COUNT(*)']);
    }


}
