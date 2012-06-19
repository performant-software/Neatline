<?php
/**
 * Tests the total_neatlines helper.
 */
class TotalNeatlinesTest extends Omeka_Test_AppTestCase {

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    public function testTotalNeatlines()
    {

        $this->dispatch('neatline-exhibits');
        $this->assertEquals(0, total_neatlines());
        
        $neatlineOne = $this->helper->_createNeatline();
        $this->assertEquals(1, total_neatlines());
        
        $neatlineTwo = $this->helper->_createNeatline('New Neatline', 'New neatline', 'new-neatline');
        $this->assertEquals(2, total_neatlines());

        $neatlineTwo->delete();
        $this->assertEquals(1, total_neatlines());

    }
}
