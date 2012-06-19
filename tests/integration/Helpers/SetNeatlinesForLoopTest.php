<?php
/**
 * Tests for the set_neatlines_for_loop helper.
 */
class SetNeatlinesForLoopTest extends Omeka_Test_AppTestCase {

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    /**
     * Tests setting neatlines for loop on the items/browse page, since there
     * are no neatline loops on that view by default.
     */
    public function testSetNeatlinesForLoop()
    {

        $neatline = $this->helper->_createNeatline();
        $this->dispatch('items/browse');
        set_neatlines_for_loop(array($neatline));
        $this->assertTrue(in_array($neatline, get_neatlines_for_loop()));

    }

}
