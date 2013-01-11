<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for browse action in index controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexControllerTest_Browse
    extends Neatline_Test_AppTestCase
{


    /**
     * The index action (admin/neatline) should redirect to browse.
     */
    public function testIndexRedirect()
    {
        $this->dispatch('neatline');
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('browse');
    }


    /**
     * Browse should display a button to create a new exhibit.
     */
    public function testBrowseBaseMarkup()
    {
        $this->dispatch('neatline');
        $this->assertXpath('//a[@href="'.url('neatline/add').'"]');
    }


    /**
     * Browse should display a list of exhibits with links to the public
     * show views and editor views.
     */
    public function testBrowseExhibitList()
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

        // Should show 3 exhibit rows.
        $this->assertQueryCount('table.neatline tbody tr', 3);

        // Should show exhibit titles.
        $this->assertQueryContentContains(
            'table.neatline tbody td.title',
            'Exhibit 1');
        $this->assertQueryContentContains(
            'table.neatline tbody td.title',
            'Exhibit 2');
        $this->assertQueryContentContains(
            'table.neatline tbody td.title',
            'Exhibit 3');

        // Should show links to public views.
        $this->assertXpath('//td[@class="title"]/a[@href="'.
            public_url('neatline/show/slug1').'"]');
        $this->assertXpath('//td[@class="title"]/a[@href="'.
            public_url('neatline/show/slug2').'"]');
        $this->assertXpath('//td[@class="title"]/a[@href="'.
            public_url('neatline/show/slug3').'"]');

        // Should show links to editor.
        $this->assertXpath('//td[@class="edit"]/a[@href="'.
            url('neatline/editor/'.$exhibit1->id).'"]');
        $this->assertXpath('//td[@class="edit"]/a[@href="'.
            url('neatline/editor/'.$exhibit2->id).'"]');
        $this->assertXpath('//td[@class="edit"]/a[@href="'.
            url('neatline/editor/'.$exhibit3->id).'"]');

    }


    /**
     * When the number of exhibits is greater than the admin pagination
     * limit, the maximum number of exhibits that can fit on a page should
     * be listed and pagination links should be displayed.
     */
    public function testBrowsePagination()
    {

        // Create 4 exhibits, set paging limit = 2.
        for ($i=1; $i<5; $i++) $this->__exhibit('slug'.$i);
        set_option('per_page_admin', 2);

        // Page 1.
        $this->dispatch('neatline');

        // Should show first two exhibits.
        $this->assertQueryCount('table.neatline tbody tr', 2);
        $this->assertXpath('//td[@class="title"]/a[@href="'.
            public_url('neatline/show/slug1').'"]');
        $this->assertXpath('//td[@class="title"]/a[@href="'.
            public_url('neatline/show/slug2').'"]');

        // Should show pagination.
        $this->assertQuery('div.pagination');

        // Page 2.
        $this->resetResponse();
        $this->dispatch('neatline?page=2');

        // Should show next two exhibits.
        $this->assertQueryCount('table.neatline tbody tr', 2);
        $this->assertXpath('//td[@class="title"]/a[@href="'.
            public_url('neatline/show/slug3').'"]');
        $this->assertXpath('//td[@class="title"]/a[@href="'.
            public_url('neatline/show/slug4').'"]');

    }


}
