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
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag2';
        $record1->save();
        $record2->save();

        $exhibit->styles = <<<CSS
.tag1 {
  vector-color: 1;
  vector-opacity: 2;
}
.tag2 {
  stroke-color: 3;
  stroke-opacity: 4;
}
CSS;

        $exhibit->pushStyles();
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
     * `pushStyles` should ignore rules with a value of `auto`.
     */
    public function testIgnoreStylesWithoutValues()
    {

        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);
        $record->vector_color = 'color';
        $record->tags = 'tag';
        $record->save();

        $exhibit->styles = <<<CSS
.tag {
  vector-color: auto;
}
CSS;

        $exhibit->pushStyles();
        $record = $this->_recordsTable->find($record->id);

        // `vector_color` should not be changed.
        $this->assertEquals($record->vector_color, 'color');

    }


    /**
     * The `all` selector match all records in an exhibit.
     */
    public function testDefaultTag()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        $exhibit->styles = <<<CSS
.all {
  vector-color: color;
}
CSS;

        $exhibit->pushStyles();
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Both records should be matched by `default`.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertEquals($record2->vector_color, 'color');

    }


    /**
     * `pushStyles` should only update records in the passed exhibit.
     */
    public function testExhibitIsolation()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit2);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        $exhibit1->styles = <<<CSS
.tag {
  vector-color: color;
}
CSS;

        $exhibit1->pushStyles();
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Just exhibit 1 record should be updated.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertNull($record2->vector_color);

    }


}
