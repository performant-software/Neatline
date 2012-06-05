<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Record class for exhibits.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class NeatlineExhibit extends Omeka_record
{

    /**
     * Record attributes.
     */

    public $added;
    public $modified;
    public $name;
    public $description;
    public $slug;
    public $public;
    public $query;

    // Foreign keys.
    public $image_id;

    // Layout parameters.
    public $top_element;
    public $items_h_pos;
    public $items_v_pos;
    public $items_height;
    public $h_percent;
    public $v_percent;

    // Viewport presence.
    public $is_map;
    public $is_timeline;
    public $is_items;

    // Map position defaults.
    public $default_map_bounds;
    public $default_map_zoom;

    // Timeline position defaults.
    public $default_focus_date;
    public $default_timeline_zoom;

    // Timeline layout parameters.
    public $is_context_band;
    public $default_context_band_unit;
    public $default_context_band_height;

    // Default styles.
    public $default_vector_color;
    public $default_stroke_color;
    public $default_highlight_color;
    public $default_vector_opacity;
    public $default_select_opacity;
    public $default_stroke_opacity;
    public $default_stroke_width;
    public $default_point_radius;
    public $default_base_layer;

    /**
     * Valid style attribute names.
     */
    private static $styles = array(
        'default_vector_color',
        'default_vector_opacity',
        'default_stroke_color',
        'default_stroke_opacity',
        'default_stroke_width',
        'default_select_opacity',
        'default_point_radius',
        'default_highlight_color',
        'default_context_band_unit',
        'default_context_band_height'
    );

    /**
     * Save the add Neatline form.
     *
     * @param string $title The title.
     * @param string $description The description.
     * @param string $slug The slug.
     * @param boolean $public True if public.
     * @param varchar $image The image id.
     *
     * @return boolean True if save is successful.
     */
    public function saveForm(
        $title,
        $description,
        $slug,
        $public,
        $image
    )
    {

        // Set default values.
        $this->name =                   $title;
        $this->description =            $description;
        $this->slug =                   $slug;
        $this->public =                 (int) $public;
        $this->default_base_layer =     2;
        $this->top_element =            'map';
        $this->items_h_pos =            'right';
        $this->items_v_pos =            'bottom';
        $this->items_height =           'full';
        $this->is_map =                 1;
        $this->is_timeline =            1;
        $this->is_items =               1;
        $this->is_context_band =        1;
        $this->image_id =               null;

        // Check for image.
        if (is_numeric($image)) {
            $this->image_id = $image;
        }

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
     * Save default viewport positions.
     *
     * @param string $mapCenter The center for the map.
     * @param string $mapZoom The integer zoom value.
     * @param string $timelineCenter The timestamp for the timeline focus.
     * @param string $timelineZoom The timeline zoom level.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportPositions(
        $mapCenter,
        $mapZoom,
        $timelineCenter,
        $timelineZoom
    )
    {

        // Set values.
        $this->default_map_bounds = $mapCenter;
        $this->default_map_zoom = intval($mapZoom);
        $this->default_focus_date = $timelineCenter;
        $this->default_timeline_zoom = $timelineZoom;
        $this->save();

    }

    /**
     * Save viewport arrangement.
     *
     * @param boolean $isMap True if map is present.
     * @param boolean $isTimeline True if timeline is present.
     * @param boolean $isItems True if items is present.
     * @param string $topElement 'map' or 'timeline'.
     * @param string $itemsHorizPos 'left' or 'right'.
     * @param string $itemsVertPos 'top' or 'bottom'.
     * @param string $itemsHeight 'full' or 'partial'.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportArrangement(
        $isMap,
        $isTimeline,
        $isItems,
        $topElement,
        $itemsHorizPos,
        $itemsVertPos,
        $itemsHeight,
        $hPercent,
        $vPercent
    )
    {

        // Set values.
        $this->is_map =             $isMap;
        $this->is_timeline =        $isTimeline;
        $this->is_items =           $isItems;
        $this->top_element =        $topElement;
        $this->items_h_pos =        $itemsHorizPos;
        $this->items_v_pos =        $itemsVertPos;
        $this->items_height =       $itemsHeight;
        $this->h_percent =          $hPercent;
        $this->v_percent =          $vPercent;
        $this->save();

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
        if (!in_array('default_' . $style, self::$styles)) {
            return false;
        }

        // If the value does not match the system default.
        else if ($value != get_option($style)) {
            $this['default_' . $style] = $value;
            return true;
        }

        // If the value matches the system default and there is an existing
        // row-level value on the exhibit.
        else if ($value == get_option($style) &&
            !is_null($this['default_' . $style])) {
                $this['default_' . $style] = null;
                return true;
        }

        return false;

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
        if (!is_null($this['default_' . $style])) {
            return $this['default_' . $style];
        }

        // Fall back to system default.
        else {
            return get_option($style);
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
        if (is_null($this->default_base_layer)) {
            return $_layersTable->fetchObject(
                $_layersTable->getSelect()->where('name = "Google Physical"')
            );
        }

        // If exhibit value is set, return the setting.
        else {
            return $_layersTable->find($this->default_base_layer);
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
            'horizontal' =>     get_option('h_percent'),
            'vertical' =>       get_option('v_percent')
        );

        // Use row-specifc values if present.
        if (!is_null($this->h_percent) && !is_null($this->v_percent)) {
            $proportions['horizontal'] =    $this->h_percent;
            $proportions['vertical'] =      $this->v_percent;
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
        return !is_null($this->default_timeline_zoom) ?
            $this->default_timeline_zoom :
            (int) get_option('timeline_zoom');
    }

    /**
     * Set the 'modified' column to the current timestamp.
     *
     * @return void.
     */
    public function setModified()
    {
        $this->modified = neatline_getTimestamp();
    }

    /**
     * Update the `modified` field on save.
     *
     * @return void.
     */
    public function save()
    {
        $this->setModified();
        parent::save();
    }

    /**
     * Call native save.
     *
     * @return void.
     */
    public function parentSave()
    {
        parent::save();
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

}
