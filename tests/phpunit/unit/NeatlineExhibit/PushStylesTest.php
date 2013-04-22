<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_PushStyles extends Neatline_TestCase
{


    /**
     * `pushStyles` should propagate rules to records in the exhibit.
     */
    public function testPushStyles()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag1 {
              fill-color: 1;
              fill-opacity: 2;
            }
            .tag2 {
              stroke-color: 3;
              stroke-opacity: 4;
            }
        ";

        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag2';
        $record1->save();
        $record2->save();

        $exhibit->pushStyles();
        $record1 = $this->reload($record1);
        $record2 = $this->reload($record2);

        // Record 1 should have `tag1` styles.
        $this->assertEquals($record1->fill_color, '1');
        $this->assertEquals($record1->fill_opacity, 2);
        $this->assertNull($record1->stroke_color);
        $this->assertNull($record1->stroke_opacity);

        // Record 2 should have `tag2` styles.
        $this->assertEquals($record2->stroke_color, '3');
        $this->assertEquals($record2->stroke_opacity, 4);
        $this->assertNull($record2->fill_color);
        $this->assertNull($record2->fill_opacity);

    }


    /**
     * Rules with `auto` values should be ignored.
     */
    public function testAutoValues()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              fill-color: color;
              stroke-color: auto;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag';
        $record->save();

        $exhibit->pushStyles();
        $record = $this->reload($record);

        // Should ignore rules with `auto` value.
        $this->assertEquals($record->fill_color, 'color');
        $this->assertNull($record->stroke_color);

    }


    /**
     * Rules with `none` values should be ignored.
     */
    public function testNoneValues()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              point-image: none;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->point_image = 'img';
        $record->tags = 'tag';
        $record->save();

        $exhibit->pushStyles();
        $record = $this->reload($record);

        // Should push `none` as NULL.
        $this->assertNull($record->point_image);

    }


    /**
     * Rules with invalid selectors should be ignored.
     */
    public function testInvalidSelectors()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              fill-color: color;
              invalid: value;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag';
        $record->save();

        $exhibit->pushStyles();
        $record = $this->reload($record);

        // Should ignore rules with non-style properties.
        $this->assertEquals($record->fill_color, 'color');

    }


    /**
     * Rules under the `all` selector should be applied to all records.
     */
    public function testAllSelector()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .all {
              fill-color: color;
            }
        ";
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        $exhibit->pushStyles();
        $record1 = $this->reload($record1);
        $record2 = $this->reload($record2);

        // Both records should be updated.
        $this->assertEquals($record1->fill_color, 'color');
        $this->assertEquals($record2->fill_color, 'color');

    }


    /**
     * Only update records that belong to the exhibit should be updated.
     */
    public function testExhibitIsolation()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $exhibit1->styles = "
            .tag {
              fill-color: color;
            }
        ";
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit2);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        $exhibit1->pushStyles();
        $record1 = $this->reload($record1);
        $record2 = $this->reload($record2);

        // Just exhibit 1 records should be updated.
        $this->assertEquals($record1->fill_color, 'color');
        $this->assertNull($record2->fill_color);

    }


}
