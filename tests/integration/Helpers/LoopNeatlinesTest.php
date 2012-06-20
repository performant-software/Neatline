<?php
/**
 * Tests for the loop_neatlines helper.
 */
class LoopNeatlinesTest extends Neatline_Test_AppTestCase {

    public function testNoLoopNeatlines()
    {

        $this->dispatch('neatline-exhibits');
        $this->assertEmpty(loop_neatlines());

    }

    public function testLoopNeatlines()
    {

        for ($i=1; $i<=5; $i++) {
          $this->_createNeatline('Neatline '.$i, 'Neatline', 'neatline-'.$i);
        }

        $this->dispatch('neatline-exhibits');

        $this->assertNotEmpty(loop_neatlines());

    }
}
