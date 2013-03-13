<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `pushStyles` on `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_PushStyles
    extends Neatline_Test_AppTestCase
{


    /**
     * `pushStyles` should propagate rules to records in the exhibit.
     */
    public function testPushStyles()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag1 {
              vector-color: 1;
              vector-opacity: 2;
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

        // Push styles.
        $exhibit->pushStyles();

        // Reload records.
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Record 1 should have `tag1` styles.
        $this->assertEquals($record1->vector_color, '1');
        $this->assertEquals($record1->vector_opacity, 2);
        $this->assertNull($record1->stroke_color);
        $this->assertNull($record1->stroke_opacity);

        // Record 2 should have `tag2` styles.
        $this->assertEquals($record2->stroke_color, '3');
        $this->assertEquals($record2->stroke_opacity, 4);
        $this->assertNull($record2->vector_color);
        $this->assertNull($record2->vector_opacity);

    }


    /**
     * When the value of a rule is the reserved word `auto`, `pushStyles`
     * should ignore the rule and not progate the value.
     */
    public function testIgnoreAutoValues()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              vector-color: color;
              stroke-color: auto;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag';
        $record->save();

        // Push styles.
        $exhibit->pushStyles();

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Should ignore rules with `auto` value.
        $this->assertEquals($record->vector_color, 'color');
        $this->assertNull($record->stroke_color);

    }


    /**
     * When an invalid property is defined on the stylesheet, `pushStyles`
     * should ignore the rule and not attempt to update the property.
     */
    public function testIgnoreInvalidProperties()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              vector-color: color;
              invalid: value;
            }
        ";
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag';
        $record->save();

        // Push styles.
        $exhibit->pushStyles();

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Should ignore rules with non-style properties.
        $this->assertEquals($record->vector_color, 'color');

    }


    /**
     * Rules defined under the `all` selector should be applied to all
     * records in an exhibit.
     */
    public function testDefaultTag()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .all {
              vector-color: color;
            }
        ";
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        // Push styles.
        $exhibit->pushStyles();

        // Reload records.
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Both records should be updated.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertEquals($record2->vector_color, 'color');

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
              vector-color: color;
            }
        ";
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit2);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        // Push styles.
        $exhibit1->pushStyles();

        // Reload records.
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Just exhibit 1 records should be updated.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertNull($record2->vector_color);

    }


}
