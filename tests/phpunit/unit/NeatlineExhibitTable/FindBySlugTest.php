<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `findBySlug` on `NeatlineExhibitTable`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTableTest_FindBySlug
    extends Neatline_Test_AppTestCase
{


    /**
     * `findBySlug` should return the exhibit with the passed slug.
     */
    public function testFindBySlug()
    {
        $exhibit = $this->__exhibit('test-slug');
        $retrieved = $this->_exhibitsTable->findBySlug('test-slug');
        $this->assertEquals($retrieved->id, $exhibit->id);
    }


    /**
     * `findBySlug` should escape input before passing it to SQL.
     */
    public function testFindBySlugEscaping()
    {
        $exhibit = $this->__exhibit('---slug-1-');
        $retrievedExhibit = $this->_exhibitsTable->findBySlug('"; err;');
        $this->assertNull($retrievedExhibit);
    }


}
