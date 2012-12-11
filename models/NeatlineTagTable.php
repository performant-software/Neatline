<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for tags.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineTagTable extends Omeka_Db_Table
{


    /**
     * Create a default style tag for an exhibit, drawing values from the
     * system defaults in the plugin.ini.
     *
     * @param Omeka_Record $exhibit The exhibit record.
     * @return Omeka_Record $tag The new tag.
     */
    public function createExhibitTag($exhibit)
    {

        // Create tag.
        $tag = new NeatlineTag($exhibit);

        // Vector color:
        $tag->vector_color = get_plugin_ini(
            'Neatline', 'vector_color');

        // Stroke color:
        $tag->stroke_color = get_plugin_ini(
            'Neatline', 'stroke_color');

        // Select color:
        $tag->select_color = get_plugin_ini(
            'Neatline', 'select_color');

        // Vector opacity:
        $tag->vector_opacity = get_plugin_ini(
            'Neatline', 'vector_opacity');

        // Select opacity:
        $tag->select_opacity = get_plugin_ini(
            'Neatline', 'select_opacity');

        // Stroke opacity:
        $tag->stroke_opacity = get_plugin_ini(
            'Neatline', 'stroke_opacity');

        // Image opacity:
        $tag->image_opacity = get_plugin_ini(
            'Neatline', 'image_opacity');

        // Stroke width:
        $tag->stroke_width = get_plugin_ini(
            'Neatline', 'stroke_width');

        // Point radius:
        $tag->point_radius = get_plugin_ini(
            'Neatline', 'point_radius');

        // Save.
        $tag->save();
        return $tag;

    }


    /**
     * Get the default style tag for an exhibit.
     *
     * @param Omeka_Record $exhibit The exhibit record.
     * @return Omeka_Record $tag The default tag.
     */
    public function getExhibitTag($exhibit)
    {
        return $this->fetchObject(
            $this->getSelect()->where('id = ?', $exhibit->tag_id)
        );
    }


    /**
     * Get a tag by its name.
     *
     * @param string $name The tag name.
     * @return Omeka_Record $exhibit The parent exhibit.
     * @return Omeka_Record $tag The tag.
     */
    public function getTagByName($exhibit, $name)
    {
        return $this->fetchObject(
            $this->getSelect()
                ->where('exhibit_id = ?', $exhibit->id)
                ->where('tag = ?', $name)
        );
    }


    /**
     * Working with a comma-delimited tag string like "tag1,tag2,tag3",
     * fetch all of the listed tags and put them into an array in the same
     * order that they appear in the string. Push the exhibit-default tag
     * onto the back of the array (the lowest-priority position) and push
     * the record-specific tag, if one exists, onto the front of the array
     * (the highest-priority position):
     *
     * array(
     *  [record default] (if exists),
     *  [tag1],
     *  [tag2],
     *  [tag3],
     *  [exhibit default]
     * );
     *
     * @param string $tags The tag string.
     * @param Omeka_Record $record The record.
     * @return array(Omeka_Record) The ordered array.
     */
    public function getTagStack($tags, $record)
    {

        $stack = array();

        // Strip all spaces, explode on ','.
        $tags = explode(',', str_replace(' ', '', $tags));
        $exhibit = $record->getExhibit();

        // Push the tags.
        foreach ($tags as $t) {
            array_push($stack, $this->getTagByName($exhibit, $t));
        }

        // Push front the record default.
        if (!is_null($record->tag_id)) {
            array_unshift($stack, $this->find($record->tag_id));
        }

        // Push back the exhibit default.
        array_push($stack, $this->getExhibitTag($exhibit));

        return $stack;

    }


}
