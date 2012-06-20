<?php
/**
 * Tests the get_current_neatline() helper.
 */
class GetCurrentNeatlineTest extends Neatline_Test_AppTestCase
{

    public function testGetCurrentNeatline()
    {
        $this->_createNeatline();
        $this->dispatch('neatline-exhibits/show/test-exhibit');
        $neatline = get_current_neatline();
        $this->assertEquals('1', $neatline->id);
    }
}
