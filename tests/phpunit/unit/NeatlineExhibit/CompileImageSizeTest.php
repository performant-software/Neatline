<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_CompileImageSize extends Neatline_Case_Default
{


    /**
     * `beforeSave` should set the image height and width.
     */
    public function testCompileImageSize()
    {

        $exhibit = $this->_exhibit();
        $exhibit->image_layer = NL_TEST_DIR.'/mocks/image.jpg';
        $exhibit->save();

        $exhibit = $this->_reload($exhibit);

        // Should set `image_width` and `image_height`.
        $this->assertEquals($exhibit->image_width,  100);
        $this->assertEquals($exhibit->image_height, 200);

    }


}
