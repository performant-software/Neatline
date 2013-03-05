<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `updateStyles` on `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_UpdateStyles
    extends Neatline_Test_AppTestCase
{


    /**
     * `updateStyles` should update exhibit styles with record values.
     *
     * @group update
     */
    public function testUpdateStyles()
    {

        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);
        $record->vector_color = '1';
        $record->stroke_color = '2';
        $record->tags = 'tag1,tag2';
        $record->save();

        // YAML
        $exhibit->styles = <<<YAML
tag1:
 - vector_color: '3'
 - stroke_color
tag2:
 - vector_color: '4'
 - stroke_color
tag3:
 - vector_color: '5'
 - stroke_color
YAML;

        // Update styles.
        $exhibit->updateStyles($record);
        $this->assertEquals(Spyc::YAMLLoad($exhibit->styles), array(
            // Tag 1 updated.
            'tag1' => array(
                array('vector_color' => '1'),
                array('stroke_color' => '2')
            ),
            // Tag 2 updated.
            'tag2' => array(
                array('vector_color' => '1'),
                array('stroke_color' => '2')
            ),
            // Tag 3 unchanged.
            'tag3' => array(
                array('vector_color' => '5'),
                'stroke_color'
            )
        ));

    }


}
