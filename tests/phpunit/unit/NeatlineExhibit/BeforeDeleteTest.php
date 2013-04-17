<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `beforeDelete` on `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_BeforeDelete extends Neatline_TestCase
{


    /**
     * `beforeDelete` should delete all child records.
     */
    public function testBeforeDelete()
    {

        $exhibit1   = $this->__exhibit();
        $exhibit2   = $this->__exhibit();
        $record1    = $this->__record($exhibit1);
        $record2    = $this->__record($exhibit1);
        $record3    = $this->__record($exhibit2);
        $record4    = $this->__record($exhibit2);

        $exhibit1->delete();

        // Should delete exhibit 1 records.
        $this->assertNull($this->__records->find($record1->id));
        $this->assertNull($this->__records->find($record2->id));

        // Should not delete exhibit 2 records.
        $this->assertNotNull($this->__records->find($record3->id));
        $this->assertNotNull($this->__records->find($record4->id));

    }


}
