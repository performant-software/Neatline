<?php
/**
 * Unit tests for view helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_HelpersTest extends Neatline_Test_AppTestCase
{

    public function testGetCurrentNeatline()
    {
        $this->_createNeatline();
        $this->dispatch('neatline-exhibits/show/test-exhibit');
        $neatline = get_current_neatline();
        $this->assertEquals('1', $neatline->id);
    }

    public function testGetNeatlinesForLoop()
    {

        for ($i = 0; $i < 10; $i++) {
            $this->_createNeatline('Neatline '.$i, '', 'neatline-'.$i);
        }

        $this->dispatch('neatline-exhibits');

        $exhibits = get_neatlines_for_loop();
        $this->assertEquals(10, count($exhibits));

    }

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

    /**
     * Shouldn't have any neatlines yet, since we haven't added any.
     */
    public function testHasNoNeatlines()
    {
        $this->dispatch('neatline-exhibits');
        $this->assertFalse(has_neatlines());
    }

    public function testHasNeatlines()
    {
        $this->_createNeatline();
        $this->dispatch('neatline-exhibits');
        $this->assertTrue(has_neatlines());
    }

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

    /**
     * Tests whether neatline() returns the correct value.
     *
     * @uses neatline()
     **/
    public function testNeatlineValue()
    {

        $neatline = $this->_createNeatline();

        $this->dispatch('neatline-exhibits/show/test-exhibit');

        // Neatline Name
        $this->assertEquals('Test Exhibit', neatline('title'));
        $this->assertEquals('Test Exhibit', neatline('Title'));

        // Neatline Description
        $this->assertEquals('Test description.', neatline('description'));
        $this->assertEquals('Test description.', neatline('Description'));

        // Neatline ID
        $this->assertEquals('1', neatline('id'));
        $this->assertEquals('1', neatline('ID'));

        $this->assertEquals('test-exhibit', neatline('slug'));
        $this->assertEquals('test-exhibit', neatline('Slug'));

    }

    public function testSetCurrentNeatlineTest()
    {
        $neatline = $this->_createNeatline();
        $this->dispatch('neatline-exhibits/show/test-exhibit');

        $newNeatline = $this->_createNeatline('New Neatline', 'foo', 'new-neatline');
        set_current_neatline($newNeatline);
        $this->assertEquals($newNeatline, get_current_neatline());
    }

    /**
     * Tests setting neatlines for loop on the items/browse page, since there
     * are no neatline loops on that view by default.
     */
    public function testSetNeatlinesForLoop()
    {

        $neatline = $this->_createNeatline();
        $this->dispatch('items/browse');
        set_neatlines_for_loop(array($neatline));
        $this->assertTrue(in_array($neatline, get_neatlines_for_loop()));

    }

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
