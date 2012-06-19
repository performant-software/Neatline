<?php
/**
 * Tests for the loop_neatlines helper.
 */
class LoopNeatlinesTest extends Omeka_Test_AppTestCase {

    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();

    }

    public function testNoLoopNeatlines()
    {

        $this->dispatch('neatline-exhibits');
        $this->assertEmpty(loop_neatlines());

    }

    public function testLoopNeatlines()
    {

        for ($i=1; $i<=5; $i++) {
          $this->helper->_createNeatline('Neatline '.$i, 'Neatline', 'neatline-'.$i);
        }

        $this->dispatch('neatline-exhibits');

        $this->assertNotEmpty(loop_neatlines());

    }
}
