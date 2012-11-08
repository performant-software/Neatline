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
    public function testMapRecordsJson()
    {

        // Exhibit and records.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record(null, $exhibit);
        $record2 = $this->__record(null, $exhibit);

        // Populate parameters.
        $record1->map_active = 1;
        $record2->map_active = 1;
        $record1->vector_color = '#111111';
        $record2->vector_color = '#222222';
        $record1->stroke_color = '#333333';
        $record2->stroke_color = '#444444';
        $record1->highlight_color = '#555555';
        $record2->highlight_color = '#666666';
        $record1->vectory_opacity = 1;
        $record2->vectory_opacity = 2;
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
        $record1->save();
        $record2->save();

        // Generate the fixture.
        $this->writeFixture('neatline-exhibits/data/'.$exhibit->id,
            'map-records.json');

    }

}
