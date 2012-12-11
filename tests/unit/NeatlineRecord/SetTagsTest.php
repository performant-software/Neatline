<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `setTags()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_SetTags
    extends Neatline_Test_AppTestCase
{


    /**
     * setTags() should use the comma-delimited `tags` string to point
     * each tag key reference to the first tag in the depth chart for
     * which there is a non-null value for the style in question.
     *
     * @group tags
     */
    public function testSetTags()
    {

        // Create record.
        $exhibit = $this->__exhibit();
        $record = $this->__record(null, $exhibit);

        // Set tags string.
        $record->tags = 't2,t3,t4,t5,t6,t7,t8,t9,t10,t11';

        // Create 12 tags, each with a different field defined.
        // ----------------------------------------------------

        $tag1 = new NeatlineTag($exhibit);
        $tag1->vector_color = '#1';
        $tag1->tag = 't1';
        $tag1->save();

        $tag2 = new NeatlineTag($exhibit);
        $tag2->stroke_color = '#2';
        $tag2->tag = 't2';
        $tag2->save();

        $tag3 = new NeatlineTag($exhibit);
        $tag3->select_color = '#3';
        $tag3->tag = 't3';
        $tag3->save();

        $tag4 = new NeatlineTag($exhibit);
        $tag4->vector_opacity = 4;
        $tag4->tag = 't4';
        $tag4->save();

        $tag5 = new NeatlineTag($exhibit);
        $tag5->select_opacity = 5;
        $tag5->tag = 't5';
        $tag5->save();

        $tag6 = new NeatlineTag($exhibit);
        $tag6->stroke_opacity = 6;
        $tag6->tag = 't6';
        $tag6->save();

        $tag7 = new NeatlineTag($exhibit);
        $tag7->image_opacity = 7;
        $tag7->tag = 't7';
        $tag7->save();

        $tag8 = new NeatlineTag($exhibit);
        $tag8->stroke_width = 8;
        $tag8->tag = 't8';
        $tag8->save();

        $tag9 = new NeatlineTag($exhibit);
        $tag9->point_radius = 9;
        $tag9->tag = 't9';
        $tag9->save();

        $tag10 = new NeatlineTag($exhibit);
        $tag10->point_image = '10.png';
        $tag10->tag = 't10';
        $tag10->save();

        $tag11 = new NeatlineTag($exhibit);
        $tag11->max_zoom = 11;
        $tag11->tag = 't11';
        $tag11->save();

        // Exhibit tag.
        $tag12 = new NeatlineTag($exhibit);
        $tag12->min_zoom = 12;
        $tag12->tag = 't12';
        $tag12->save();

        // Set tag1 the record tag.
        $record->tag_id = $tag1->id;
        $record->save();

        // Set tag12 the exhibit tag.
        $exhibit->tag_id = $tag12->id;
        $exhibit->save();

        // Update keys.
        $record->setTags();

        // Check the references.
        $this->assertEquals($record->vector_color,      $tag1->id);
        $this->assertEquals($record->stroke_color,      $tag2->id);
        $this->assertEquals($record->select_color,      $tag3->id);
        $this->assertEquals($record->vector_opacity,    $tag4->id);
        $this->assertEquals($record->select_opacity,    $tag5->id);
        $this->assertEquals($record->stroke_opacity,    $tag6->id);
        $this->assertEquals($record->image_opacity,     $tag7->id);
        $this->assertEquals($record->stroke_width,      $tag8->id);
        $this->assertEquals($record->point_radius,      $tag9->id);
        $this->assertEquals($record->point_image,       $tag10->id);
        $this->assertEquals($record->max_zoom,          $tag11->id);
        $this->assertEquals($record->min_zoom,          $tag12->id);

    }


}
