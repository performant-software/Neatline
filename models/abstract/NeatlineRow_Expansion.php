<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class NeatlineRow_Expansion extends NeatlineRow_Abstract
{


    public $parent_id; // INT(10) UNSIGNED NULL


    /**
     * Set parent record foreign key.
     *
     * @param NeatlineRow_Abstract $parent The parent record.
     */
    public function __construct($parent)
    {
        parent::__construct();
        if (!is_null($parent)) $this->parent_id = $parent->id;
    }


}
