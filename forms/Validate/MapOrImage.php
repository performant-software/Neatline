<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Custom validator to block exhibits with a map and an image.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class Neatline_Validate_MapOrImage extends Zend_Validate_Abstract
{

    const MAP_OR_IMAGE = 'mapOrImage';

    protected $_messageTemplates = array(
        self::MAP_OR_IMAGE => 'Choose a map or an image, or neither, but not both.'
    );

    /**
     * Block exhibits with a map and an image.
     *
     * @return boolean True if the field is valid.
     */
    public function isValid($value, $context = null)
    {

        $this->_setValue($value);

        $notNone = 0;
        foreach (array(
            $context['map'],
            $context['image'],
            $context['wms']
        ) as $key => $base) {
            if ($base !== 'none') { $notNone++; }
        }

        if ($notNone > 1) {
            $this->_error(self::MAP_OR_IMAGE);
            return false;
        }

        return true;

    }

}
