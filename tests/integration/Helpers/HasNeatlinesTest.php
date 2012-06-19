<?php
/**
 * Tests for the has_neatlines() helper.
 */
class HasNeatlinesTest extends Omeka_Test_AppTestCase
{   
    protected $_isAdminTest = true;

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

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
        $this->helper->_createNeatline();
        $this->dispatch('neatline-exhibits');
        $this->assertTrue(has_neatlines());
    }
}
