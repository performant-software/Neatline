<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Public-facing views.
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

class Neatline_PublicController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        $this->_filesTable = $this->getTable('File');
        $this->_neatlinesTable = $this->getTable('NeatlineExhibit');

    }

    /**
     * Public-facing in-theme Neatline exhibit.
     *
     * @return void
     */
    public function showAction()
    {

        // Get records and shell out defaults.
        $id =                       $this->_request->getParam('id');
        $neatline =                 $this->_neatlinesTable->find($id);
        $map =                      $neatline->getMap();
        $image =                    $neatline->getImage();

        // Construct the data array for the exhibit.
        $neatlineData = array(
            'public' =>             true,
            'neatline' =>           $neatline,
            'dataSources' => array(
                'timeline' =>       neatline_getTimelineDataUrl($neatline->id),
                'map' =>            neatline_getMapDataUrl($neatline->id),
                'undated' =>        neatline_getUndatedItemsDataUrl($neatline->id)
            )
        );

        // Push the map into the view.
        if ($map) {

            // Instantiate the map.
            $map = new GeoserverMap_Map($map);

            // Add to the parameters array.
            $neatlineData['map'] = array(
                'boundingBox' =>    $map->boundingBox,
                'epsg' =>           $map->epsg,
                'wmsAddress' =>     $map->wmsAddress,
                'layers' =>         $map->layers
            );

        }

        // Push image data into the view.
        else if ($neatline->is_map == 1 && !is_null($neatline->image_id)) {

            // Get the image and dimensions.
            $image = $this->_filesTable->find($neatline->image_id);

            // Add the parameters array.
            $neatlineData['image'] = array(
                'record' =>         $image,
                'path' =>           $image->getWebPath('archive'),
                'name' =>           $image->original_filename
            );

        }

        // Push records.
        $this->view->neatline =     $neatline;
        $this->view->neatlineData = $neatlineData;
        $this->view->map =          $map;

    }

    /**
     * Public-facing fullscreen Neatline exhibit.
     *
     * @return void
     */
    public function fullscreenAction()
    {

        // Get records and shell out defaults.
        $id =                       $this->_request->getParam('id');
        $neatline =                 $this->_neatlinesTable->find($id);
        $map =                      $neatline->getMap();
        $image =                    $neatline->getImage();

        // Construct the data array for the exhibit.
        $neatlineData = array(
            'public' =>             true,
            'neatline' =>           $neatline,
            'dataSources' => array(
                'timeline' =>       neatline_getTimelineDataUrl($neatline->id),
                'map' =>            neatline_getMapDataUrl($neatline->id),
                'undated' =>        neatline_getUndatedItemsDataUrl($neatline->id)
            )
        );

        // Push the map into the view.
        if ($map) {

            // Instantiate the map.
            $map = new GeoserverMap_Map($map);

            // Add to the parameters array.
            $neatlineData['map'] = array(
                'boundingBox' =>    $map->boundingBox,
                'epsg' =>           $map->epsg,
                'wmsAddress' =>     $map->wmsAddress,
                'layers' =>         $map->layers
            );

        }

        // Push image data into the view.
        else if ($neatline->is_map == 1 && !is_null($neatline->image_id)) {

            // Get the image and dimensions.
            $image = $this->_filesTable->find($neatline->image_id);

            // Add the parameters array.
            $neatlineData['image'] = array(
                'record' =>         $image,
                'path' =>           $image->getWebPath('archive'),
                'name' =>           $image->original_filename
            );

        }

        // Push records.
        $this->view->neatline =     $neatline;
        $this->view->neatlineData = $neatlineData;
        $this->view->map =          $map;

    }

}
