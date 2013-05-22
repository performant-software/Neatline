<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_AbstractRow extends Omeka_Record_AbstractRecord
{

    /**
     * Initialize record ownership mixin.
     */
    protected function _initializeMixins()
    {
        $this->_mixins[] = new Mixin_Owner($this, 'user_id');
    }


    /**
     * Is the record owned by a given user?
     *
     * @param Omeka_User $user A user record.
     */
    public function isOwnedBy($user)
    {
        return $this->user_id == $user->id;
    }


    /**
     * Set a field if the passed value is not whitespace.
     *
     * @param string $key The name of the field.
     * @param boolean $val The value to set.
     */
    public function setNotEmpty($key, $val)
    {
        if (is_string($val) && trim($val) == '') $this->$key = null;
        else $this->$key = $val;
    }


    /**
     * Mass-assign an associative array to the record.
     *
     * @param array $values The array of values.
     */
    public function setArray($values)
    {
        foreach ($values as $k => $v) {
            if (is_array($v)) $v = implode(',', $v);
            $this->setNotEmpty($k, $v);
        }
    }


    /**
     * Implode `widgets` and `base_layers` before saving.
     *
     * @param array $values The POST/PUT values.
     */
    public function saveForm($values)
    {
        $this->setArray($values);
        $this->save();
    }


    /**
     * Before saving, update the `modified` timestamp.
     *
     * @return array The array representation of the record fields.
     */
    public function toArrayForSave()
    {
        $fields = parent::toArray();
        $fields['modified'] = new Zend_Db_Expr('NOW()');
        return $fields;
    }


    /**
     * Insert or update the record.
     *
     * @param boolean $throwIfInvalid
     */
    public function save($throwIfInvalid = true)
    {

        $args = array(
            'post'    => $this->_postData ? $this->_postData : false,
            'insert'  => !$this->exists()
        );

        // Insert/udpate the master record.
        $this->runCallbacks('beforeSave', $args);
        $this->insertOrUpdate($this->toArrayForSave());
        $this->runCallbacks('afterSave', $args);

    }


    /**
     * Insert or update the record. Approach based on:
     * https://gist.github.com/1942116
     *
     * @param array $values The record values.
     */
    public function insertOrUpdate(array $values)
    {

        $table = $this->getTable();
        $valid = $table->getColumns();
        $db = $table->getAdapter();

        $cols = array();
        $vals = array();
        $bind = array();
        $set  = array();

        // Build column / value arrays.
        foreach ($values as $col => $val) {

            // Pass if column doesn't exist.
            if (!in_array($col, $valid)) continue;

            // Register the column.
            $cols[] = $db->quoteIdentifier($col, true);

            // Register the value.
            if ($val instanceof Zend_Db_Expr) {
                $vals[] = $val->__toString();
            } else {
                $vals[] = '?';
                $bind[] = $val;
            }

        }

        // Build update clauses.
        foreach ($cols as $i => $col) {
            $set[] = sprintf('%s = %s', $col, $vals[$i]);
        }

        // Build the query.
        $sql = sprintf(
            "INSERT INTO %s (%s) VALUES (%s) ON DUPLICATE KEY UPDATE %s;",
            $db->quoteIdentifier($table->getTableName(), true),
            implode(', ', $cols),
            implode(', ', $vals),
            implode(', ', $set)
        );

        // Insert or update.
        $wasInserted = !$this->exists();
        $db->query($sql, array_merge($bind, $bind));

        // If record was inserted, set `id`.
        if ($wasInserted) $this->id = $db->lastInsertId();

    }


}
