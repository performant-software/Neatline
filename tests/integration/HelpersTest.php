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

    /**
     * get_current_neatline() should return the current exhibit object on
     * the view.
     *
     * @return void.
     */
    public function testGetCurrentNeatline()
    {

        // Create exhibit, hit route.
        $exhibit = $this->__exhibit('test-exhibit');
        $this->dispatch('neatline-exhibits/show/test-exhibit');

        // Get out view exhibit.
        $retrievedExhibit = get_current_neatline();
        $this->assertEquals($retrievedExhibit->id, $exhibit->id);

    }

    /**
     * get_neatlines_for_loop() should an array of exhibit objects.
     *
     * @return void.
     */
    public function testGetNeatlinesForLoop()
    {

        // Create exhibits, hit route.
        for ($i = 0; $i < 10; $i++)$this->__exhibit();
        $this->dispatch('neatline-exhibits');

        // Check for 10 exhibits.
        $exhibits = get_neatlines_for_loop();
        $this->assertEquals(10, count($exhibits));

    }

    /**
     * has_neatlines_for_loop() should return false when there are no
     * exhibits.
     *
     * @return void.
     */
    public function testHasNoNeatlinesForLoop()
    {
        $this->dispatch('neatline-exhibits');
        $this->assertFalse(has_neatlines_for_loop());
    }

    /**
     * has_neatlines_for_loop() should return true when there is at least
     * one exhibit.
     *
     * @return void.
     */
    public function testHasNeatlinesForLoop()
    {
        $this->__exhibit();
        $this->dispatch('neatline-exhibits');
        $this->assertTrue(has_neatlines_for_loop());
    }

    /**
     * has_neatlines() should return false when there are not exhibits.
     *
     * @return void.
     */
    public function testHasNoNeatlines()
    {
        $this->dispatch('neatline-exhibits');
        $this->assertFalse(has_neatlines());
    }

    /**
     * has_neatlines() should return true when there is at least one exhibit.
     *
     * @return void.
     */
    public function testHasNeatlines()
    {
        $this->__exhibit();
        $this->dispatch('neatline-exhibits');
        $this->assertTrue(has_neatlines());
    }

    /**
     * loop_neatlines() should return any empty array when there are no
     * exhibits.
     *
     * @return void.
     */
    public function testNoLoopNeatlines()
    {
        $this->dispatch('neatline-exhibits');
        $this->assertEmpty(loop_neatlines());
    }

    /**
     * loop_neatlines() should return any array of exhibits when there is at
     * least one exhibit.
     *
     * @return void.
     */
    public function testLoopNeatlines()
    {
        for ($i=1; $i<=5; $i++) $this->__exhibit();
        $this->dispatch('neatline-exhibits');
        $this->assertNotEmpty(loop_neatlines());
    }

    /**
     * neatline() should return object parameters for the current exhibit
     * object on the view.
     *
     * @return void.
     */
    public function testNeatlineValue()
    {

        // Create exhibit, hit /show.
        $neatline = $this->__exhibit('test-exhibit');
        $this->dispatch('neatline-exhibits/show/test-exhibit');

        // Neatline Name
        $this->assertEquals('Test Exhibit', neatline('title'));
        $this->assertEquals('Test Exhibit', neatline('Title'));

        // Neatline Description
        $this->assertEquals('Test description.', neatline('description'));
        $this->assertEquals('Test description.', neatline('Description'));

        // Neatline ID
        $this->assertEquals($neatline->id, neatline('id'));
        $this->assertEquals($neatline->id, neatline('ID'));

        $this->assertEquals('test-exhibit', neatline('slug'));
        $this->assertEquals('test-exhibit', neatline('Slug'));

    }

    /**
     * set_current_neatline() should set the current exhibit on the view.
     *
     * @return void.
     */
    public function testSetCurrentNeatlineTest()
    {

        // Create exhibit, hit /show.
        $exhibit = $this->__exhibit('test-exhibit');
        $this->dispatch('neatline-exhibits/show/test-exhibit');

        $newExhibit = $this->__exhibit();
        set_current_neatline($newExhibit);
        $this->assertEquals($newExhibit, get_current_neatline());

    }

    /**
     * set_neatlines_for_loop() should set an array of exhibit objects on
     * the view.
     *
     * @return void.
     */
    public function testSetNeatlinesForLoop()
    {

        // Create exhibit, hit item browse.
        $neatline = $this->__exhibit();
        $this->dispatch('items/browse');

        set_neatlines_for_loop(array($neatline));
        $this->assertTrue(in_array($neatline, get_neatlines_for_loop()));

    }

    /**
     * total_neatlines() should return a count of all the exhibits.
     *
     * @return void.
     */
    public function testTotalNeatlines()
    {

        $this->dispatch('neatline-exhibits');
        $this->assertEquals(0, total_neatlines());

        $neatlineOne = $this->__exhibit();
        $this->assertEquals(1, total_neatlines());

        $neatlineTwo = $this->__exhibit();
        $this->assertEquals(2, total_neatlines());

        $neatlineTwo->delete();
        $this->assertEquals(1, total_neatlines());

    }

}
