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

class NeatlineExhibit extends Neatline_AbstractRecord
{


    public $added;          // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    public $modified;       // TIMESTAMP NULL
    public $base_layers;    // VARCHAR(100) NULL
    public $base_layer;     // TINYTEXT NULL
    public $title;          // TEXT NULL
    public $slug;           // VARCHAR(100) NOT NULL
    public $description;    // TEXT NULL
    public $public = 0;     // TINYINT(1) NOT NULL
    public $styles;         // TEXT NULL
    public $map_focus;      // VARCHAR(100) NULL
    public $map_zoom;       // INT(10) UNSIGNED NULL


    /**
     * Synchronize the values in the stylesheet to match the values on the
     * passed record. For example, if `styles` on the exhibit is:
     *
     * tag:
     *  - vector_color: "#ffffff"
     *  - stroke_color
     *
     * And the passed record is tagged with `tag` has has a `vector_color`
     * of "#000000" and a `stroke_color` of "#f0f0f0", the stylesheet YAML
     * should be updated to:
     *
     * tag:
     *  - vector_color: "#000000"
     *  - stroke_color: "#f0f0f0"
     *
     * @param NeatlineRecord $record The record to update from.
     */
    public function updateStyles($record)
    {

        // Prase the styles YAML.
        $yaml = Spyc::YAMLLoad($this->styles);

        // Gather style columns.
        $valid = _nl_getStyles();

        // Walk record tags.
        foreach (_nl_explode($record->tags) as $tag) {

            // If the tag is styled.
            if (array_key_exists($tag, $yaml)) {
                // Walk tag properties.
                foreach ($yaml[$tag] as $i => $prop) {

                    // Property has value. eg:
                    // tag:
                    //  - vector_color: "#000000"
                    if (is_array($prop)) { $key = key($prop);
                        // If the property is valid.
                        if (in_array($key, $valid)) {
                            // Update the stylesheet.
                            $yaml[$tag][$i][$key] = $record->$key;
                        }
                    }

                    // Property has no value.
                    // tag:
                    //  - vector_color
                    if (is_string($prop)) {
                        // If the property is valid.
                        if (in_array($prop, $valid)) {
                            // Update the stylesheet.
                            $yaml[$tag][$i] = array(
                                $prop => $record->$prop
                            );
                        }
                    }

                }
            }

        }

        // Re-convert to YAML.
        $this->styles = Spyc::YAMLDump($yaml, 1, false);

    }


    /**
     * Get the number of active records in the exhibit.
     *
     * @return integer The record count.
     */
    public function getNumberOfRecords()
    {
        $recordsTable = $this->getTable('NeatlineRecord');
        return $recordsTable->countActiveRecordsByExhibit($this);
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
