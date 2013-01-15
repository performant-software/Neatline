<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for editor action in exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitsControllerTest_Styles
    extends Neatline_Test_AppTestCase
{


    /**
     * The `styles` field should be updated with the passed string.
     */
    public function testSaveYAML()
    {

        $exhibit = $this->__exhibit();

        // Issue POST with styles string, reload exhibit.
        $this->request->setMethod('POST')->setRawBody('styles');
        $this->dispatch('neatline/styles/'.$exhibit->id);

        // `styles` column should be updated.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->styles, 'styles');

    }


    /**
     * New styles should be propagated to the exhibit record collection.
     */
    public function testUpdateStyles()
    {

        $exhibit = $this->__exhibit();
        $record  = new NeatlineRecord($exhibit);
        $record->tags = 'tag';
        $record->save();

        $yaml = <<<EOD
tag:
 - vector_color: 'color'
EOD;

        // Issue POST with styles string, reload exhibit.
        $this->request->setMethod('POST')->setRawBody($yaml);
        $this->dispatch('neatline/styles/'.$exhibit->id);

        // `styles` column should be updated.
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->vector_color, 'color');

    }


}
