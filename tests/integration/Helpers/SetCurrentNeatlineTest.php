<?php
/**
 * Tests for the set_current_neatline helper.
 */
class SetCurrentNeatlineTest extends Omeka_Test_AppTestCase {

    protected $_isAdminTest = true;

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    public function testSetCurrentNeatlineTest()
    {
        $neatline = $this->helper->_createNeatline();
        $this->dispatch('neatline-exhibits/show/test-exhibit');

        $newNeatline = $this->helper->_createNeatline('New Neatline', 'foo', 'new-neatline');
        set_current_neatline($newNeatline);
        $this->assertEquals($newNeatline, get_current_neatline());
    }
}
