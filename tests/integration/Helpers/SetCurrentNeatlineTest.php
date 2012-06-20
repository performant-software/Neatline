<?php
/**
 * Tests for the set_current_neatline helper.
 */
class SetCurrentNeatlineTest extends Neatline_Test_AppTestCase {

    protected $_isAdminTest = true;

    public function testSetCurrentNeatlineTest()
    {
        $neatline = $this->_createNeatline();
        $this->dispatch('neatline-exhibits/show/test-exhibit');

        $newNeatline = $this->_createNeatline('New Neatline', 'foo', 'new-neatline');
        set_current_neatline($newNeatline);
        $this->assertEquals($newNeatline, get_current_neatline());
    }
}
