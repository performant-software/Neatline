<?php
/**
 * Tests for get_neatlines_for_loop helper.
 */
class GetNeatlinesForLoopTest extends Neatline_Test_AppTestCase {

    public function testGetNeatlinesForLoop()
    {

        for ($i = 1; $i < 11; $i++) {
            $this->_createNeatline('Neatline '.$i, '','neatline-'.$i);
        }

        $this->dispatch('neatline-exhibits');

        $neatlines = get_neatlines_for_loop();
        $this->assertEquals(10, count($neatlines));

    }
}
