<?php
/**
 * Tests for the has_neatlines() helper.
 */
class HasNeatlinesTest extends Neatline_Test_AppTestCase
{   
    protected $_isAdminTest = true;

    /**
     * Shouldn't have any neatlines yet, since we haven't added any.
     */
    public function testHasNoNeatlines()
    {
        $this->dispatch('neatline-exhibits');
        $this->assertFalse(has_neatlines());
    }
    
    public function testHasNeatlines()
    {
        $this->_createNeatline();
        $this->dispatch('neatline-exhibits');
        $this->assertTrue(has_neatlines());
    }
}
