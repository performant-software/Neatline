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

class Neatline_ExhibitsControllerTest_Editor
    extends Neatline_Test_AppTestCase
{


    /**
     * The `#styles` textarea should be populated with the exhibit value.
     */
    public function testStylesPopulation()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = 'styles';
        $exhibit->save();

        // Styles template should contain the value.
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $this->assertQueryContentContains('#styles-template', 'styles');

    }


}
