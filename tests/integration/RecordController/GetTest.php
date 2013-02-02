<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for GET action in record API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordControllerTest_Get
    extends Neatline_Test_AppTestCase
{


    /**
     * GET should emit a JSON representation of a single record.
     */
    public function testGet()
    {

        $exhibit    = $this->__exhibit();
        $record     = $this->__record($exhibit);

        // Hit /record/:id.
        $this->dispatch('neatline/record/'.$record->id);
        $response = $this->getResponseArray();
        $this->assertResponseCode(200);

        // Should emit static fields.
        $this->assertObjectHasAttribute('id',       $response);
        $this->assertObjectHasAttribute('item_id',  $response);
        $this->assertObjectHasAttribute('title',    $response);
        $this->assertObjectHasAttribute('body',     $response);
        $this->assertObjectHasAttribute('coverage', $response);
        $this->assertObjectHasAttribute('svg',      $response);
        $this->assertObjectHasAttribute('tags',     $response);
        $this->assertObjectHasAttribute('slug',     $response);

        // Should emit styles.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertObjectHasAttribute($s, $response);
        }

    }


}
