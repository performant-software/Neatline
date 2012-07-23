<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Row class for Neatline data record.
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

class NeatlineDataRecord extends Omeka_record
{

    /**
     * Record attributes.
     */

    // Foreign keys.
    public $item_id;
    public $exhibit_id;
    public $parent_record_id;

    // Statuses.
    public $use_dc_metadata;
    public $show_bubble;

    // Text fields.
    public $title;
    public $slug;
    public $description;

    // Dates.
    public $start_date;
    public $end_date;
    public $start_visible_date;
    public $end_visible_date;
    public $left_percent;
    public $right_percent;

    // Styles.
    public $vector_color;
    public $stroke_color;
    public $highlight_color;
    public $vector_opacity;
    public $select_opacity;
    public $stroke_opacity;
    public $graphic_opacity;
    public $stroke_width;
    public $point_radius;
    public $point_image;

    // Coverage.
    public $geocoverage;
    public $map_bounds;
    public $map_zoom;

    // Statuses and ordering.
    public $space_active;
    public $time_active;
    public $items_active;
    public $display_order;

    // For caching.
    protected $_parent;
    protected $_exhibit;

    /**
     * Default attributes.
     */
    private static $defaults = array(
        'left_percent' => 0,
        'right_percent' => 100,
        'geocoverage' => 'POINT()'
    );

