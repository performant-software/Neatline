<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Fixture generation routines.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_FixtureBuilderTest extends Neatline_Test_AppTestCase
{

    protected $_isAdminTest = false;
    private $path_to_fixtures = null;

    /**
     * Records JSON for map.
     *
     * @return void.
     */
    public function testRecordsJson()
    {

        // Exhibit and records.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record(null, $exhibit);
        $record2 = $this->__record(null, $exhibit);

        // Read KML files.
        $nyc = file_get_contents(NEATLINE_PLUGIN_DIR .
            '/tests/mocks/nyc.kml');
        $boston = file_get_contents(NEATLINE_PLUGIN_DIR .
            '/tests/mocks/boston.kml');

        // Populate parameters.
        $record1->title = 'Record 1';
        $record2->title = 'Record 2';
        $record1->description = 'Record 1 desc.';
        $record2->description = 'Record 2 desc.';
        $record1->coverage = $nyc;
        $record2->coverage = $boston;
        $record1->map_active = 1;
        $record2->map_active = 1;
        $record1->vector_color = '#111111';
        $record2->vector_color = '#222222';
        $record1->stroke_color = '#333333';
        $record2->stroke_color = '#444444';
        $record1->select_color = '#555555';
        $record2->select_color = '#666666';
        $record1->vector_opacity = 1;
        $record2->vector_opacity = 2;
        $record1->select_opacity = 3;
        $record2->select_opacity = 4;
        $record1->stroke_opacity = 5;
        $record2->stroke_opacity = 6;
        $record1->graphic_opacity = 7;
        $record2->graphic_opacity = 8;
        $record1->stroke_width = 9;
        $record2->stroke_width = 10;
        $record1->point_radius = 11;
        $record2->point_radius = 12;
        $record1->point_image = 'file1.png';
        $record2->point_image = 'file2.png';
        $record1->save();
        $record2->save();

        // Generate the fixture.
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.json');

    }

    /**
     * Core Neatline partial markup.
     *
     * @return void.
     */
    public function testNeatlinePartial()
    {

        // Generate the fixture.
        $this->writeFixture('neatline/fixtures/neatline',
            'neatline-partial.html');

    }

    /**
     * Editor partial markup.
     *
     * @return void.
     */
    public function testEditorPartial()
    {

        // Generate the fixture.
        $this->writeFixture('neatline/fixtures/editor',
            'editor-partial.html');

    }

}
