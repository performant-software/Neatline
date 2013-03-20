<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `saveForm` on `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_SaveForm extends Neatline_TestCase
{


    /**
     * `saveForm` should mass assign the input array to the record.
     */
    public function testFieldAssignment()
    {

        $record = $this->__record();

        $record->saveForm(array(
            'title'             => '1',
            'body'              => '2',
            'coverage'          => 'POINT(3 3)',
            'tags'              => '4',
            'map_focus'         => '5',
            'map_zoom'          => '6',
            'presenter'         => '7',
            'fill_color'        => '8',
            'select_color'      => '9',
            'stroke_color'      => '10',
            'fill_opacity'      => '11',
            'select_opacity'    => '12',
            'stroke_opacity'    => '13',
            'stroke_width'      => '14',
            'point_radius'      => '15',
            'point_image'       => '16',
            'max_zoom'          => '17',
            'min_zoom'          => '18'
        ));

        $this->assertEquals($record->title,             '1');
        $this->assertEquals($record->body,              '2');
        $this->assertEquals($record->coverage,          'POINT(3 3)');
        $this->assertEquals($record->tags,              '4');
        $this->assertEquals($record->map_focus,         '5');
        $this->assertEquals($record->map_zoom,          6);
        $this->assertEquals($record->presenter,         '7');
        $this->assertEquals($record->fill_color,        '8');
        $this->assertEquals($record->select_color,      '9');
        $this->assertEquals($record->stroke_color,      '10');
        $this->assertEquals($record->fill_opacity,      11);
        $this->assertEquals($record->select_opacity,    12);
        $this->assertEquals($record->stroke_opacity,    13);
        $this->assertEquals($record->stroke_width,      14);
        $this->assertEquals($record->point_radius,      15);
        $this->assertEquals($record->point_image,       '16');
        $this->assertEquals($record->max_zoom,          17);
        $this->assertEquals($record->min_zoom,          18);

    }


    /**
     * `saveForm` should assign the `item_id` field.
     */
    public function testItemId()
    {
        $record = $this->__record();
        $record->saveForm(array('item_id' => '1'));
        $this->assertEquals($record->item_id, 1);
    }


    /**
     * Empty/whitespace strings should be set as `null`.
     */
    public function testWhitespaceBlocking()
    {

        $record = $this->__record();

        // String field.
        $record->saveForm(array('fill_color' => ''));
        $this->assertNull($record->body);
        $record->saveForm(array('fill_color' => ' '));
        $this->assertNull($record->body);

        // Number field.
        $record->saveForm(array('max_zoom' => ''));
        $this->assertNull($record->max_zoom);
        $record->saveForm(array('max_zoom' => ' '));
        $this->assertNull($record->max_zoom);

    }


    /**
     * CSS rule-sets on the parent exhibit with selectors that are tagged
     * on the record should be updated with the new record values.
     */
    public function testUpdateExhibitStyles()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              fill-color: 1;
            }
        ";
        $exhibit->save();
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag';

        // Save form with new `fill_color`.
        $record->saveForm(array('fill_color' => '2'));
        $exhibit = $this->reload($exhibit);

        // Should update CSS.
        $this->assertEquals(_nl_readCSS($exhibit->styles), array(
            'tag' => array(
                'fill_color' => '2'
            )
        ));

    }


    /**
     * The exhibit CSS - newly updated with values from the saved record -
     * should be pushed out to all other records in the exhibit.
     */
    public function testPushStyles()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              fill-color: 1;
            }
        ";
        $exhibit->save();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        // Save record 1 with new `fill_color`.
        $record1->saveForm(array('fill_color' => '2'));
        $record2 = $this->reload($record2);

        // Should update record 2.
        $this->assertEquals($record2->fill_color, '2');

    }


    /**
     * When a record is saved with _new_ tags - eg., when the tags string
     * used to be `tag1`, and is changed to `tag1,tag2` - the existing CSS
     * rules for the `tag2` should be applied to the record before it is
     * used to update the exhibit CSS.
     */
    public function testPullStyles()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              fill-color: 1;
            }
        ";
        $exhibit->save();

        // Record 1 synchronized with CSS.
        $record1 = new NeatlineRecord($exhibit);
        $record1->fill_color = '1';
        $record1->tags = 'tag';
        $record1->save();

        // Record 2 not synchronized.
        $record2 = new NeatlineRecord($exhibit);
        $record2->fill_color = '2';
        $record2->save();

        // Add `tag` to record 2, along with un-synchronized style.
        $record2->saveForm(array('tags' => 'tag', 'fill_color' => '2'));
        $record1 = $this->reload($record1);
        $record2 = $this->reload($record2);

        // Record 1 should be unchanged.
        $this->assertEquals($record1->fill_color, '1');

        // Record 2 should pull `tag` styles.
        $this->assertEquals($record2->fill_color, '1');

    }


}