    /**
     * Valid style attribute names.
     */
    private static $styles = array(
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
     * DC Date regular expression.
     */
    private static $dcDateRegex =
        '/^(?P<start>[0-9:\-\s]+)(\/(?P<end>[0-9:\-\s]+))?/';


    /**
     * Instantiate and foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return Omeka_record $this.
     */
    public function __construct($item = null, $neatline = null)
    {

        parent::__construct();

        // If defined, set the item key.
        if (!is_null($item)) {
            $this->item_id = $item->id;
        }

        // If defined, set the item key.
        if (!is_null($neatline)) {
            $this->exhibit_id = $neatline->id;
        }

        // Set defaults.
        $this->show_bubble = 1;
        $this->left_percent = 0;
        $this->right_percent = 100;
        $this->space_active = 0;
        $this->time_active = 0;
        $this->items_active = 0;

        $this->_parent = null;
        $this->_exhibit = null;

    }

    /**
     * Get the parent item record.
     *
     * @return Omeka_record $item The parent item.
     */
    public function getItem()
    {

        $item = null;

        // If record id is defined, get item.
        if (!is_null($this->item_id)) {
           $item = $this->getTable('Item')->find($this->item_id);
        }

        return $item;

    }

    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record $exhibit The parent exhibit.
     */
    public function getExhibit()
    {

        if (is_null($this->_exhibit)) {
            $this->_exhibit = $this
                ->getTable('NeatlineExhibit')
                ->find($this->exhibit_id);
        }

        return $this->_exhibit;

    }

    /**
     * Get the parent data record.
     *
     * @return Omeka_record $record The parent record.
     */
    public function getParentRecord()
    {

        if (!is_null($this->parent_record_id) && is_null($this->_parent)) {
            $this->_parent = $this
                ->getTable('NeatlineDataRecord')
                ->find($this->parent_record_id);
        }

        return $this->_parent;

    }

    /**
     * Construct a JSON representation of the attributes to be used in the
     * item edit form.
     *
     * @return JSON The data.
     */
    public function buildEditFormJson()
    {

        // Shell out the array.
        $data = array();

        // Get parent record select list.
        $_recordsTable = $this->getTable('NeatlineDataRecord');
        $records = $_recordsTable->getRecordsForSelect($this->getExhibit(), $this);

        // Set the array values.
        $data['title'] =                $this->getTitle();
        $data['slug'] =                 $this->getNotEmpty('slug');
        $data['description'] =          $this->getDescription();
        $data['vector_color'] =         $this->getStyle('vector_color');
        $data['stroke_color'] =         $this->getStyle('stroke_color');
        $data['highlight_color'] =      $this->getStyle('highlight_color');
        $data['vector_opacity'] =       (int) $this->getStyle('vector_opacity');
        $data['select_opacity'] =       (int) $this->getStyle('select_opacity');
        $data['stroke_opacity'] =       (int) $this->getStyle('stroke_opacity');
        $data['graphic_opacity'] =      (int) $this->getStyle('graphic_opacity');
        $data['stroke_width'] =         (int) $this->getStyle('stroke_width');
        $data['point_radius'] =         (int) $this->getStyle('point_radius');
        $data['point_image'] =          $this->getNotEmpty('point_image');
        $data['start_date'] =           (string) $this->getStartDate();
        $data['end_date'] =             (string) $this->getEndDate();
        $data['start_visible_date'] =   (string) $this->start_visible_date;
        $data['end_visible_date'] =     (string) $this->end_visible_date;
        $data['left_percent'] =         (int) $this->getLeftPercent();
        $data['right_percent'] =        (int) $this->getRightPercent();
        $data['parent_record_id'] =     $this->getParentRecordId();
        $data['use_dc_metadata'] =      $this->use_dc_metadata;
        $data['show_bubble'] =          $this->show_bubble;
        $data['geocoverage'] =          $this->getGeocoverage();
        $data['records'] =              $records;

        return $data;

    }

    /**
     * Construct a starting attribute set for an Omeka-item-based record.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $exhibit The exhibit record.
     *
     * @return JSON The data.
     */
    public static function buildEditFormForNewRecordJson($item, $exhibit)
    {

        // Shell out the array.
        $data = array();

        // Get parent record select list.
        $_db = get_db();
        $_recordsTable = $_db->getTable('NeatlineDataRecord');
        $records = $_recordsTable->getRecordsForSelect($exhibit);

        // Set the array values.
        $data['vector_color'] =         get_option('vector_color');
        $data['stroke_color'] =         get_option('stroke_color');
        $data['highlight_color'] =      get_option('highlight_color');
        $data['vector_opacity'] =       (int) get_option('vector_opacity');
        $data['select_opacity'] =       (int) get_option('select_opacity');
        $data['stroke_opacity'] =       (int) get_option('stroke_opacity');
        $data['graphic_opacity'] =      (int) get_option('graphic_opacity');
        $data['stroke_width'] =         (int) get_option('stroke_width');
        $data['point_radius'] =         (int) get_option('point_radius');
        $data['point_image'] =          '';
        $data['left_percent'] =         self::$defaults['left_percent'];
        $data['right_percent'] =        self::$defaults['right_percent'];
        $data['start_date'] =           '';
        $data['end_date'] =             '';
        $data['start_visible_date'] =   '';
        $data['end_visible_date'] =     '';
        $data['slug'] =                 '';
        $data['parent_record_id'] =     'none';
        $data['records'] =              $records;
        $data['use_dc_metadata'] =      0;
        $data['show_bubble'] =          1;

        // Get DC title default.
        $data['title'] = neatline_getItemMetadata(
            $item,
            'Dublin Core',
            'Title');

        // Get DC description default.
        $data['description'] = neatline_getItemMetadata(
            $item,
            'Dublin Core',
            'Description');

        // Get DC date default.
        $date = neatline_getItemMetadata(
            $item,
            'Dublin Core',
            'Date');

        // Check for date format, assign pieces.
        if (preg_match(self::$dcDateRegex, $date, $matches)) {

            // Start.
            $data['start_date'] = $matches['start'];

            // End.
            if (array_key_exists('end', $matches)) {
                $data['end_date'] = $matches['end'];
            }

        }

        return $data;

    }


    /**
     * Setters.
     */


    /**
     * Set the an attribute if the passed value is not null or ''.
     *
     * @param string $attribute The name of the attribute.
     * @param boolean $value The value to set.
     *
     * @return void.
     */
    public function setNotEmpty($attribute, $value)
    {

        if ($value == '') {
            $this[$attribute] = null;
        }

        else {
            $this[$attribute] = $value;
        }

    }

    /**
     * Set the slug if it is unique.
     *
     * @param boolean $slug The slug.
     *
     * @return void.
     */
    public function setSlug($slug)
    {

        // Get records table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Set the record value if it is unique.
        if ($_recordsTable->slugIsAvailable($this, $this->getExhibit(), $slug)) {
            $this->slug = $slug;
        }

    }

    /**
     * Set the space_active or time_active attributes. Reject non-
     * boolean parameters.
     *
     * @param string $viewport 'items', 'space', or 'time'.
     * @param boolean $value The value to set.
     *
     * @return boolean True if the set succeeds.
     */
    public function setStatus($viewport, $value)
    {

        if (!is_bool($value)) {
            return false;
        }

        // Cast the boolean to int.
        $intValue = (int) $value;

        // If items.
        if ($viewport == 'items') {
            $this->items_active = $intValue;
        }

        // If space.
        else if ($viewport == 'space') {
            $this->space_active = $intValue;
        }

        // If time.
        else if ($viewport == 'time') {
            $this->time_active = $intValue;
        }

        return true;

    }

    /**
     * Set the left_percent or right_percent attributes. Only accept integers
     * between 0 and 100, and require that the right value always be greater
     * than or equal to the left.
     *
     * @param integer $left The left-hand value.
     * @param integer $right The right-hand value.
     *
     * @return boolean True if the set succeeds.
     */
    public function setPercentages($left, $right)
    {

        if (!is_int($left) ||
            !is_int($right) ||
            !(0 <= $left && $left <= $right && $right <= 100)) {
            return false;
        }

        $this->left_percent = $left;
        $this->right_percent = $right;

        return true;

    }

    /**
     * Set the geocoverage field if the passed value is not <string>'null', which
     * is true when there was not an instantiated map when the  triggering save
     * action was performed in the editor.
     *
     * @param integer $value The value.
     *
     * @return boolean True if the set succeeds.
     */
    public function setGeocoverage($value)
    {

        if ($value == 'null') {
            return false;
        }

        return $this->setNotEmpty('geocoverage', $value);

    }

    /**
     * Set a style attribute. If there is an exhibit default, only set
     * if the passed value is different. If there is no exhibit default,
     * only set if the passed value is different from the system
     * default. If a non-style column name is passed, return false.
     *
     * @param string style The name of the style.
     * @param mixed $value The value to set.
     *
     * @return boolean True if the set succeeds.
     */
    public function setStyle($style, $value)
    {

        // If a non-style property is passed, return false.
        if (!in_array($style, self::$styles)) {
            return false;
        }

        // Get the exhibit.
        $exhibit = $this->getExhibit();

        // If there is a parent record.
        if (!is_null($this->parent_record_id)) {

            // If the value does not match the parent style, set.
            $parent = $this->getParentRecord();
            if ($value != $parent->getStyle($style)) {
                $this[$style] = $value;
                return true;
            }

        }

        // If there is an exhibit default.
        if (!is_null($exhibit['default_' . $style])) {

            // If the value does not match the default.
            if ($value != $exhibit['default_' . $style]) {
                $this[$style] = $value;
                return true;
            }

            // If the value matches the default and there is a non-null
            // value set on the record, null the record value.
            else if (!is_null($this[$style])) {
                $this[$style] = null;
                return true;
            }

        }

        // If the value does not match the system default.
        else if ($value != get_option($style)) {
            $this[$style] = $value;
            return true;
        }

        // If the value matches the system default and there is a non-null
        // value set on the record, null the record value.
        else if (!is_null($this[$style])) {
            $this[$style] = null;
            return true;
        }

        return false;

    }

    /**
     * Set the parent record id.
     *
     * @param integer $id The id.
     *
     * @return boolean True if a new value is set.
     */
    public function setParentRecordId($id)
    {

        // Capture original value.
        $original = $this->parent_record_id;

        // If 'none' is passed, null out the key.
        if ($id == 'none') {
            $this->parent_record_id = null;
        }

        // If the id is not the self id, set.
        else if ($id != $this->id) {
            $this->parent_record_id = $id;
        }

        // Check for new value.
        return $original != $this->parent_record_id;

    }

    /**
     * Set the use_dc_metadata parameter.
     *
     * @param integer $useDcMetadata 0/1.
     *
     * @return void.
     */
    public function setUseDcMetadata($useDcMetadata)
    {

        // If there is a parent item.
        if (!is_null($this->item_id)) {
            $this->use_dc_metadata = (int) $useDcMetadata;
        }

    }

    /**
     * Set all style attributes to null.
     *
     * @return void.
     */
    public function resetStyles()
    {

        $this->vector_color =       null;
        $this->stroke_color =       null;
        $this->highlight_color =    null;
        $this->vector_opacity =     null;
        $this->stroke_opacity =     null;
        $this->graphic_opacity =    null;
        $this->stroke_width =       null;
        $this->point_radius =       null;

    }


    /**
     * Getters.
     */



    /**
     * Set the an attribute if the passed value is not null or ''.
     *
     * @param string $attribute The name of the attribute.
     * @param boolean $value The value to set.
     *
     * @return void.
     */
    public function getNotEmpty($attribute)
    {

        if (is_null($this[$attribute])) {
            return '';
        }

        else {
            return $this[$attribute];
        }

    }

    /**
     * Get a style attribute. In order or priority, return the row
     * value, exhibit default, or system default.
     *
     * @param string style The name of the style.
     *
     * @return mixed The value.
     */
    public function getStyle($style)
    {

        // If there is a row value.
        if (!is_null($this[$style])) {
            return $this[$style];
        }

        // If there is a parent record value.
        else if (!is_null($this->parent_record_id)) {
            return $this->getParentRecord()->getStyle($style);
        }

        // If there is an exhibit default
        else {

            $exhibit = $this->getExhibit();
            // var_dump($exhibit->default_vector_color);
            if (!is_null($exhibit['default_' . $style])) {
                return $exhibit['default_' . $style];
            }

            // Fall back to system default.
            else {
                return get_option($style);
            }

        }

    }

    /**
     * Return title.
     *
     * @return string $title The title.
     */
    public function getTitle()
    {

        // Return row-level value.
        if (!is_null($this->title)) {
            return $this->title;
        }

        // If there is a parent item.
        else if (!is_null($this->item_id)) {

            // Try to get DC title.
            return neatline_getItemMetadata(
                $this->getItem(),
                'Dublin Core',
                'Title'
            );

        }

        else {
            return '';
        }

    }

    /**
     * For dropdown selects, strip HTML and truncate.
     *
     * @param integer length The max length.
     *
     * @return string $title The title.
     */
    public function getTitleForSelect($length=60)
    {

        // Get title, strip tags, truncate.
        $title = strip_tags($this->getTitle());
        $fixed = substr($title, 0, $length);

        // If the original title was longer than the max
        // length, add an elipsis to the end.
        if (strlen($title) > $length) {
            $fixed .= ' ...';
        }

        return $fixed;

    }

    /**
     * If there is a title return it; if not, try to return
     * the first portion of the description.
     *
     * @return string $title The title.
     */
    public function getTitleOrDescription()
    {

        // Return row-level value.
        $title = $this->getTitle();
        if ($title !== '') {
            return $title;
        }

        else {

            // Try to get a description.
            $description = $this->getDescription();
            if ($description !== '') {
                return substr($description, 0, 200);
            }

            else {
                return '[Untitled]';
            }

        }

    }

    /**
     * Return slug.
     *
     * @return string $slug The slug.
     */
    public function getSlug()
    {

        if (!is_null($this->slug)) {
            return $this->slug;
        }

        else {
            return '';
        }

    }

    /**
     * Return description.
     *
     * @return string $description The description.
     */
    public function getDescription()
    {

        // Build item metadata.
        if ($this->use_dc_metadata == 1) {
            /*
             * This is the biggest performance killer when calling buildMapDataArray 
             * below. If this becomes too big of an issue, we can inline the 
             * partial and use more targetted SQL queries, instead of loading 
             * the whole item and pulling the data we want out. Otherwise, 
             * we're stuck.
             * -- ERR
             */
            return __v()->partial('neatline/_dc_metadata.php', array(
                'item' => $this->getItem()
            ));
        }

        // Return row-level value.
        if (!is_null($this->description)) {
            return $this->description;
        }

        // If there is a parent item.
        else if (!is_null($this->item_id)) {

            // Try to get a DC description.
            return neatline_getItemMetadata(
                $this->getItem(),
                'Dublin Core',
                'Description'
            );

        }

        else {
            return '';
        }

    }

    /**
     * Return left percent.
     *
     * @return integer $percent The percent.
     */
    public function getLeftPercent()
    {

        return !is_null($this->left_percent) ?
            $this->left_percent :
            self::$defaults['left_percent'];

    }

    /**
     * Return right percent.
     *
     * @return integer $percent The percent.
     */
    public function getRightPercent()
    {

        return !is_null($this->right_percent) ?
            $this->right_percent :
            self::$defaults['right_percent'];

    }

    /**
     * Return coverage.
     *
     * @return string The coverage data. If there is record-specific data,
     * return it. If not, and there is a parent Omeka item, try to get a non-
     * empty value from the DC coverage field.
     */
    public function getGeocoverage()
    {

        // Return local value if one exists.
        if (!is_null($this->geocoverage) && $this->geocoverage !== '') {
            return $this->geocoverage;
        }

        // Try to get DC value.
        else if (!is_null($this->item_id)) {

            // If Neatline Features is not installed.
            if (!plugin_is_active('NeatlineFeatures')) {

                // Get the DC coverage.
                $coverage = neatline_getItemMetadata(
                    $this->getItem(),
                    'Dublin Core',
                    'Coverage'
                );

                // Return if not empty, otherwise return default.
                return ($coverage !== '') ?
                    $coverage : self::$defaults['geocoverage'];

            }

            // If Neatline Features is installed.
            else {

                // Get feature records.
                $features = $this->getTable('NeatlineFeature')
                    ->getItemFeatures($this->getItem());

                // Walk features and build array.
                $wkt = array();
                foreach ($features as $feature) {

                    // Push wkt if not null or empty.
                    if (!is_null($feature->wkt) && $feature->wkt !== '') {
                        $wkt[] = $feature->wkt;
                    }

                    // If at least one feature exists, implode and return.
                    if (count($wkt)) {
                        return implode('|', $wkt);
                    } else {
                        return self::$defaults['geocoverage'];
                    }

                }

            }

        }

        // Fall back on default string.
        else {
            return self::$defaults['geocoverage'];
        }

    }

    /**
     * Return start date.
     *
     * @return string $date The date. If there is a record-specific value,
     * return it. If not, and there is a parent Omeka item, try to get a non-
     * empty value from the DC date field.
     */
    public function getStartDate()
    {

        // If there is a record-specific date.
        if (!is_null($this->start_date)) {
            return $this->start_date;
        }

        // If not, try to get a DC date value.
        else if (!is_null($this->item_id)) {

            // Get the DC date.
            $date = neatline_getItemMetadata(
                $this->getItem(),
                'Dublin Core',
                'Date'
            );

            if (preg_match(self::$dcDateRegex, $date, $matches)) {
                return $matches['start'];
            }

        }

        // Return '' if no local or parent data.
        else {
            return '';
        }

    }

    /**
     * Return end date.
     *
     * @return string $date The date. If there is a record-specific value,
     * return it. If not, and there is a parent Omeka item, try to get a non-
     * empty value from the DC date field.
     */
    public function getEndDate()
    {

        // If there is a record-specific date.
        if (!is_null($this->end_date)) {
            return $this->end_date;
        }

        // If not, try to get a DC date value.
        else if (!is_null($this->item_id)) {

            // Get the DC date.
            $date = neatline_getItemMetadata(
                $this->getItem(),
                'Dublin Core',
                'Date'
            );

            if (preg_match(self::$dcDateRegex, $date, $matches)) {
                if (array_key_exists('end', $matches)) {
                    return $matches['end'];
                }
            }

        }

        // Return '' if no local or parent data.
        else {
            return '';
        }

    }

    /**
     * Return start visibility date.
     *
     * @return string $date The date. If there is a record-specific value,
     * return it. If not, and there is a parent data record, try to get a non-
     * empty value from the parent.
     */
    public function getStartVisibleDate()
    {

        // If there is a record-specific date.
        if (!is_null($this->start_visible_date)) {
            return $this->start_visible_date;
        }

        // If not, try to get a DC date value.
        else if (!is_null($this->parent_record_id)) {

            // Try to get the parent date.
            $parentRecord = $this->getParentRecord();
            return $parentRecord->getStartVisibleDate();

        }

        // Return '' if no local or parent data.
        else {
            return '';
        }

    }

    /**
     * Return end visibility date.
     *
     * @return string $date The date. If there is a record-specific value,
     * return it. If not, and there is a parent data record, try to get a non-
     * empty value from the parent.
     */
    public function getEndVisibleDate()
    {

        // If there is a record-specific date.
        if (!is_null($this->end_visible_date)) {
            return $this->end_visible_date;
        }

        // If not, try to get a DC date value.
        else if (!is_null($this->parent_record_id)) {

            // Try to get the parent date.
            $parentRecord = $this->getParentRecord();
            return $parentRecord->getEndVisibleDate();

        }

        // Return '' if no local or parent data.
        else {
            return '';
        }

    }

    /**
     * Get the parent record id.
     *
     * @param integer $id The id.
     *
     * @return mixed 'none' if the id is null, otherwise the id.
     */
    public function getParentRecordId()
    {

        // If 'none' is passed, null out the key.
        if (is_null($this->parent_record_id)) {
            return 'none';
        }

        // Otherwise, set integer key.
        else {
            return $this->parent_record_id;
        }

    }

    /**
     * On save, update the modified column on the parent exhibit.
     *
     * @return void.
     */
    public function save()
    {

        if (!is_null($this->exhibit_id)) {
            $exhibit = $this->getExhibit();
            $exhibit->save();
        }

        parent::save();

    }

    /**
     * This deletes this record and removes itself from all parent 
     * relationships.
     *
     * This assumes that the caller is wrapping this in a transaction somewhere 
     * up the callstack. To do this inside a transaction that this manages, use 
     * `deleteTransaction`.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function delete()
    {
        if (!is_null($this->id)) {
            $db = get_db();
            $tname = $this->getTable()->getTableName();
            $query = "
                UPDATE `$tname`
                SET parent_record_id=NULL
                WHERE parent_record_id=?;";
            $db->query($query, $this->id);

            parent::delete();
        }
    }

    /**
     * This calls `delete` in a transaction.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function deleteTransaction()
    {
        $db = get_db();
        $db->beginTransaction();
        try {
            $this->delete();
            $db->commit();
        } catch (Exception $e) {
            $db->rollback();
            throw $e;
        }
    }

    /**
     * This sets and caches the parent record.
     *
     * @param array $index An index of records.
     * @param Omeka_record $exhibit The parent exhibit.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    protected function _setParent($index, $exhibit)
    {

        // Set parent, recurse up the inheritance chain.
        if (!is_null($this->parent_record_id)
            && array_key_exists($this->parent_record_id, $index)
        ) {
            $parent = $index[$this->parent_record_id];
            $this->_parent = $parent;
            $parent->_setParent($index, $exhibit);
        }

        // Set parent exhibit.
        $this->_exhibit = $exhibit;

    }

    /**
     * This creates the data array for the map data.
     *
     * @param array $index This is the index of NeatlineDataRecord objects for 
     * caching. Optional.
     * @param array $wmss This is an index mapping item IDs to rows from the 
     * NeatlineMapsService WMS data.
     * @param Omeka_Record $exhibit The exhibit this record belongs to.
     *
     * @return array
     * @author Me
     **/
    public function buildMapDataArray(
        $index=array(), $wmss=array(), $exhibit=null
    ) {
        $data = null;

        if ($this->space_active != 1) {
            return $data;
        }

        $this->_setParent($index, $exhibit);

        $data = array(
            'id'                  => $this->id,
            'item_id'             => $this->item_id,
            'title'               => $this->getTitle(),
            'description'         => $this->getDescription(),
            'slug'                => $this->getSlug(),
            'vector_color'        => $this->getStyle('vector_color'),
            'stroke_color'        => $this->getStyle('stroke_color'),
            'highlight_color'     => $this->getStyle('highlight_color'),
            'vector_opacity'      => $this->getStyle('vector_opacity'),
            'select_opacity'      => $this->getStyle('select_opacity'),
            'stroke_opacity'      => $this->getStyle('stroke_opacity'),
            'graphic_opacity'     => $this->getStyle('graphic_opacity'),
            'stroke_width'        => $this->getStyle('stroke_width'),
            'point_radius'        => $this->getStyle('point_radius'),
            'point_image'         => $this->getNotEmpty('point_image'),
            'center'              => $this->map_bounds,
            'zoom'                => $this->map_zoom,
            'wkt'                 => $this->getGeocoverage(),
            'start_visible_date'  => $this->getStartVisibleDate(),
            'end_visible_date'    => $this->getEndVisibleDate(),
            'show_bubble'         => $this->show_bubble,
            'wmsAddress'          => null,
            'layers'              => null,
            '_native_styles'      => array(
                'vector_color'    => $this->vector_color,
                'vector_opacity'  => $this->vector_opacity,
                'stroke_color'    => $this->stroke_color,
                'stroke_opacity'  => $this->stroke_opacity,
                'stroke_width'    => $this->stroke_width,
                'graphic_opacity' => $this->graphic_opacity,
                'point_radius'    => $this->point_radius,
            )
        );

        // If the record has a parent item and Neatline Maps
        // is present.
        if (!is_null($this->item_id) && array_key_exists($this->item_id, $wmss)) {
            $wms = $wmss[$this->item_id];
            $data['wmsAddress'] = $wms['address'];
            $data['layers']     = $wms['layers'];
        }

        return $data;
    }

}
