<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Record class for exhibits.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibit extends Omeka_Record_AbstractRecord
{


    public $tag_id;         // INT(10) UNSIGNED NULL
    public $added;          // TIMESTAMP NULL
    public $modified;       // TIMESTAMP NULL
    public $title;          // TINYTEXT COLLATE utf8_unicode_ci NULL
    public $description;    // TEXT COLLATE utf8_unicode_ci NULL
    public $slug;           // VARCHAR(100) NOT NULL
    public $public = 0;     // TINYINT(1) NOT NULL
    public $query;          // TEXT COLLATE utf8_unicode_ci NULL
    public $map_focus;      // VARCHAR(100) NULL
    public $map_zoom;       // INT(10) UNSIGNED NULL


    /**
     * Save data from the add/edit form.
     *
     * @param array $formValues The form values.
     */
    public function saveForm($formValues)
    {
        foreach ($formValues as $key => $value) $this->$key = $value;
        $this->save();
    }


    /**
     * Get the number of active records in the exhibit.
     *
     * @return integer $id The record count.
     */
    public function getNumberOfRecords()
    {
        $recordsTable = $this->getTable('NeatlineRecord');
        return $recordsTable->countActiveRecordsByExhibit($this);
    }


    /**
     * Create a default tag when an exhibit is inserted.
     */
    public function save()
    {

        // Is the record new?
        $isInserting = !$this->exists();
        parent::save();

        // Call `afterInsert`.
        if ($isInserting) $this->afterInsert();

    }


    /**
     * When a new exhibit is inserted, create a tag for the exhibit, set
     * the `tag_id reference`, and re-save the exhibit.
     */
    protected function afterInsert()
    {

        // Create an exhibit-default tag.
        $tagsTable = $this->getTable('NeatlineTag');
        $tag = $tagsTable->createExhibitTag($this);

        // Set the reference.
        $this->tag_id = $tag->id;
        $this->save();

    }


    /**
     * Delete all child data records when an exhibit is deleted.
     */
    protected function beforeDelete()
    {
        $recordsTable = $this->getTable('NeatlineRecord');
        $recordsTable->delete("{$this->_db->prefix}neatline_records",
            array('exhibit_id = ?' => $this->id)
        );
    }


    /**
     * Alias original `save` for testing.
     */
    public function __save()
    {
        parent::save();
    }


}
