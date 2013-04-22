<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTableTest_FindBySlug extends Neatline_TestCase
{


    /**
     * `findBySlug` should return the exhibit with the passed slug.
     */
    public function testFindBySlug()
    {
        $exhibit = $this->__exhibit('test-slug');
        $retrieved = $this->__exhibits->findBySlug('test-slug');
        $this->assertEquals($retrieved->id, $exhibit->id);
    }


    /**
     * `findBySlug` should escape input before passing it to SQL.
     */
    public function testFindBySlugEscaping()
    {
        $exhibit = $this->__exhibit('---slug-1-');
        $retrievedExhibit = $this->__exhibits->findBySlug('"; err;');
        $this->assertNull($retrievedExhibit);
    }


}
