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

    /**
     * Records JSON for map (INDEX and GET responses).
     *
     * @return void.
     */
    public function testRecordsJson()
    {


        // Exhibit and records.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record(null, $exhibit);
        $record2 = $this->__record(null, $exhibit);
        $record3 = $this->__record(null, $exhibit);


        // Case 1: 3 records, 1 and 2 map-active, 3 map-inactive.
        // ------------------------------------------------------

        $record1->title = 'Record 1';
        $record2->title = 'Record 2';
        $record3->title = 'Record 3';

        $record1->description = 'Record 1 desc.';
        $record2->description = 'Record 2 desc.';
        $record3->description = 'Record 3 desc.';

        // No default focus/zoom for records 2 and 3.
        $record1->map_focus = '100,200';
        $record1->map_zoom = 10;

        // Record 3 inactive.
        $record1->map_active = 1;
        $record2->map_active = 1;
        $record3->map_active = 0;

        $record1->vector_color = '#111111';
        $record2->vector_color = '#222222';
        $record3->vector_color = '#333333';

        $record1->stroke_color = '#444444';
        $record2->stroke_color = '#555555';
        $record3->stroke_color = '#666666';

        $record1->select_color = '#777777';
        $record2->select_color = '#888888';
        $record3->select_color = '#999999';

        $record1->vector_opacity = 1;
        $record2->vector_opacity = 2;
        $record3->vector_opacity = 3;

        $record1->select_opacity = 4;
        $record2->select_opacity = 5;
        $record3->select_opacity = 6;

        $record1->stroke_opacity = 7;
        $record2->stroke_opacity = 8;
        $record3->stroke_opacity = 9;

        $record1->graphic_opacity = 10;
        $record2->graphic_opacity = 11;
        $record3->graphic_opacity = 12;

        $record1->stroke_width = 13;
        $record2->stroke_width = 14;
        $record3->stroke_width = 15;

        $record1->point_radius = 16;
        $record2->point_radius = 17;
        $record3->point_radius = 18;

        $record1->min_zoom = 19;
        $record2->min_zoom = 20;
        $record3->min_zoom = 21;

        $record1->max_zoom = 22;
        $record2->max_zoom = 23;
        $record3->max_zoom = 24;

        $record1->point_image = 'https://www.google.com/favicon.ico';
        $record2->point_image = 'http://en.wikipedia.org/favicon.ico';
        $record3->point_image = 'http://www.amazon.com/favicon.ico';

        $record1->save('POINT(1 2)');
        $record2->save('POINT(3 4)');
        $record3->save('POINT(5 6)');

        // Generate the fixture.
        $this->request->setQuery(array('id' => $exhibit->id));
        $this->writeFixture('neatline/records',
            'coll.default.json');


        // Case 2: Data for record 2 has changed.
        // --------------------------------------

        $record2->save('POINT(7 8)');

        // Generate the fixture.
        $this->resetResponse();
        $this->writeFixture('neatline/records',
            'coll.changed.json');


        // Case 2: Record 2 is absent from the set.
        // ----------------------------------------

        $record2->delete();

        // Generate the fixture.
        $this->resetResponse();
        $this->writeFixture('neatline/records',
            'coll.removed.json');


    }

    /**
     * JSON for individual records (GET response).
     *
     * @return void.
     */
    public function testRecordJson()
    {


        // Exhibit.
        $exhibit = $this->__exhibit();

        // Record.
        $record = $this->__record(null, $exhibit);
        $record->title = 'Record 4';
        $record->description = 'Record 4 desc.';
        $record->map_focus = '100,200';
        $record->map_zoom = 10;
        $record->map_active = 1;
        $record->vector_color = '#111111';
        $record->stroke_color = '#444444';
        $record->select_color = '#777777';
        $record->vector_opacity = 1;
        $record->select_opacity = 4;
        $record->stroke_opacity = 7;
        $record->graphic_opacity = 10;
        $record->stroke_width = 13;
        $record->point_radius = 16;
        $record->min_zoom = 19;
        $record->max_zoom = 22;
        $record->point_image = 'https://www.google.com/favicon.ico';
        $record->save('POINT(6 7)');


        // Case 1: Map active.
        // -------------------

        // Generate the fixture.
        $this->writeFixture('neatline/records/'.$record->id,
            'record.default.json');


        // Case 1: Map inactive.
        // ---------------------

        $record->map_active = 0;
        $record->save();

        // Generate the fixture.
        $this->resetResponse();
        $this->writeFixture('neatline/records/'.$record->id,
            'record.inactive.json');


    }

    /**
     * Core Neatline partial markup.
     *
     * @return void.
     */
    public function testNeatlinePartial()
    {
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
        $this->writeFixture('neatline/fixtures/editor',
            'editor-partial.html');
    }

}
