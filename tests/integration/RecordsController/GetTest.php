<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for INDX action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsControllerTest_Get
    extends Neatline_Test_AppTestCase
{


    /**
     * GET should emit a JSON object containing a list of records with all
     * data needed by the front-end application.
     */
    public function testGet()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        // Hit /records, should return 200.
        $this->dispatch('neatline/records/'.$exhibit->id);
        $this->assertResponseCode(200);

        // Capture response, alias records.
        $response = $this->getResponseArray();
        $records  = $response->records;

        // Should emit fields.
        $this->assertObjectHasAttribute('id',       $records[0]);
        $this->assertObjectHasAttribute('item_id',  $records[0]);
        $this->assertObjectHasAttribute('title',    $records[0]);
        $this->assertObjectHasAttribute('body',     $records[0]);
        $this->assertObjectHasAttribute('coverage', $records[0]);
        $this->assertObjectHasAttribute('tags',     $records[0]);
        $this->assertObjectHasAttribute('slug',     $records[0]);

        // Should emit styles.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertObjectHasAttribute($s, $records[0]);
        }

    }


    /**
     * GET should only return records for the requested exhibit.
     */
    public function testExhibitFilter()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $record1  = $this->__record($exhibit1);
        $record2  = $this->__record($exhibit1);
        $record3  = $this->__record($exhibit2);

        // Hit /records for exhibit 1.
        $this->dispatch('neatline/records/'.$exhibit1->id);

        // Capture response, alias records.
        $response = $this->getResponseArray();
        $records  = $response->records;

        // Should apply exhibit filter.
        $this->assertEquals($records[0]->id, $record2->id);
        $this->assertEquals($records[1]->id, $record1->id);
        $this->assertCount(2 , $response->records);

    }


    /**
     * The `zoom` parameter should be passed to the query.
     */
    public function testZoomFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->min_zoom = 1;
        $record2->min_zoom = 2;

        $record1->save();
        $record2->save();

        // Set `zoom` parameter.
        $this->request->setQuery(array('zoom' => 1));

        // GET with zoom that excludes record 2.
        $this->dispatch('neatline/records/'.$exhibit->id);
        $response = $this->getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1 , $response->records);

    }


    /**
     * The `extent` parameter should be passed to the query.
     */
    public function testExtentFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->coverage = 'POINT(1 1)';
        $record2->coverage = 'POINT(3 3)';

        $record1->save();
        $record2->save();

        // Set `extent` parameter.
        $this->request->setQuery(array(
          'extent' => 'POLYGON((0 0,0 2,2 2,2 0,0 0))'
        ));

        // GET with extent that excludes record 2.
        $this->dispatch('neatline/records/'.$exhibit->id);
        $response = $this->getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1 , $response->records);

    }


    /**
     * The `limit` and `offset` parameters should be passed to the query.
     */
    public function testLimitFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);
        $record3 = $this->__record($exhibit);

        // Set `limit` and `offset` parameters.
        $this->request->setQuery(array('limit' => 1, 'offset' => 1));

        // GET with limit that excludes records 1 and 3.
        $this->dispatch('neatline/records/'.$exhibit->id);
        $response = $this->getResponseArray();

        // Should apply limit filter.
        $this->assertEquals($response->records[0]->id, $record2->id);
        $this->assertCount(1 , $response->records);

    }


    /**
     * The `query` parameter should be passed to the query.
     */
    public function testKeywordsFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->title = 'neatline';
        $record2->title = 'omeka';

        $record1->save();
        $record2->save();

        // Set `query` parameter.
        $this->request->setQuery(array('query' => 'neatline'));

        // GET with query that excludes record 2.
        $this->dispatch('neatline/records/'.$exhibit->id);
        $response = $this->getResponseArray();

        // Should apply query filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1 , $response->records);

    }


    /**
     * The `tags` parameter should be passed to the query.
     */
    public function testTagsFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1, tag2';
        $record2->tags = 'tag3';

        $record1->save();
        $record2->save();

        // Set `tags` parameter.
        $this->request->setQuery(array('tags' => array('tag1', 'tag2')));

        // GET with query that excludes record 2.
        $this->dispatch('neatline/records/'.$exhibit->id);
        $response = $this->getResponseArray();

        // Should apply tags filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1 , $response->records);

    }


}
