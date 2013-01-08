<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecord extends Omeka_Record_AbstractRecord
{


    public $item_id;            // INT(10) UNSIGNED NULL
    public $exhibit_id;         // INT(10) UNSIGNED NULL
    public $tag_id;             // INT(10) UNSIGNED NULL

    public $slug;               // VARCHAR(100) NULL
    public $title;              // MEDIUMTEXT NULL
    public $body;               // MEDIUMTEXT NULL
    public $tags;               // TEXT NULL
    public $coverage;           // GEOMETRY NOT NULL
    public $map_active;         // TINYINT(1) NULL


    private $styles = array();


    /**
     * Set foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $exhibit The exhibit record.
     */
    public function __construct($exhibit = null, $item = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
        if (!is_null($item)) $this->item_id = $item->id;
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
     * Plug the MySQL expression for the coverage insert into the array
     * representation of the record used by `insert`. When `coverage` is
     * defined, form the expression from the value; when it is undefined,
     * use `POINT(0 0)` as a palceholder value since MySQL requires that
     * spatially-indexed columns be NOT NULL.
     *
     * @return array The array representation of the record fields.
     */
    public function toArray()
    {

        $fields = parent::toArray();

        // Add the coverage.
        if (!empty($fields['coverage'])) {
            $fields['coverage'] = new Zend_Db_Expr(
                "GeomFromText('{$fields['coverage']}')"
            );
        } else {
            $fields['coverage'] = new Zend_Db_Expr(
                "GeomFromText('POINT(0 0)')"
            );
        }

        // Merge styles.
        return array_merge($fields, $this->styles);

    }


    /**
     * Set a field if the passed value is not null or ''.
     *
     * @param string $field The name of the fiel.
     * @param boolean $value The value to set.
     */
    public function setNotEmpty($field, $value)
    {
        if (trim($value) == '') $this[$field] = null;
        else $this[$field] = $value;
    }


    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record The parent exhibit.
     */
    public function getExhibit()
    {
        $exhibits = $this->getTable('NeatlineExhibit');
        return $exhibits->find($this->exhibit_id);
    }


    /**
     * Save form values.
     *
     * @param array $values The PUT values.
     */
    public function saveForm($values)
    {
        foreach ($values as $k => $v) $this->setNotEmpty($k, $v);
        $this->save();
    }


    /**
     * Assemble record data for the front-end application.
     *
     * @return array The data array.
     **/
    public function buildJsonData() {
        $fields = parent::toArray();
        return array_merge($fields, $this->styles);
    }


    /**
     * Insert or update the record. Overrides the default in order to make
     * it possible to pass MySQL expressions as values on insert/update,
     * which is needed to set the `coverage` field with `GeomFromText()`.
     */
    public function save()
    {
        $inserting = !$this->exists();
        $this->runCallbacks('beforeSave', array('insert' => $inserting));
        $this->id = $this->insertOrUpdate($this->toArray());
        $this->runCallbacks('afterSave', array('insert' => $inserting));
    }


    /**
     * Insert or update the record. Approach based on:
     * https://gist.github.com/1942116
     *
     * @param array $values The record values.
     */
    public function insertOrUpdate(array $values)
    {

        // Get table and adapter.
        $table = $this->getTable('NeatlineRecord');
        $db = $table->getAdapter();

        $cols = array();
        $vals = array();
        $bind = array();
        $set  = array();

        // Build column and value arrays.
        foreach ($values as $col => $val) {
            $cols[] = $db->quoteIdentifier($col, true);
            if ($val instanceof Zend_Db_Expr) {
                $vals[] = $val->__toString();
            } else {
                $vals[] = '?';
                $bind[] = $val;
            }
        }

        // Build update assignments.
        foreach ($cols as $i => $col) {
            $set[] = sprintf('%s = %s', $col, $vals[$i]);
        }

        $sql = sprintf(
            "INSERT INTO %s (%s) VALUES (%s) ON DUPLICATE KEY UPDATE %s;",
            $db->quoteIdentifier($table->getTableName(), true),
            implode(', ', $cols),
            implode(', ', $vals),
            implode(', ', $set)
        );

        // Query, return insert id.
        $db->query($sql, array_merge($bind, $bind));
        return (int) $db->lastInsertId();

    }


    /**
     * Propagate new values to records with shared tags.
     */
    public function propagateTags()
    {

        $recordsTable   = $this->getTable('NeatlineRecord');
        $tagsTable      = $this->getTable('NeatlineTag');
        $exhibit        = $this->getExhibit();

        // Gather list of tag attributes.
        $attrs = array_keys(apply_filters('neatline_styles', array()));

        // Explode tags.
        foreach (neatline_explodeTags($this->tags) as $raw) {

            // Get the tag record.
            $tag    = $tagsTable->getTagByName($exhibit, $raw);
            $where  = array('tags LIKE ?' => '%'.$raw.'%');
            $data   = array();

            // Get update data array.
            foreach ($attrs as $attr) { if ($tag->$attr == 1) {
                $data[$attr] = $this->$attr;
            }}

            // Update sibling records.
            $recordsTable->update($recordsTable->getTableName(),
                $data, $where);

        }

    }


}
