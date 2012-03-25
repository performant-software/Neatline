<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Prepares the starting JSON output for the front-end application.
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

class NeatlineRenderer
{

    /**
     * Set the record.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     *
     * @return void.
     */
    public function __construct($exhibit)
    {
        $this->exhibit = $exhibit;
    }

    /**
     * Render parameters.
     *
     * @return array The parameter array.
     */
    public function render()
    {

        // Try to get map and image.
        $map = $this->exhibit->getMap();
        $image = $this->exhibit->getImage();

        // Shell out the base array.
        $params = array(

            // Base record object.
            'record' => $this->exhibit,

            // Data emitters.
            'dataSources' => array(
                'timeline' => neatline_getTimelineDataUrl($neatline->id),
                'map' => neatline_getMapDataUrl($neatline->id),
                'undated' => neatline_getUndatedItemsDataUrl($neatline->id)
            ),

            // Default base layer.
            'baseLayer' => $exhibit->getBaseLayer(),

            // Default timeline zoom.
            'timelineZoom' => $exhibit->getTimelineZoom(),

            // Default viewport proportions.
            'proportions' => $neatline->getViewportProportions()

        );

        // If there is a Geoserver map, push on attributes.
        if ($map) {
            $params['map'] = new GeoserverMap_Map($map);
        }

        // If there is a static image, push on attributes.
        else if ($image) {

            $params['image'] = array(

                // Filepath and filename.
                'path' => $image->getWebPath('archive'),
                'name' => $image->original_filename,

                // Dimensions
                'height' => (int) __v()->fileMetadata(
                    $image,
                    'Omeka Image File',
                    'Height'
                ),
                'width' => (int) __v()->fileMetadata(
                    $image,
                    'Omeka Image File',
                    'Height'
                )

            );

        }

    }

}
