<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for browse action in exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_Browse extends Neatline_TestCase
{


    /**
     * The index action (admin/neatline) should redirect to browse.
     */
    public function testIndexRedirect()
    {
        $this->dispatch('neatline');
        $this->assertModule('neatline');
        $this->assertController('exhibits');
        $this->assertAction('browse');
    }


    /**
     * Browse should display a button to create a new exhibit.
     */
    public function testBaseMarkup()
    {
        $this->dispatch('neatline');
        $this->assertXpath('//a[@href="'.url('neatline/add').'"]');
    }


    /**
     * Browse should display a list of exhibits with links to the public
     * show views and editor views.
     */
    public function testExhibitList()
    {

        $exhibit1 = $this->__exhibit('slug1');
        $exhibit2 = $this->__exhibit('slug2');
        $exhibit3 = $this->__exhibit('slug3');
        $exhibit1->title = "Exhibit 1";
        $exhibit2->title = "Exhibit 2";
        $exhibit3->title = "Exhibit 3";
        $exhibit1->save();
        $exhibit2->save();
        $exhibit3->save();

        $this->dispatch('neatline');
        // echo $this->getResponse()->getBody('default');

        // Should list 3 exhibits.
        $this->assertXpath('//table[@class="neatline"]/tbody/tr', 3);

        // Editor links.
        $this->assertXpathContentContains('//a[@class="editor"][@href="'.
            url('neatline/editor/'.$exhibit1->id).'"]', 'Exhibit 1');
        $this->assertXpathContentContains('//a[@class="editor"][@href="'.
            url('neatline/editor/'.$exhibit2->id).'"]', 'Exhibit 2');
        $this->assertXpathContentContains('//a[@class="editor"][@href="'.
            url('neatline/editor/'.$exhibit3->id).'"]', 'Exhibit 3');

        // Public view links.
        $this->assertXpath('//a[@class="public"][@href="'.
            public_url('neatline/show/slug1').'"]');
        $this->assertXpath('//a[@class="public"][@href="'.
            public_url('neatline/show/slug2').'"]');
        $this->assertXpath('//a[@class="public"][@href="'.
            public_url('neatline/show/slug3').'"]');

        // Exhibit settings links.
        $this->assertXpath('//a[@class="edit"][@href="'.
            url('neatline/edit/'.$exhibit1->id).'"]');
        $this->assertXpath('//a[@class="edit"][@href="'.
            url('neatline/edit/'.$exhibit2->id).'"]');
        $this->assertXpath('//a[@class="edit"][@href="'.
            url('neatline/edit/'.$exhibit3->id).'"]');

        // Import items links.
        $this->assertXpath('//a[@class="import"][@href="'.
            url('neatline/import/'.$exhibit1->id).'"]');
        $this->assertXpath('//a[@class="import"][@href="'.
            url('neatline/import/'.$exhibit2->id).'"]');
        $this->assertXpath('//a[@class="import"][@href="'.
            url('neatline/import/'.$exhibit3->id).'"]');

        // Delete links.
        $this->assertXpath('//a[@class="delete-confirm"][@href="'.
            url('neatline/delete-confirm/'.$exhibit1->id).'"]');
        $this->assertXpath('//a[@class="delete-confirm"][@href="'.
            url('neatline/delete-confirm/'.$exhibit2->id).'"]');
        $this->assertXpath('//a[@class="delete-confirm"][@href="'.
            url('neatline/delete-confirm/'.$exhibit3->id).'"]');

    }


    /**
     * When the number of exhibits is greater than the admin pagination
     * limit, the maximum number of exhibits that can fit on a page should
     * be listed and pagination links should be displayed.
     */
    public function testPagination()
    {

        // Create 4 exhibits, set paging limit = 2.
        for ($i=1; $i<5; $i++) $this->__exhibit('slug'.$i);
        set_option('per_page_admin', 2);

        // Page 1.
        $this->dispatch('neatline');

        // Should list first two exhibits.
        $this->assertXpath('//table[@class="neatline"]/tbody/tr', 2);
        $this->assertXpath('//a[@class="public"][@href="'.
            public_url('neatline/show/slug1').'"]');
        $this->assertXpath('//a[@class="public"][@href="'.
            public_url('neatline/show/slug2').'"]');

        // Should show pagination.
        $this->assertXpath('//div[@class="pagination"]');

        // Page 2.
        $this->resetResponse();
        $this->dispatch('neatline?page=2');

        // Should show next two exhibits.
        $this->assertXpath('//table[@class="neatline"]/tbody/tr', 2);
        $this->assertXpath('//a[@class="public"][@href="'.
            public_url('neatline/show/slug3').'"]');
        $this->assertXpath('//a[@class="public"][@href="'.
            public_url('neatline/show/slug4').'"]');

    }


}
