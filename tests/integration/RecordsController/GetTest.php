<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for GET action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsControllerTest_Get
    extends Neatline_Test_AppTestCase
{


    /**
     * GET should emit a JSON object containing data for a single record.
     */
    public function testGet()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record = $this->__record($exhibit);

        // Hit /records.
        $this->dispatch('neatline/records/'.$record->id);

        // Capture response.
        $response = json_decode($this->getResponse()->getBody('default'));

        // Check code.
        $this->assertResponseCode(200);

        // Check for keys.
        $this->assertObjectHasAttribute('id',               $response);
        $this->assertObjectHasAttribute('item_id',          $response);
        $this->assertObjectHasAttribute('title',            $response);
        $this->assertObjectHasAttribute('body',             $response);
        $this->assertObjectHasAttribute('slug',             $response);
        $this->assertObjectHasAttribute('vector_color',     $response);
        $this->assertObjectHasAttribute('stroke_color',     $response);
        $this->assertObjectHasAttribute('select_color',     $response);
        $this->assertObjectHasAttribute('vector_opacity',   $response);
        $this->assertObjectHasAttribute('select_opacity',   $response);
        $this->assertObjectHasAttribute('stroke_opacity',   $response);
        $this->assertObjectHasAttribute('image_opacity',    $response);
        $this->assertObjectHasAttribute('stroke_width',     $response);
        $this->assertObjectHasAttribute('point_radius',     $response);
        $this->assertObjectHasAttribute('point_image',      $response);
        $this->assertObjectHasAttribute('min_zoom',         $response);
        $this->assertObjectHasAttribute('max_zoom',         $response);
        $this->assertObjectHasAttribute('map_focus',        $response);
        $this->assertObjectHasAttribute('coverage',         $response);
        $this->assertObjectHasAttribute('wmsAddress',       $response);
        $this->assertObjectHasAttribute('layers',           $response);

    }


}
