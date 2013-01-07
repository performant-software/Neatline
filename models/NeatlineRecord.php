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
    public $title;              // MEDIUMTEXT COLLATE utf8_unicode_ci NULL
    public $body;               // MEDIUMTEXT COLLATE utf8_unicode_ci NULL
    public $tags;               // TEXT COLLATE utf8_unicode_ci NULL
    public $coverage;           // GEOMETRY
    public $map_active;         // TINYINT(1) NULL
    public $map_focus;          // VARCHAR(100) NULL
    public $map_zoom;           // INT(10) UNSIGNED NULL


    protected $styles   = array();
    protected $taggable = array();


    /**
     * Set foreign keys.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $exhibit The exhibit record.
     */
    public function __construct($exhibit = null, $item = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id   = $exhibit->id;
        if (!is_null($item))    $this->item_id      = $item->id;
    }


    /**
     * Set attribute. If the property is a style (with a column prefixed
     * by `_`), add it to the protected `styles` array.
     *
     * @param string $property The property.
     * @param mixed $value The value.
     */
    public function __set($property, $value)
    {
        $this->getTaggable();
        // TODO|dev
    }


    /**
     * Get attribute. If the property is a style (with a column prefixed
     * by `_`), add the underscore to the property and get the value.
     *
     * @param mixed $value The value.
     */
    public function __get($property)
    {
        $this->getTaggable();
        // TODO|dev
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

        // Add coverage.
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
        return array_merge ($fields, $this->styles);

    }


    /**
     * Set a field if the passed value is not null or ''.
     *
     * @param string $field The name of the fiel.
     * @param boolean $value The value to set.
     */
    public function setNotEmpty($field, $value)
    {
        if (trim($value) == '') $this->$field = null;
        else $this->$field = $value;
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
     * @param string $coverage The coverage as plaintext WKT.
     * @return array The map JSON.
     **/
    public function buildJsonData($coverage=null) {

        $data = array(

            'id'                => $this->id,
            'item_id'           => $this->item_id,

            // TEXT
            'title'             => $this->title,
            'body'              => $this->body,
            'slug'              => $this->slug,

            // STYLE
            'vector_color'      => $this->vector_color,
            'stroke_color'      => $this->stroke_color,
            'select_color'      => $this->select_color,
            'vector_opacity'    => $this->vector_opacity,
            'select_opacity'    => $this->select_opacity,
            'stroke_opacity'    => $this->stroke_opacity,
            'image_opacity'     => $this->image_opacity,
            'stroke_width'      => $this->stroke_width,
            'point_radius'      => $this->point_radius,
            'point_image'       => $this->point_image,
            'min_zoom'          => $this->min_zoom,
            'max_zoom'          => $this->max_zoom,

            // SPATIAL
            'map_active'        => $this->map_active,
            'map_focus'         => $this->map_focus,
            'map_zoom'          => $this->map_zoom,
            'coverage'          => $coverage

        );

        return $data;

    }


    /**
     * Insert or update the record. Overrides the default in order to make
     * it possible to pass MySQL expressions as values on insert/update,
     * which is needed to set the `coverage` field with `GeomFromText()`.
     */
    public function save()
    {
        $this->id = $this->insertOrUpdate($this->toArray());
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
     * Get a list of taggable attributes.
     *
     * @return array $taggable The attributes.
     */
    public function getTaggable()
    {
        if (empty($this->taggable)) {
            $this->taggable = apply_filters(
                'neatline_styles', $this->taggable
            );
        }
    }


}
