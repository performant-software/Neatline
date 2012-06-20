<?php
/**
 * Tests the total_neatlines helper.
 */
class TotalNeatlinesTest extends Neatline_Test_AppTestCase {

    public function testTotalNeatlines()
    {

        $this->dispatch('neatline-exhibits');
        $this->assertEquals(0, total_neatlines());
        
        $neatlineOne = $this->_createNeatline();
        $this->assertEquals(1, total_neatlines());
        
        $neatlineTwo = $this->_createNeatline('New Neatline', 'New neatline', 'new-neatline');
        $this->assertEquals(2, total_neatlines());

        $neatlineTwo->delete();
        $this->assertEquals(1, total_neatlines());

    }
}
