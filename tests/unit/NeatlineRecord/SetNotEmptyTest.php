<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `setNotEmpty()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_SetNotEmpty
    extends Neatline_Test_AppTestCase
{


    /**
     * setNotEmpty() should set the field with the passed value when value
     * is not an empty string or NULL.
     */
    public function testSetNotEmptyWithNonEmptyValue()
    {
        $record = $this->__record();
        $record->setNotEmpty('title', 'title');
        $this->assertEquals($record->title, 'title');
    }


    /**
     * setNotEmpty() should set the field to NULL when the passed value is
     * an empty string or NULL.
     */
    public function testSetNotEmptyWithEmptyValue()
    {

        $record = $this->__record();

        // Empty string:
        $record->setNotEmpty('title', '');
        $this->assertNull($record->title);

        // Untrimmed empty string:
        $record->setNotEmpty('title', '  ');
        $this->assertNull($record->title);

        // Null:
        $record->setNotEmpty('title', null);
        $this->assertNull($record->title);

    }


}
