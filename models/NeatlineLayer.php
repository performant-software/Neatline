<?php
/**
 * Row class for Neatline base layer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineLayer extends Omeka_Record_AbstractRecord
{

    /**
     * The name of the layer.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $name;

}
