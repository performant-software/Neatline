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


    /**
     * The id of the user who created the exhibit.
     * int(10) unsigned NOT NULL
     */
    public $creator_id = 0;

    /**
     * Exhibit default tag.
     * int(10) unsigned NULL
     */
    public $tag_id;

    /**
     * The date the exhibit was created.
     * TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     */
    public $added;

    /**
     * The date the exhibit was last modified.
     * TIMESTAMP NULL
     */
    public $modified;

    /**
     * The title of the exhibit.
     * tinytext collate utf8_unicode_ci
     */
    public $title;

    /**
     * A text descriptiption for the exhibit.
     * TEXT COLLATE utf8_unicode_ci DEFAULT NULL
     */
    public $description;

    /**
     * The URL slug for the exhibit.
     * varchar(100) NOT NULL
     */
    public $slug;

    /**
     * Public/private setting.
     * tinyint(1) NOT NULL
     */
    public $public = 0;

    /**
     * Omeka items query for the editor.
     * TEXT COLLATE utf8_unicode_ci NULL
     */
    public $query;

    /**
     * Default map focus position.
     * varchar(100) NULL
     */
    public $map_focus;

    /**
     * Default map zoom.
     * varchar(100) NULL
     */
    public $map_zoom;


    /**
     * Zend_Date format for saving to the database.
     */
    const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';


    /**
     * Save data from the add/edit form.
     *
     * @param array $formValues The form values.
     */
    public function saveForm($formValues)
    {
        foreach ($formValues as $key => $value) { $this->$key = $value; }
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
     * Validate the slug.
     */
    protected function _validate()
    {

        // Block empty slug.
        if (trim($this->slug) == '') {
            $this->addError('slug', __('The slug cannot be empty.'));
        }

        // Block invalid slug.
        if (!preg_match('/^[0-9a-z\-]+$/', $this->slug)) {
            $this->addError('slug', __('The slug can only contain \
                lowercase letters, numbers, and hyphens.'
            ));
        }

    }


    /**
     * Check whether a Neatline was created by a given user
     *
     * @param Omeka_Record $user The user record.
     * @return boolean
     */
    public function addedBy($user)
    {
        return ($user->id == $this->creator_id);
    }


    /**
     * Set the exhibit owner.
     *
     * @param User $user The user record.
     */
    public function setAddedBy(User $user)
    {
        if (!$user->exists())
            throw new RuntimeException(__("User does not exist."));
        $this->creator_id = $user->id;
    }


    /**
     * Before a record is saved:
     * - Set `modified` field to the current timestamp.
     * - Set `added` field if the record is being inserted.
     */
    protected function beforeSave()
    {

        // Set `modified`.
        $now = Zend_Date::now()->toString(self::DATE_FORMAT);
        $this->modified = $now;

        // Set `added` if inserting.
        if (!$this->exists()) $this->added = $now;

    }


    /**
     * Alias the unmodified `save` method. Needed for testing.
     */
    public function parentSave()
    {
        parent::save();
    }


    /**
     * Create a default tag when an exhibit is inserted.
     */
    public function save()
    {

        // Is the record new?
        $isInserting = !$this->exists();
        parent::save();

        // Emulate `afterInsert` hook.
        if ($isInserting) $this->afterInsert();

    }


    /**
     * When a new exhibit is inserted, create a tag for the exhibit, set
     * the `tag_id reference`, and re-save the exhibit.
     */
    protected function afterInsert()
    {
        $tagsTable = $this->getTable('NeatlineTag');
        $tag = $tagsTable->createExhibitTag($this);
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


}
