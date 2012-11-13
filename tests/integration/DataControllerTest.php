<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Data controller integration tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_DataControllerTest extends Neatline_Test_AppTestCase
{

    /**
     * /records should emit a JSON object containing all record data
     * needed by the front-end application.
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
        $this->dispatch('neatline/data/'.$exhibit->id);
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

}
