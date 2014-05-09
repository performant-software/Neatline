<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTableTest_FindBySlug extends Neatline_Case_Default
{


    /**
     * `findBySlug` should return the exhibit with the passed slug.
     */
    public function testFindBySlug()
    {
        $exhibit = $this->_exhibit('test-slug');
        $retrieved = $this->_exhibits->findBySlug('test-slug');
        $this->assertEquals($exhibit->id, $retrieved->id);
    }


    /**
     * `findBySlug` should escape input before passing it to SQL.
     */
    public function testFindBySlugEscaping()
    {
        $exhibit = $this->_exhibit('---slug-1-');
        $retrievedExhibit = $this->_exhibits->findBySlug('"; err;');
        $this->assertNull($retrievedExhibit);
    }


}
