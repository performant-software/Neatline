<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for index action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsControllerTest_Index
    extends Neatline_Test_AppTestCase
{


    /**
     * INDEX should emit a JSON object containing all record data needed
     * by the front-end application.
     */
    public function testIndex()
    {

        // Create exhibit and records.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        // Hit /records.
        $this->request->setQuery(array('id' => $exhibit->id));
        $this->dispatch('neatline/records');

        // Capture response.
        $response = json_decode($this->getResponse()->getBody('default'));

        // Check code and length.
        $this->assertResponseCode(200);
        $this->assertEquals(count($response), 2);

        // Check for keys.
        $this->assertObjectHasAttribute('id',               $response[0]);
        $this->assertObjectHasAttribute('item_id',          $response[0]);
        $this->assertObjectHasAttribute('title',            $response[0]);
        $this->assertObjectHasAttribute('body',             $response[0]);
        $this->assertObjectHasAttribute('slug',             $response[0]);
        $this->assertObjectHasAttribute('vector_color',     $response[0]);
        $this->assertObjectHasAttribute('stroke_color',     $response[0]);
        $this->assertObjectHasAttribute('select_color',     $response[0]);
        $this->assertObjectHasAttribute('vector_opacity',   $response[0]);
        $this->assertObjectHasAttribute('select_opacity',   $response[0]);
        $this->assertObjectHasAttribute('stroke_opacity',   $response[0]);
        $this->assertObjectHasAttribute('image_opacity',    $response[0]);
        $this->assertObjectHasAttribute('stroke_width',     $response[0]);
        $this->assertObjectHasAttribute('point_radius',     $response[0]);
        $this->assertObjectHasAttribute('point_image',      $response[0]);
        $this->assertObjectHasAttribute('min_zoom',         $response[0]);
        $this->assertObjectHasAttribute('max_zoom',         $response[0]);
        $this->assertObjectHasAttribute('map_focus',        $response[0]);
        $this->assertObjectHasAttribute('coverage',         $response[0]);
        $this->assertObjectHasAttribute('wmsAddress',       $response[0]);
        $this->assertObjectHasAttribute('layers',           $response[0]);

    }


}
