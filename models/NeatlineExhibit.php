<?php
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
     * The id of the user who created the exhibit.
     * int(10) unsigned NOT NULL
     */
    public $creator_id = 0;

    /**
     * The id of the user who created the exhibit.
     * int(10) unsigned NOT NULL
     */
    public $image_id;

    /**
     * The top viewport in the exhibit.
     * ENUM('map', 'timeline') DEFAULT 'map'
     */
    public $top_element = 'map';

    /**
     * The horizontal position of the items panel.
     * ENUM('right', 'left') DEFAULT 'right'
     */
    public $items_h_pos = 'right';

    /**
     * The vertical position of the items panel.
     * ENUM('top', 'bottom') DEFAULT 'bottom'
     */
    public $items_v_pos = 'bottom';

    /**
     * The height of the items panel.
     * ENUM('full', 'partial') DEFAULT 'partial'
     */
    public $items_height = 'full';

    /**
     * The horizontal offset of the map/timeline border.
     * int(10) unsigned NULL
     */
    public $h_percent;

    /**
     * The vertical offset of the map/timeline border.
     * int(10) unsigned NULL
     */
    public $v_percent;

    /**
     * Boolean for map presence.
     * tinyint(1) NOT NULL
     */
    public $is_map = 1;

    /**
     * Boolean for timeline presence.
     * tinyint(1) NOT NULL
     */
    public $is_timeline = 0;

    /**
     * Boolean for items presence.
     * tinyint(1) NOT NULL
     */
    public $is_items = 0;

    /**
     * Default map focus position.
     * varchar(100) NULL
     */
    public $map_bounds;

    /**
     * Default map zoom.
     * varchar(100) NULL
     */
    public $map_zoom;

    /**
     * Default timeline focus date.
     * int(10) unsigned NULL
     */
    public $focus_date;

    /**
     * Default timeline zoom.
     * int(10) unsigned NULL
     */
    public $timeline_zoom;

    /**
     * Boolean for context band presence.
     * tinyint(1) NOT NULL
     */
    public $is_context_band = 1;

    /**
     * The default unit for the context band.
     * ENUM('hour', 'day', 'week', 'month', 'year', 'decade', 'century')
     * DEFAULT 'decade'
     */
    public $context_band_unit;

    /**
     * The percentage height of the context band.
     * int(10) unsigned NULL
     */
    public $context_band_height;

    /**
     * The default fill color for new geometries.
     * int(10) unsigned NULL
     */
    public $vector_color;

    /**
     * The default stroke color for new geometries.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $stroke_color;

    /**
     * The default highlight color for new geometries.
     * tinytext COLLATE utf8_unicode_ci NULL
     */
    public $highlight_color;

    /**
     * The default fill opacity for new geometries.
     * int(10) unsigned NULL
     */
    public $vector_opacity;

    /**
     * The default selected fill opacity for new geometries.
     * int(10) unsigned NULL
     */
    public $select_opacity;

    /**
     * The default line opacity for new geometries.
     * int(10) unsigned NULL
     */
    public $stroke_opacity;

    /**
     * The default graphic opacity for new geometries.
     * int(10) unsigned NULL
     */
    public $graphic_opacity;

    /**
     * The default line width for new geometries.
     * int(10) unsigned NULL
     */
    public $stroke_width;

    /**
     * The default point radius for new geometries.
     * int(10) unsigned NULL
     */
    public $point_radius;

    /**
     * The id of the default base layer.
     * int(10) unsigned NULL
     */
    public $base_layer = 2;


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
     * Fetch the parent image.
     *
     * @return Omeka_record The map.
     */
    public function getImage()
    {

        if (!is_null($this->image_id)) {
            return $this->getTable('File')->find($this->image_id);
        }

        return null;

    }

    /**
     * Set a style attribute. Only set a value if it is different from
     * the system default. Return true if a row value is set.
     *
     * @param string style The name of the style.
     * @param mixed $value The value to set.
     *
     * @return boolean True if the set succeeds.
     */
    public function setStyle($style, $value)
    {

        // If a non-style property is passed, return false.
        if (!in_array('' . $style, self::$styles)) {
            return false;
        }

        // If the value does not match the system default.
        else if ($value != get_plugin_ini('Neatline', $style)) {
            $this['' . $style] = $value;
            return true;
        }

        // If the value matches the system default and there is an existing
        // row-level value on the exhibit.
        else if ($value == get_plugin_ini('Neatline', $style) &&
            !is_null($this['' . $style])) {
                $this['' . $style] = null;
                return true;
        }

        return false;

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
        $_layersTable = $this->getTable('NeatlineBaseLayer');
        $baseLayer = $_layersTable->getLayerByName($name);

        // Set key.
        if ($baseLayer) {
            $this->base_layer = $baseLayer->id;
        }

    }

    /**
     * Get a style attribute. Look for exhibit-specific default, and
     * fall back on system defaults when local value is unset.
     *
     * @param string style The name of the style.
     *
     * @return mixed The style.
     */
    public function getStyle($style)
    {

        // If there is a row value.
        if (!is_null($this['' . $style])) {
            return $this['' . $style];
        }

        // Fall back to system default.
        else {
            return get_plugin_ini('Neatline', $style);
        }

    }

    /**
     * Check whether a given record is active on the map or timeline.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $viewport 'space', 'time', 'items'.
     *
     * @return boolean True if the record is active.
     */
    public function getRecordStatus($item, $viewport)
    {

        // Get the data record table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Get the status.
        return $_recordsTable->getRecordStatus($item, $this, $viewport);

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
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Try to get a record.
        $record = $_recordsTable->getRecordByItemAndExhibit($item, $this);

        return ($record) ? $record->id : null;

    }

    /**
     * Return the total number of data records.
     *
     * @return integer $id The record count.
     */
    public function getNumberOfRecords()
    {

        // Get the data record table and query for active records.
        $_recordsTable = $this->getTable('NeatlineDataRecord');
        $records = $_recordsTable->getActiveRecordsByExhibit($this);

        return ($records) ? count($records) : 0;

    }

    /**
     * Get the base layer record.
     *
     * @return Omeka_record The record.
     */
    public function getBaseLayer()
    {

        // Get the data record table and query for active records.
        $_layersTable = $this->getTable('NeatlineBaseLayer');

        // If exhibit value is null, get and return default.
        if (is_null($this->base_layer)) {
            return $_layersTable->fetchObject(
                $_layersTable->getSelect()->where('name = "Google Physical"')
            );
        }

        // If exhibit value is set, return the setting.
        else {
            return $_layersTable->find($this->base_layer);
        }

    }

    /**
     * Get the horizontal and vertical viewport percentages.
     *
     * @return array $proportions array('horizontal' => integer,
     * 'vertical' => integer).
     */
    public function getViewportProportions()
    {

        // Shell out array with defaults.
        $proportions = array(
            'horizontal' => get_plugin_ini('Neatline', 'h_percent'),
            'vertical' => get_plugin_ini('Neatline', 'v_percent')
        );

        // Use row-specifc values if present.
        if (!is_null($this->h_percent) && !is_null($this->v_percent)) {
            $proportions['horizontal'] = $this->h_percent;
            $proportions['vertical'] = $this->v_percent;
        }

        return $proportions;

    }

    /**
     * Get the starting timeline zoom.
     *
     * @return integer $zoom The zoom index.
     */
    public function getTimelineZoom()
    {
        return !is_null($this->timeline_zoom) ?
            $this->timeline_zoom :
            (int) get_plugin_ini('Neatline', 'timeline_zoom');
    }

    /**
     * Delete status and element text association records on exhibit delete.
     *
     * @return void.
     */
    public function delete()
    {

        // Get the records table, delete child data.
        $_recordsTable = $this->getTable('NeatlineDataRecord');
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
