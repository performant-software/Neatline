<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessExhibitStaticImage
    extends Neatline_Case_Migrate200
{


    /**
     * For old exhibits that were built on top of static images, the new
     * `image_layer` field should be set with the path of the image file.
     */
    public function testProcessExhibitStaticImage()
    {

        $this->_loadFixture('ProcessExhibitStaticImage.items');
        $this->_loadFixture('ProcessExhibitStaticImage.files');
        $this->_loadFixture('ProcessExhibitStaticImage.exhibits');

        $this->_upgrade();
        $this->_migrate();

        // Should populate the `image_layer` field.
        $exhibit = $this->_getExhibitByTitle('Static Image');
        $this->assertEquals($exhibit->image_layer, '/original/image.jpg');

    }


}
