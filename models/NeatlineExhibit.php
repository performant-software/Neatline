<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

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
     * varchar(100) NULL
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
     * The id of the user who created the exhibit.
     * int(10) unsigned NOT NULL
     */
    public $creator_id = 0;

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
     * Valid style attribute names.
     */
    private static $styles = array(
        'context_band_unit',
        'context_band_height',
        'vector_color',
        'vector_opacity',
        'stroke_color',
        'stroke_opacity',
        'stroke_width',
        'select_opacity',
        'graphic_opacity',
        'point_radius',
        'highlight_color'
    );

    /**
     * Zend_Date format for saving to the database.
     */
    const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

    /**
     * Name of default base layer.
     */
    const DEFAULT_LAYER = 'Google Physical';

    /**
     * Things to do in the beforeInsert() hook:
     *
     * Use the current datetime for 'added' and 'modified'.
     *
     * @since 1.0
     * @return void
     */
    protected function beforeInsert()
    {
        $now = Zend_Date::now()->toString(self::DATE_FORMAT);
        $this->added = $now;
        $this->modified = $now;
    }

    /**
     * Things to do in the beforeSave() hook:
     *
     * Explicitly set the modified timestamp.
     *
     * @since 1.0
     * @return void
     */
    protected function beforeSave()
    {
        $this->_checkDefaultFocusDate();
        $this->modified = Zend_Date::now()->toString(self::DATE_FORMAT);
    }

    /**
     * Commit add/edit form data.
     *
     * @param array $formValues: The form values.
     *
     * @return void.
     */
    public function saveForm($formValues)
    {
        foreach ($formValues as $key => $value) { $this->$key = $value; }
        $this->save();
    }

    /**
     * Set the current baselayer by name.
     *
     * @param string name The name.
     *
     * @param User $user
     */
    public function setBaseLayerByName($name)
    {

        // Get the base layers table, get the record.
        $_layersTable = $this->getTable('NeatlineLayer');
        $baseLayer = $_layersTable->getLayerByName($name);

        // Set key.
        if ($baseLayer) {
            $this->base_layer = $baseLayer->id;
        }

    }

    /**
     * Return the id of the data record for the passed item in the current
     * exhibit. If there is no record, return null.
     *
     * @param Omeka_record $item The item record.
     *
     * @return integer $id The id.
     */
    public function getRecordIdByItem($item)
    {

        // Get the data record table.
        $_recordsTable = $this->getTable('NeatlineRecord');

        // Try to get a record.
        $record = $_recordsTable->getRecordByItemAndExhibit($item, $this);

        return ($record) ? $record->id : null;

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
     * Get the base layer record.
     *
     * @return Omeka_record The record.
     */
    public function getBaseLayer()
    {

        // Get the data record table and query for active records.
        $_layersTable = $this->getTable('NeatlineLayer');

        // Get default if no local setting.
        if (is_null($this->base_layer)) {
            return $_layersTable->fetchObject($_layersTable->getSelect()->
                where('name = "' . self::DEFAULT_LAYER . '"'));
        }

        // If exhibit value is set, return the setting.
        else return $_layersTable->find($this->base_layer);

    }

    /**
     * Delete status and element text association records on exhibit delete.
     *
     * @return void.
     */
    public function delete()
    {

        // Get the records table, delete child data.
        $_recordsTable = $this->getTable('NeatlineRecord');
        $records = $_recordsTable->findBySql('exhibit_id = ?', array($this->id));
        foreach ($records as $record) { $record->delete(); }

        // Call parent.
        parent::delete();

    }

    /**
     * Validate slug format.
     *
     * @return void.
     */
    protected function _validate()
    {

        if (trim($this->slug) == '') {
            $this->addError('slug', __('The slug cannot be empty.'));
        }

        if (!preg_match('/^[0-9a-z\-]+$/', $this->slug)) {
            $this->addError('slug', __('The slug can only contain lowercase \
                letters, numbers, and hyphens.'));
        }

    }

    /**
     * Checks whether a Neatline was created by a given user
     *
     * @param User
     * @return boolean
     */
    public function addedBy($user)
    {
        return ($user->id == $this->creator_id);
    }

    /**
     * Set the user who added the Neatline.
     *
     * @param User $user
     */
    public function setAddedBy(User $user)
    {
        if (!$user->exists()) {
            throw new RuntimeException(__("Cannot associate a Neatline with \
                a user who doesn't exist."));
        }
        $this->creator_id = $user->id;
    }

    /**
     * This makes sure that the focus_date isn't set to the string
     * 'null'.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    protected function _checkDefaultFocusDate()
    {
        if (is_string($this->focus_date)
            && strcasecmp($this->focus_date, 'null') === 0
        ) {
            $this->focus_date = null;
        }
    }

}
