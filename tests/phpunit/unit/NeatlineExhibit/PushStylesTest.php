<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_PushStyles extends Neatline_Case_Default
{


    /**
     * `pushStyles` should propagate rules to records in the exhibit.
     */
    public function testPushStyles()
    {

        $exhibit = $this->_exhibit();
        $exhibit->styles = "
            .tag1 {
              fill-color: 1;
              fill-color-select: 2;
            }
            .tag2 {
              stroke-color: 3;
              stroke-color-select: 4;
            }
        ";

        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag2';
        $record1->save();
        $record2->save();

        $exhibit->pushStyles();
        $record1 = $this->_reload($record1);
        $record2 = $this->_reload($record2);

        // Record 1 should have `tag1` styles.
        $this->assertEquals($record1->fill_color, '1');
        $this->assertEquals($record1->fill_color_select, '2');
        $this->assertEquals('#000000', $record1->stroke_color);
        $this->assertEquals('#000000', $record1->stroke_color_select);

        // Record 2 should have `tag2` styles.
        $this->assertEquals('3', $record2->stroke_color);
        $this->assertEquals('4', $record2->stroke_color_select);
        $this->assertEquals('#00aeff', $record2->fill_color);
        $this->assertEquals('#00aeff', $record2->fill_color_select);

    }


    /**
     * Rules with `auto` values should be ignored.
     */
    public function testAutoValues()
    {

        $exhibit = $this->_exhibit();
        $exhibit->styles = "
            .tag1 {
              fill-color: color;
              stroke-color: auto;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag1';
        $record->save();

        $exhibit->pushStyles();
        $record = $this->_reload($record);

        // Should ignore rules with `auto` value.
        $this->assertEquals($record->fill_color, 'color');
        $this->assertEquals('#000000', $record->stroke_color);

    }


    /**
     * Rules with `none` values should be ignored.
     */
    public function testNoneValues()
    {

        $exhibit = $this->_exhibit();
        $exhibit->styles = "
            .tag1 {
              point-image: none;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->point_image = 'img';
        $record->tags = 'tag1';
        $record->save();

        $exhibit->pushStyles();
        $record = $this->_reload($record);

        // Should push `none` as NULL.
        $this->assertNull($record->point_image);

    }


    /**
     * Rules with invalid selectors should be ignored.
     */
    public function testInvalidSelectors()
    {

        $exhibit = $this->_exhibit();
        $exhibit->styles = "
            .tag1 {
              fill-color: color;
              invalid: value;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag1';
        $record->save();

        $exhibit->pushStyles();
        $record = $this->_reload($record);

        // Should ignore rules with non-style properties.
        $this->assertEquals($record->fill_color, 'color');

    }


    /**
     * Rules under the `all` selector should be applied to all records.
     */
    public function testAllSelector()
    {

        $exhibit = $this->_exhibit();
        $exhibit->styles = "
            .all {
              fill-color: color;
            }
        ";
        $record1 = $this->_record($exhibit);
        $record2 = $this->_record($exhibit);

        $exhibit->pushStyles();
        $record1 = $this->_reload($record1);
        $record2 = $this->_reload($record2);

        // Both records should be updated.
        $this->assertEquals($record1->fill_color, 'color');
        $this->assertEquals($record2->fill_color, 'color');

    }


    /**
     * Only update records that belong to the exhibit should be updated.
     */
    public function testExhibitIsolation()
    {

        $exhibit1 = $this->_exhibit();
        $exhibit2 = $this->_exhibit();
        $exhibit1->styles = "
            .tag1 {
              fill-color: color;
            }
        ";
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit2);
        $record1->tags = 'tag1';
        $record2->tags = 'tag1';
        $record1->save();
        $record2->save();

        $exhibit1->pushStyles();
        $record1 = $this->_reload($record1);
        $record2 = $this->_reload($record2);

        // Just exhibit 1 records should be updated.
        $this->assertEquals('color', $record1->fill_color);
        $this->assertEquals('#00aeff', $record2->fill_color);

    }


}
