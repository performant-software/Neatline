<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

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


    protected $_isAdminTest = false;


    /**
     * get_current_neatline() should return the exhibit currently bound to
     * the view.
     */
    public function testGetCurrentNeatline()
    {

        // Create exhibit, hit route.
        $exhibit = $this->__exhibit('test-exhibit');
        $this->dispatch('neatline/show/test-exhibit');

        // Get out view exhibit.
        $retrievedExhibit = get_current_neatline();
        $this->assertEquals($retrievedExhibit->id, $exhibit->id);

    }


    /**
     * has_neatlines_for_loop() should return false when there are no
     * exhibits.
     */
    public function testHasNoNeatlinesForLoop()
    {
        $this->dispatch('neatline');
        $this->assertFalse(has_neatlines_for_loop());
    }


    /**
     * has_neatlines_for_loop() should return true when there is at least
     * one exhibit.
     */
    public function testHasNeatlinesForLoop()
    {
        $this->__exhibit();
        $this->dispatch('neatline');
        $this->assertTrue(has_neatlines_for_loop());
    }


    /**
     * neatline() should return attribute values for the exhibit currently
     * bound to the view.
     */
    public function testNeatlineValue()
    {

        // Create exhibit, hit /show.
        $exhibit = $this->__exhibit('test-exhibit');
        $exhibit->title = 'Test Exhibit';
        $exhibit->description = 'Test description.';
        $exhibit->save();

        // Hit /show.
        $this->dispatch('neatline/show/test-exhibit');

        // Neatline Name
        $this->assertEquals('Test Exhibit', neatline('title'));
        $this->assertEquals('Test Exhibit', neatline('Title'));

        // Neatline Description
        $this->assertEquals('Test description.', neatline('description'));
        $this->assertEquals('Test description.', neatline('Description'));

        // Neatline ID
        $this->assertEquals($exhibit->id, neatline('id'));
        $this->assertEquals($exhibit->id, neatline('ID'));

        $this->assertEquals('test-exhibit', neatline('slug'));
        $this->assertEquals('test-exhibit', neatline('Slug'));

    }


    /**
     * total_neatlines() should return the total number of exhibits.
     */
    public function testTotalNeatlines()
    {

        $this->dispatch('neatline');
        $this->assertEquals(0, total_neatlines());

        $neatlineOne = $this->__exhibit();
        $this->assertEquals(1, total_neatlines());

        $neatlineTwo = $this->__exhibit();
        $this->assertEquals(2, total_neatlines());

        $neatlineTwo->delete();
        $this->assertEquals(1, total_neatlines());

    }


}
