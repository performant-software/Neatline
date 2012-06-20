<?php
/**
 * Tests for has_neatlines_for_loop helper.
 */
class HasNeatlinesForLoopTest extends Neatline_Test_AppTestCase {

    /**
     * Shouldn't have neatlines for loop, since we haven't created any.
     */
    public function testHasNoNeatlinesForLoop()
    {

        $this->dispatch('neatline-exhibits');
        $this->assertFalse(has_neatlines_for_loop());

    }

    /**
     * Creates a neatline, then checks to see if helper returns true.
     */
    public function testHasNeatlinesForLoop()
    {

        $this->_createNeatline();
        $this->dispatch('neatline-exhibits');
        $this->assertTrue(has_neatlines_for_loop());

    }

    /**
     * Tests if helper returns false, if loop for neatlines is reset.
     */
    public function testHasNoNeatlinesForLoopAfterReset()
    {

        $this->_createNeatline();
        $this->dispatch('neatline-exhibits');
        $this->assertTrue(has_neatlines_for_loop());

        $neatlines = array();
        set_neatlines_for_loop($neatlines);
        $this->assertFalse(has_neatlines_for_loop());

    }
}
