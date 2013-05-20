<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_Save extends Neatline_TestCase
{


    /**
     * `save` should compile an Omeka item reference.
     */
    public function testCompileItem()
    {

        $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                )
            )
        ));

        $record = new NeatlineRecord(null, $item);
        $record->save();

        // Should compile `title` and `body`.
        $this->assertNotNull($record->title);
        $this->assertNotNull($record->body);

    }


    /**
     * `save` should compile the coverage when a WMS layer is defined.
     */
    public function testCompileWms()
    {

        $record = new NeatlineRecord();
        $record->setArray(array(
            'wms_address'   => 'address',
            'wms_layers'    => 'layers'
        ));

        $record->save();

        // Should flip `is_coverage` and `is_wms`.
        $this->assertEquals($record->is_coverage, 1);
        $this->assertEquals($record->is_wms, 1);

        // Should compile `coverage`.
        $this->assertNotNull($record->coverage);

    }


}
