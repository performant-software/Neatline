<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Row_Expansion extends Neatline_Row_Abstract
{


    public $parent_id; // INT(10) UNSIGNED NULL


    /**
     * Set parent record foreign key.
     *
     * @param Neatline_Row_Abstract $parent The parent record.
     */
    public function __construct($parent = null)
    {
        parent::__construct();
        if (!is_null($parent)) $this->parent_id = $parent->id;
    }


    /**
     * Mass-assign an associative array to the record.
     *
     * @param array $values The array of values.
     */
    public function setArray($values)
    {

        // If the expansion has already exists, set the values directly.

        if ($this->exists()) parent::setArray($values);

        // Otherwise, don't set fields that both (a) have a default value
        // provided by the model class and (b) for which a default, left-
        // joined NULL value is passed from the parent record. This stops
        // the default value from being overwritten by the NULL default.

        else foreach ($values as $k => $v) {
            if (!is_null($this->$k) && is_null($v)) continue;
            $this->setNotEmpty($k, $v);
        }

    }


}
