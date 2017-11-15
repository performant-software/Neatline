<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibit extends Neatline_Row_Expandable
    implements Zend_Acl_Resource_Interface
{


    public $owner_id = 0;
    public $added;
    public $modified;
    public $published;
    public $item_query;
    public $spatial_layers;
    public $spatial_layer;
    public $image_layer;
    public $image_height;
    public $image_width;
    public $zoom_levels = 20;
    public $wms_address;
    public $wms_layers;
    public $widgets;
    public $title;
    public $slug;
    public $narrative;
    public $spatial_querying = 1;
    public $public = 0;
    public $styles;
    public $map_focus;
    public $map_zoom;
    public $map_min_zoom;
    public $map_max_zoom;
    public $map_restricted_extent;
    public $accessible_url;

    protected function _initializeMixins()
    {
        parent::_initializeMixins();
        $this->_mixins[] = new Mixin_Timestamp($this, 'added', null);
    }

    /**
     * Set exhibit search text.
     */
    protected function afterSave($args)
    {
        // reinitialize mixins, otherwise a duplicate exhibit will incorrectly populate search text for the original
        $this->_mixins = array();
        $this->_initializeMixins();

        if ($this->private) {
          $this->setSearchTextPrivate();
        }

        $this->setSearchTextTitle($this->title);
        $this->addSearchText($this->title);
        $this->addSearchText($this->narrative);
    }


    /**
     * If the exhibit is being published to the public site for the first
     * time, set the `published` timestamp.
     *
     * @param array $values The POST/PUT data.
     */
    public function saveForm($values)
    {

        // Assign the values.
        $this->setArray($values);

        // If the exhibit is being set "public" for the first time, set the
        // `published` timestamp to the current date.

        if (is_null($this->published) && $this->public == 1) {
            $this->published = date(self::DATE_FORMAT);
        }

        $this->save();

    }


    /**
     * Get the number of active records in the exhibit.
     *
     * @return integer The record count.
     */
    public function getNumberOfRecords()
    {
        return $this->getTable('NeatlineRecord')->count(array(
            'exhibit_id' => $this->id
        ));
    }


    /**
     * Get the routing parameters or the URL string for the exhibit.
     *
     * @param string $action The controller action.
     */
    public function getRecordUrl($action = 'show')
    {
        if ($action = 'show') {
          $params = array('action' => $action, 'slug' => $this->slug);
          return public_url($params, 'neatline');
        }

        $urlHelper = new Omeka_View_Helper_Url;
        $params = array('action' => $action, 'id' => $this->id);
        return $urlHelper->url($params, 'neatlineActionId');
    }


    /**
     * Check whether a widget is enabled.
     *
     * @param string $widget The id of the widget.
     * @return boolean True if the widget is enabled.
     */
    public function hasWidget($id)
    {
        return in_array($id, nl_explode($this->widgets));
    }


    /**
     * Update records in an exhibit according to the style definitions in the
     * `styles` CSS. For example, if `styles` is:
     *
     * .tag {
     *   fill-color: #ffffff;
     *   stroke-color: auto;
     * }
     *
     * The `fill_color` on records tagged with `tag` will be set to `#ffffff`,
     * but the stroke color will be left as-is since no explicit value is set
     * in the CSS.
     */
    public function pushStyles()
    {

        // Parse the stylesheet.
        $css = nl_readCSS($this->styles);

        // Load records table.
        $recordsTable = $this->getTable('NeatlineRecord');

        // Gather style columns.
        $valid = nl_getStyles();

        foreach ($css as $tag => $rules) {

            $where = array('exhibit_id = ?' => $this->id);

            // If selector is `all`, update all records in the exhibit;
            // otherwise, just match records with the tag.
            if ($tag != 'all') {
                $where['MATCH (tags) AGAINST (? IN BOOLEAN MODE)'] = $tag;
            }

            // Walk valid CSS rules.
            $set = array();
            foreach ($rules as $prop => $val) {
                if (in_array($prop, $valid)) {

                    // Push value if not `auto` or `none`.
                    if ($val != 'auto' && $val != 'none') {
                        $set[$prop] = $val;
                    }

                    // If `none`, push NULL.
                    else if ($val == 'none') {
                        $set[$prop] = null;
                    }

                }
            }

            // Update records.
            if (!empty($set)) $recordsTable->update(
                $recordsTable->getTableName(), $set, $where
            );

        }

    }


    /**
     * Update the exhibit stylesheet with values from a specific record. For
     * example, if `styles` is:
     *
     * .tag {
     *   fill-color: #111111;
     *   stroke-color: #222222;
     * }
     *
     * And the record is tagged with `tag` has a `fill_color` of `#333333` and
     * a `stroke_color` of `#444444`, the stylesheet would be updated to:
     *
     * .tag {
     *   fill-color: #333333;
     *   stroke-color: #444444;
     * }
     *
     * @param NeatlineRecord $record The record to update from.
     */
    public function pullStyles($record)
    {

        // Parse the stylesheet.
        $css = nl_readCSS($this->styles);

        // Explode record tags.
        $tags = nl_explode($record->tags);

        // Gather style columns.
        $valid = nl_getStyles();

        foreach ($css as $selector => $rules) {

            // Is the record tagged with the selector?
            if (in_array($selector, $tags) || $selector == 'all') {

                // Scan valid rule definitions.
                foreach ($rules as $prop => $val) {

                    // Is the property valid?
                    if (in_array($prop, $valid)) {

                        // Get the record value.
                        $value = !is_null($record->$prop) ?
                            $record->$prop : 'none';

                        // Update the CSS.
                        $css[$selector][$prop] = $value;

                    }

                }

            }

        }

        // Recompile the stylesheet.
        $this->styles = nl_writeCSS($css);

    }


    /**
     * Measure the size of the image defined by `image_layer`. Wrapped in a
     * try/catch so that it's possible to work with exhibits offline.
     */
    public function compileImageSize()
    {
        if (!is_null($this->image_layer)) {
            try {
                $size = getimagesize($this->image_layer);
                $this->image_height = $size[1];
                $this->image_width  = $size[0];
            } catch (Exception $e) {}
        }
    }


    /**
     * Delete all records that belong to the exhibit.
     */
    public function deleteChildRecords()
    {

        // Get records table and name.
        $recordsTable = $this->getTable('NeatlineRecord');
        $rName = $recordsTable->getTableName();

        // Gather record expansion tables.
        foreach (nl_getRecordExpansions() as $expansion) {

            $eName = $expansion->getTableName();

            // Delete expansion rows on child records.
            $this->_db->query("DELETE $eName FROM $eName
                INNER JOIN $rName ON $eName.parent_id = $rName.id
                WHERE $rName.exhibit_id = $this->id
            ");

        }

        // Delete child records.
        $recordsTable->delete(
            $rName, array('exhibit_id=?' => $this->id)
        );

    }


    /**
     * Measure the image layer when the exhibit is * saved.
     */
    protected function beforeSave($args)
    {
        if (ini_get('allow_url_fopen')) {
            $this->compileImageSize();
        }
    }


    /**
     * Delete all child records when the exhibit is deleted.
     */
    protected function beforeDelete()
    {
        $this->deleteChildRecords();
    }


    /**
     * Associate the model with an ACL resource id.
     *
     * @return string The resource id.
     */
    public function getResourceId()
    {
        return 'Neatline_Exhibits';
    }

}
