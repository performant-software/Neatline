<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for Neatline base layer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineTag extends Omeka_Record_AbstractRecord
{


    public $exhibit_id;         // INT(10) UNSIGNED NOT NULL
    public $tag;                // TINYTEXT NULL


    private $styles = array();


    /**
     * Set foreign keys.
     *
     * @param Omeka_record $exhibit The exhibit record.
     */
    public function __construct($exhibit = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
    }


    /**
     * Add a key-value pair to `styles`.
     *
     * @param string $name The attribute name.
     * @param mixed $value The value.
     */
    public function __set($name, $value)
    {
        $this->styles[$name] = $value;
    }


    /**
     * Get style property.
     *
     * @param string $name The attribute name.
     */
    public function __get($name)
    {
        return $this->styles[$name];
    }


    /**
     * Merge styles into fields array.
     *
     * @return array The array representation of the record fields.
     */
    public function toArray()
    {
        $fields = parent::toArray();
        return array_merge($fields, $this->styles);
    }


    /**
     * Save form values, propagate name change to records.
     *
     * @param array $values The PUT values.
     */
    public function saveForm($values)
    {

        $old = $this->tag;

        // Update fields.
        foreach ($values as $k => $v) $this->$k = $v;
        $this->save();

        // Propagate new name.
        if ($this->tag != $old) {
            $records = $this->getTable('NeatlineRecord');
            $records->updateTag($this->exhibit_id, $old, $this->tag);
        }

    }


    /**
     * Remove tag from record tag strings.
     */
    public function afterDelete()
    {
        $records = $this->getTable('NeatlineRecord');
        $records->deleteTag($this->exhibit_id, $this->tag);
    }


}
