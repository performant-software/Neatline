<?php
/**
 * Tests for get_neatlines_for_loop helper.
 */
class GetNeatlinesForLoopTest extends Omeka_Test_AppTestCase {

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    public function testGetNeatlinesForLoop()
    {

        for ($i = 1; $i < 11; $i++) {
            $this->helper->_createNeatline('Neatline '.$i, '','neatline-'.$i);
        }

        $this->dispatch('neatline-exhibits');

        $neatlines = get_neatlines_for_loop();
        $this->assertEquals(10, count($neatlines));

    }
}
