<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for styles action in editor controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_EditorControllerTest_Styles
    extends Neatline_Test_AppTestCase
{


    /**
     * /editor/styles should save `styles` YAML.
     */
    public function testSave()
    {

        $exhibit = $this->__exhibit();

        // Update the style YAML.
        $this->request->setMethod('POST')->setRawBody('styles');
        $this->dispatch('neatline/editor/styles/'.$exhibit->id);

        // Reload exhibit, `styles` should be updated.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->styles, 'styles');

    }


}
