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

        $record = $this->__record(null, $item);
        $record->save();

        // Should compile title and body.
        $this->assertNotNull($record->title);
        $this->assertNotNull($record->body);

    }


}
