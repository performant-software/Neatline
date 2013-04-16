<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for LIST action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_List extends Neatline_TestCase
{


    /**
     * Create exhibit, set parameter on request.
     */
    public function setUp()
    {

        parent::setUp();

        // Create exhibit.
        $this->exhibit = $this->__exhibit();

        // Set GET parameter.
        $this->request->setQuery(array(
          'exhibit_id' => $this->exhibit->id
        ));

    }


    /**
     * LIST should emit a JSON representation of a collection of records.
     */
    public function testGet()
    {

        $record = $this->__record($this->exhibit);

        $this->dispatch('neatline/records');
        $records = $this->getResponseArray()->records;

        // Should emit fields.
        $this->assertObjectHasAttribute('id',       $records[0]);
        $this->assertObjectHasAttribute('item_id',  $records[0]);
        $this->assertObjectHasAttribute('title',    $records[0]);
        $this->assertObjectHasAttribute('body',     $records[0]);
        $this->assertObjectHasAttribute('coverage', $records[0]);
        $this->assertObjectHasAttribute('tags',     $records[0]);

        // Should emit styles.
        foreach (_nl_getStyles() as $s) {
            $this->assertObjectHasAttribute($s, $records[0]);
        }

    }


    /**
     * LIST should only return records for the requested exhibit.
     */
    public function testExhibitFilter()
    {

        $exhibit2 = $this->__exhibit();
        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record3 = new NeatlineRecord($exhibit2);
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();
        $records = $response->records;

        // Should apply exhibit filter.
        $this->assertEquals($records[0]->id, $record2->id);
        $this->assertEquals($records[1]->id, $record1->id);
        $this->assertCount(2, $response->records);

    }


    /**
     * The `zoom` parameter should be passed to the query.
     */
    public function testZoomFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->min_zoom = 1;
        $record2->min_zoom = 2;

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'zoom' => 1
        ));

        // GET with zoom that excludes record 2.
        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `extent` parameter should be passed to the query.
     */
    public function testExtentFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->coverage = 'POINT(1 1)';
        $record2->coverage = 'POINT(3 3)';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
          'extent' => 'POLYGON((0 0,0 2,2 2,2 0,0 0))'
        ));

        // GET with extent that excludes record 2.
        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `limit` and `offset` parameters should be passed to the query.
     */
    public function testLimitFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record3 = new NeatlineRecord($this->exhibit);
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->request->setQuery(array(
            'limit' => 1,
            'offset' => 1
        ));

        // GET with limit that excludes records 1 and 3.
        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply limit filter.
        $this->assertEquals($response->records[0]->id, $record2->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `query` parameter should be passed to the query.
     */
    public function testKeywordsFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->title = 'neatline';
        $record2->title = 'omeka';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'query' => 'neatline'
        ));

        // GET with query that excludes record 2.
        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply query filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `tags` parameter should be passed to the query.
     */
    public function testTagsFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->tags = 'tag1, tag2';
        $record2->tags = 'tag3';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'tags' => array('tag1', 'tag2'))
        );

        // GET with query that excludes record 2.
        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply tags filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `widget` parameter should be passed to the query.
     */
    public function testWidgetFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->widgets = 'Widget1';
        $record2->widgets = 'Widget2';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'widget' => 'Widget1')
        );

        // GET with query that excludes record 2.
        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply tags filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


}
