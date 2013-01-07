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
    // public function createExhibitTag($exhibit)
    // {

    //     // Create tag.
    //     $tag = new NeatlineTag($exhibit);

    //     // Vector color:
    //     $tag->vector_color = get_plugin_ini(
    //         'Neatline', 'vector_color');

    //     // Stroke color:
    //     $tag->stroke_color = get_plugin_ini(
    //         'Neatline', 'stroke_color');

    //     // Select color:
    //     $tag->select_color = get_plugin_ini(
    //         'Neatline', 'select_color');

    //     // Vector opacity:
    //     $tag->vector_opacity = get_plugin_ini(
    //         'Neatline', 'vector_opacity');

    //     // Select opacity:
    //     $tag->select_opacity = get_plugin_ini(
    //         'Neatline', 'select_opacity');

    //     // Stroke opacity:
    //     $tag->stroke_opacity = get_plugin_ini(
    //         'Neatline', 'stroke_opacity');

    //     // Image opacity:
    //     $tag->image_opacity = get_plugin_ini(
    //         'Neatline', 'image_opacity');

    //     // Stroke width:
    //     $tag->stroke_width = get_plugin_ini(
    //         'Neatline', 'stroke_width');

    //     // Point radius:
    //     $tag->point_radius = get_plugin_ini(
    //         'Neatline', 'point_radius');

    //     // Save.
    //     $tag->save();
    //     return $tag;

    // }


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


}
