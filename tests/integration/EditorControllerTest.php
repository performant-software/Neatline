<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Editor controller integration tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_EditorControllerTest extends Neatline_Test_AppTestCase
{

    /**
     * /records should emit a JSON object containing all record data
     * needed by the editor.
     *
     * @return void.
     */
    public function testRecords()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record(null, $exhibit);
        $record2 = $this->__record(null, $exhibit);

        // Hit data route.
        $this->dispatch('neatline/editor/records/'.$exhibit->id);
        $response = json_decode($this->getResponse()->getBody('default'));

        // Check code and length.
        $this->assertResponseCode(200);
        $this->assertEquals(count($response), 2);

        // Check for keys.
        $this->assertObjectHasAttribute('id',                 $response[0]);
        $this->assertObjectHasAttribute('item_id',            $response[0]);
        $this->assertObjectHasAttribute('title',              $response[0]);
        $this->assertObjectHasAttribute('description',        $response[0]);
        $this->assertObjectHasAttribute('slug',               $response[0]);
        $this->assertObjectHasAttribute('vector_color',       $response[0]);
        $this->assertObjectHasAttribute('stroke_color',       $response[0]);
        $this->assertObjectHasAttribute('select_color',       $response[0]);
        $this->assertObjectHasAttribute('vector_opacity',     $response[0]);
        $this->assertObjectHasAttribute('select_opacity',     $response[0]);
        $this->assertObjectHasAttribute('stroke_opacity',     $response[0]);
        $this->assertObjectHasAttribute('graphic_opacity',    $response[0]);
        $this->assertObjectHasAttribute('stroke_width',       $response[0]);
        $this->assertObjectHasAttribute('point_radius',       $response[0]);
        $this->assertObjectHasAttribute('point_image',        $response[0]);
        $this->assertObjectHasAttribute('map_focus',          $response[0]);
        $this->assertObjectHasAttribute('coverage',           $response[0]);
        $this->assertObjectHasAttribute('wmsAddress',         $response[0]);
        $this->assertObjectHasAttribute('layers',             $response[0]);

    }

    /**
     * /form should update a record on PUT.
     *
     * @return void.
     */
    public function testFormPUT()
    {

        // Create record.
        $exhibit = $this->__exhibit();
        $record = $this->__record();

        // Set parameters.
        $record->title            = 'title';
        $record->description      = 'desc';
        $record->slug             = 'slug';
        $record->vector_color     = '#vector';
        $record->stroke_color     = '#stroke';
        $record->select_color     = '#select';
        $record->vector_opacity   = 1;
        $record->select_opacity   = 2;
        $record->stroke_opacity   = 3;
        $record->graphic_opacity  = 4;
        $record->stroke_width     = 5;
        $record->point_radius     = 6;
        $record->point_image      = 'file.png';
        $record->map_focus        = 'lat/lon';
        $record->map_zoom         = 7;
        $record->geocoverage      = 'kml';
        $record->map_active       = 1;
        $record->save();

        // Mock values.
        $values = array(
            'id'                  => $record->id,
            'item_id'             => null,
            'title'               => 'title2',
            'description'         => 'desc2',
            'slug'                => 'slug2',
            'vector_color'        => '#vector2',
            'stroke_color'        => '#stroke2',
            'select_color'        => '#select2',
            'vector_opacity'      => '10',
            'select_opacity'      => '20',
            'stroke_opacity'      => '30',
            'graphic_opacity'     => '40',
            'stroke_width'        => '50',
            'point_radius'        => '60',
            'point_image'         => 'file2.png',
            'map_focus'           => 'lat2/lon2',
            'map_zoom'            => '70',
            'geocoverage'         => 'kml2',
            'map_active'          => '0'
        );

        // Mock PUT.
        $this->writePut($values);

        // Issue request.
        $this->request->setMethod('PUT');
        $this->dispatch('neatline/editor/form');

        // Re-get record.
        $record = $this->_recordsTable->find($record->id);

        // Check new values.
        $this->assertEquals($record->title, 'title2');
        $this->assertEquals($record->description, 'desc2');
        $this->assertEquals($record->slug, 'slug2');
        $this->assertEquals($record->vector_color, '#vector2');
        $this->assertEquals($record->stroke_color, '#stroke2');
        $this->assertEquals($record->select_color, '#select2');
        $this->assertEquals($record->vector_opacity, 10);
        $this->assertEquals($record->select_opacity, 20);
        $this->assertEquals($record->stroke_opacity, 30);
        $this->assertEquals($record->graphic_opacity, 40);
        $this->assertEquals($record->stroke_width, 50);
        $this->assertEquals($record->point_radius, 60);
        $this->assertEquals($record->point_image, 'file2.png');
        $this->assertEquals($record->map_focus, 'lat2/lon2');
        $this->assertEquals($record->map_zoom, 70);
        $this->assertEquals($record->geocoverage, 'kml2');
        $this->assertEquals($record->map_active, 0);

    }

}
