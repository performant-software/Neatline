<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
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
    public function testAssignFields()
    {

        $record = $this->__record();

        $record->saveForm(array(
            'title'             => '1',
            'body'              => '2',
            'coverage'          => 'POINT(3 3)',
            'tags'              => '4',
            'widgets'           => '5',
            'presenter'         => '6',
            'fill_color'        => '7',
            'select_color'      => '8',
            'stroke_color'      => '9',
            'fill_opacity'      => '10',
            'select_opacity'    => '11',
            'stroke_opacity'    => '12',
            'stroke_width'      => '13',
            'point_radius'      => '14',
            'zindex'            => '15',
            'weight'            => '16',
            'start_date'        => '17',
            'end_date'          => '18',
            'after_date'        => '19',
            'before_date'       => '20',
            'point_image'       => '21',
            'min_zoom'          => '22',
            'max_zoom'          => '23',
            'map_zoom'          => '24',
            'map_focus'         => '25'
        ));

        $this->assertEquals($record->title,             '1');
        $this->assertEquals($record->body,              '2');
        $this->assertEquals($record->coverage,          'POINT(3 3)');
        $this->assertEquals($record->tags,              '4');
        $this->assertEquals($record->widgets,           '5');
        $this->assertEquals($record->presenter,         '6');
        $this->assertEquals($record->fill_color,        '7');
        $this->assertEquals($record->select_color,      '8');
        $this->assertEquals($record->stroke_color,      '9');
        $this->assertEquals($record->fill_opacity,      10);
        $this->assertEquals($record->select_opacity,    11);
        $this->assertEquals($record->stroke_opacity,    12);
        $this->assertEquals($record->stroke_width,      13);
        $this->assertEquals($record->point_radius,      14);
        $this->assertEquals($record->zindex,            15);
        $this->assertEquals($record->weight,            16);
        $this->assertEquals($record->start_date,        '17');
        $this->assertEquals($record->end_date,          '18');
        $this->assertEquals($record->after_date,        '19');
        $this->assertEquals($record->before_date,       '20');
        $this->assertEquals($record->point_image,       '21');
        $this->assertEquals($record->min_zoom,          22);
        $this->assertEquals($record->max_zoom,          23);
        $this->assertEquals($record->map_zoom,          24);
        $this->assertEquals($record->map_focus,         '25');

    }


    /**
     * `saveForm` should assign `item_id`.
     */
    public function testAssignItemId()
    {
        $record = $this->__record();
        $record->saveForm(array('item_id' => '1'));
        $this->assertEquals($record->item_id, 1);
    }


    /**
     * `saveForm` should assign `wms_address` and `wms_layers`.
     */
    public function testAssignWmsFields()
    {
        $record = $this->__record();
        $record->saveForm(array('wms_address'=>'1', 'wms_layers'=>'2'));
        $this->assertEquals($record->wms_address, '1');
        $this->assertEquals($record->wms_layers, '2');
    }


    /**
     * Empty/whitespace strings should be set as `null`.
     */
    public function testBlockEmptyStrings()
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
        $this->assertEquals(nl_readCSS($exhibit->styles), array(
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


    /**
     * When data is saved to a new, unsaved record, values from the `all`
     * selector should be pulled to the record before it is used to update
     * the exhibit CSS.
     */
    public function testPullAllTagWhenUnsaved()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .all {
              fill-color: 1;
            }
        ";
        $exhibit->save();

        // Save data to unsaved record.
        $record = new NeatlineRecord($exhibit);
        $record->saveForm(array('fill_color' => '2'));

        // Should pull CSS value.
        $this->assertEquals($record->fill_color, '1');

        // CSS should be unchanged.
        $this->assertEquals(nl_readCSS($exhibit->styles), array(
            'all' => array(
                'fill_color' => '1'
            )
        ));

    }


    /**
     * When data is saved to an existing record, values from the `all`
     * selector should _not_ be pulled to the record before it is used to
     * update the exhibit CSS. Otherwise, existing values on the exhibit
     * stylesheet would always clobber new values from the form, making it
     * impossible to change any of the fields controlled by `all`.
     */
    public function testNotPullAllTagWhenSaved()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .all {
              fill-color: 1;
            }
        ";
        $exhibit->save();

        // Save data to existing record.
        $record = $this->__record($exhibit);
        $record->saveForm(array('fill_color' => '2'));
        $exhibit = $this->reload($exhibit);

        // Should not pull CSS value.
        $this->assertEquals($record->fill_color, '2');

        // CSS should be changed.
        $this->assertEquals(nl_readCSS($exhibit->styles), array(
            'all' => array(
                'fill_color' => '2'
            )
        ));

    }


}
